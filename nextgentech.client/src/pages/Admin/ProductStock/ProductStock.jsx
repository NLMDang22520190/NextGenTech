import React from "react";
import ProductStock from "../../../components/Admin/ProductStock/ProductStock";

const Stock = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        <ProductStock />
      </main>
    </div>
  );
};

export default Stock;