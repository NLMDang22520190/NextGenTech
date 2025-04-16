import React from "react";
import OrderList from "../../../components/Admin/Order/OrderList";

const Order = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto">
        <OrderList />
      </main>
    </div>
  );
};

export default Order;