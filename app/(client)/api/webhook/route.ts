import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers(); // Await the headers()
  const sig = headersList.get("stripe-signature"); // Now this works

  if (!sig) {
    console.error("No stripe signature found");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe webhook secret is not set");
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await createOrderInSanity(session);
      console.log("Order created successfully:", order._id);
      return NextResponse.json({ received: true, orderId: order._id });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  if (!session?.metadata) {
    throw new Error("No metadata found in session");
  }

  // Fetch line items with expanded product details
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  // Extract metadata
  const {
    orderNumber,
    customerName,
    customerEmail,
    clerkUserId,
  } = session.metadata as unknown as Metadata;

  // Validate required fields
  if (!orderNumber || !customerName || !customerEmail || !clerkUserId) {
    throw new Error("Missing required metadata fields");
  }

  // Format products array for Sanity
  const sanityProducts = lineItems.data.map((item) => {
    const product = item.price?.product as Stripe.Product;
    if (!product?.metadata?.id) {
      throw new Error(`Product ID not found in metadata for item: ${item.id}`);
    }

    return {
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: product.metadata.id, // Sanity product ID
      },
      quantity: item.quantity || 0,
    };
  });

  // Create order document in Sanity
  const orderData = {
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: session.payment_intent as string,
    stripeCustomerId: session.customer as string,
    clerkUserId,
    customerName,
    email: customerEmail,
    products: sanityProducts,
    totalPrice: (session.amount_total || 0) / 100,
    currency: session.currency || "usd",
    amountDiscount: (session.total_details?.amount_discount || 0) / 100,
    status: "paid",
    orderDate: new Date().toISOString(),
  };

  // Validate order data before creation
  if (!orderData.products.length) {
    throw new Error("No products found in order");
  }

  try {
    const order = await backendClient.create(orderData);
    return order;
  } catch (error) {
    console.error("Error creating order in Sanity:", error);
    throw new Error(`Failed to create order in Sanity: ${error}`);
  }
}