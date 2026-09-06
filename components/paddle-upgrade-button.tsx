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
  const [priceId, setPriceId] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPaddle = async () => {
      try {
        const response = await fetch("/api/billing/config", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load Paddle production configuration");
        }

        const config = (await response.json()) as {
          environment: "production";
          clientToken: string;
          priceId: string;
        };

        const instance = await initializePaddle({
          environment: "production",
          token: config.clientToken,
          eventCallback: (event) => {
            if (event.name !== "checkout.completed") return;

            const transactionId = event.data?.transaction_id;
            if (!transactionId) return;

            fetch(
              `/api/billing/sync?transactionId=${encodeURIComponent(transactionId)}`,
              {
                credentials: "include",
                cache: "no-store",
              },
            )
              .catch((error) => console.error("Paddle sync failed:", error))
              .finally(() => {
                window.location.assign(
                  `/dashboard?payment=success&transactionId=${encodeURIComponent(transactionId)}`,
                );
              });
          },
        });

        if (cancelled) return;

        setPaddle(instance);
        setPriceId(config.priceId);
      } catch (error) {
        console.error("Paddle production initialization failed:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPaddle();

    return () => {
      cancelled = true;
    };
  }, []);

  const openCheckout = () => {
    if (!paddle || !priceId) return;

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId },
      settings: {
        displayMode: "overlay",
        theme: "light",
        variant: "one-page",
        successUrl: `${window.location.origin}/dashboard?payment=success`,
      },
    });
  };

  return (
    <BaseButton
      type="button"
      variant="long"
      onClick={openCheckout}
      disabled={loading || !paddle || !priceId}
      className={className}
    >
      {loading ? "Loading..." : children}
    </BaseButton>
  );
}
