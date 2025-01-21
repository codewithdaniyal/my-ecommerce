import { SALE_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const DiscountBanner = async ({ sales }: { sales: SALE_QUERYResult }) => {
  return (
    <div className="w-full relative mt-4"> {/* Added margin-top to push the banner below */}
      {sales.map((sale) => (
        <div key={sale?._id} className="relative w-full h-[600px] overflow-hidden">
          {sale?.image && (
            <Image
              src={urlFor(sale?.image).url()}
              alt="Banner Image"
              layout="fill"
              objectFit="cover"
              priority
              className="transition-transform duration-300 ease-in-out hover:scale-105"
            />
          )}

          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-4">
            <Badge
              variant="secondary"
              className="mb-4 text-lg font-medium uppercase tracking-wider"
            >
              {sale?.badge} {sale?.discountAmount}% Off
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {sale.title}
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-3xl">
              {sale?.description}
            </p>
            <p className="text-lg font-medium mb-6">
              Use code: {" "}
              <span className="font-semibold text-primary uppercase">
                {sale.couponCode}
              </span>{" "}
              for {" "}
              <span className="font-semibold">
                {sale?.discountAmount}%
              </span>{" "}
              OFF
            </p>
            <Button className="px-6 py-3 text-lg">Shop Now</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscountBanner;
