import { Category, Product } from "@/sanity.types";
import React from "react";
import ProductGrid from "./ProductGrid";
import Categories from "./Categories";

interface Props {
  products: Product[];
  categories: Category[];
  title?: boolean;
}

const ProductList = ({ products, categories, title }: Props) => {
  return (
    <div className="pt-10">
      {title && (
        <div className="pb-5 text-center">
          <h2 className="text-2xl font-bold text-gray-800 font-montserrat">
            Browse Our <span className="text-blue-600">Products</span>
          </h2>
          <p className="text-sm text-gray-600">
            Click on a Search By Category to explore specific items or scroll down to view all products.
          </p>
          <div className="mt-5">
            <Categories categories={categories} />
          </div>
        </div>
      )}

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default ProductList;
