import { client } from "@/sanity/lib/client";

export const getMyOrders = async (clerkUserId: string) => {
  const query = `*[_type == "order" && clerkUserId == $clerkUserId] | order(orderDate desc) {
    orderNumber,
    orderDate,
    customerName,
    email,
    status,
    totalPrice,
    currency,
    amountDiscount,
    products[] {
      quantity,
      product-> {
        _id,
        name,
        price,
        image
      }
    }
  }`;

  return client.fetch(query, { clerkUserId });
};