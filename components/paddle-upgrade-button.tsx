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
      eventCallback: (event) => {
        if (event.name !== "checkout.completed") return;

        const transactionId = event.data?.transaction_id;
        if (!transactionId) return;

        // The webhook is still the authoritative provisioning mechanism, but
        // sandbox checkouts can redirect before the webhook has reached us.
        // Sync the completed transaction immediately so the user's PRO access
        // is available as soon as payment succeeds.
        fetch(`/api/billing/sync?transactionId=${encodeURIComponent(transactionId)}`, {
          credentials: "include",
          cache: "no-store",
        })
          .catch((error) => console.error("Paddle sync failed:", error))
          .finally(() => {
            window.location.assign(`/dashboard?payment=success&transactionId=${encodeURIComponent(transactionId)}`);
          });
      },
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
        // Fallback in case Paddle doesn't emit the client event before the
        // redirect. The dashboard will continue checking entitlements.
        successUrl: `${window.location.origin}/dashboard?payment=success`,
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
