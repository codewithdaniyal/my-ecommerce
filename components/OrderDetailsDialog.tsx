import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import PriceFormatter from "./PriceFormatter";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: any; // Sanity image type
}

interface OrderProduct {
  product: Product;
  quantity: number;
}

interface Order {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  email: string;
  status: string;
  totalPrice: number;
  currency: string;
  amountDiscount: number;
  products: OrderProduct[];
}

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  // Add debugging logs
  console.log('OrderDetailsDialog - Full order:', order);
  console.log('OrderDetailsDialog - Products:', order?.products);

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
        </DialogHeader>

        {/* Customer Information */}
        <div className="mt-4 space-y-2">
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                order.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
          </p>
        </div>

        {/* Products Table */}
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products && order.products.length > 0 ? (
                order.products.map((product) => {
                  // Generate a unique key using product reference ID or combination of properties
                  const uniqueKey = product.product?._id || 
                    `${order.orderNumber}-${product.product?.name}-${product.quantity}`;
                  
                  // Calculate subtotal for each product
                  const subtotal = (product.quantity || 0) * (product.product?.price || 0);

                  return (
                    <TableRow key={uniqueKey}>
                      <TableCell className="flex items-center gap-2">
                        {product?.product?.image && (
                          <div className="relative w-12 h-12">
                            <Image
                              src={urlFor(product.product.image).url()}
                              alt={product.product.name || "Product image"}
                              fill
                              className="object-cover border rounded-sm"
                            />
                          </div>
                        )}
                        <span className="ml-2">{product?.product?.name}</span>
                      </TableCell>
                      <TableCell>{product?.quantity}</TableCell>
                      <TableCell>
                        <PriceFormatter
                          amount={product?.product?.price}
                          className="text-black font-medium"
                        />
                      </TableCell>
                      <TableCell>
                        <PriceFormatter
                          amount={subtotal}
                          className="text-black font-medium"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No products found in this order
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order Summary */}
        <div className="mt-6 space-y-2 text-right">
          <div>
            <strong>Subtotal: </strong>
            <PriceFormatter
              amount={order?.totalPrice}
              className="text-black font-medium"
            />
          </div>
          <div>
            <strong>Total: </strong>
            <PriceFormatter
              amount={order?.totalPrice}
              className="text-black font-bold text-lg"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;