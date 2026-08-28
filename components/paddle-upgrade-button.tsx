"use client";

import { useEffect, useState, type ReactNode } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import BaseButton from "@/components/ui/baseButton";

export default function PaddleUpgradeButton({
  userId,
  children = "Upgrade to Pro $4.99/mo",
  className,
}: {
  userId: string;
  children?: ReactNode;
  className?: string;
}) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!token) {
      console.error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not configured");
      setLoading(false);
      return;
    }

    initializePaddle({
      environment:
        process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
          ? "production"
          : "sandbox",
      token,
    }).then((instance) => {
      setPaddle(instance);
      setLoading(false);
    });
  }, []);

  const openCheckout = () => {
    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID;

    if (!paddle || !priceId) return;

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId },
      settings: {
        displayMode: "overlay",
        theme: "light",
        variant: "one-page",
      },
    });
  };

  return (
    <BaseButton
      type="button"
      variant="long"
      onClick={openCheckout}
      disabled={loading || !paddle}
      className={className}
    >
      {loading ? "Loading..." : children}
    </BaseButton>
  );
}
