import React from "react";
import { Button } from "antd";
import { ShoppingBag } from "lucide-react";

const EmptyCart = ({ onContinueShopping }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-primary/10 p-6 rounded-full mb-6 animate-pulse">
        <ShoppingBag className="h-16 w-16 text-primary" />
      </div>

      <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Looks like you haven't added any products to your cart yet. Browse our
        products and find something you'll love!
      </p>

      <Button
        onClick={onContinueShopping}
        size="lg"
        className="animate-bounce-slow"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        Start Shopping
      </Button>
    </div>
  );
};

export default EmptyCart;
