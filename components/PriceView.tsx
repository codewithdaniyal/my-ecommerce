import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined; // Original price
  discount: number | undefined; // Discounted price
  className?: string;
  label?: string;
}

const PriceView = ({ price, discount, label, className }: Props) => {
  const hasDiscount = discount && discount < price; // Check if discount is valid

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        {hasDiscount && (
          <PriceFormatter
            amount={price}
            className={twMerge("line-through text-xs font-medium", className)}
          />
        )}
        <PriceFormatter
          amount={hasDiscount ? discount : price}
          className={className}
        />
      </div>
      <p className="text-gray-500">{label}</p>
    </div>
  );
};

export default PriceView;
