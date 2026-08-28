import { NextResponse } from "next/server";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { prisma } from "@/src/lib/db/prisma";

export const runtime = "nodejs";

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment:
    process.env.PADDLE_ENVIRONMENT === "production"
      ? Environment.production
      : Environment.sandbox,
});

function toDate(value: unknown) {
  return typeof value === "string" ? new Date(value) : null;
}

function mapStatus(status: string) {
  switch (status) {
    case "active": return "ACTIVE" as const;
    case "trialing": return "TRIALING" as const;
    case "past_due": return "PAST_DUE" as const;
    case "paused": return "PAUSED" as const;
    case "canceled": return "CANCELED" as const;
    default: return "CANCELED" as const;
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("paddle-signature");
  const secret = process.env.PADDLE_WEBHOOK_SECRET_KEY;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Invalid webhook configuration" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: any;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, secret, signature);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  if (!event?.eventId || !event?.eventType) {
    return NextResponse.json({ error: "Invalid Paddle event" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingEvent = await tx.paddleWebhookEvent.findUnique({
        where: { paddleEventId: event.eventId },
      });

      if (existingEvent) return;

      const data = event.data ?? {};

      if (event.eventType.startsWith("subscription.")) {
        const customData = data.customData ?? {};
        const userId = typeof customData.userId === "string" ? customData.userId : null;
        const paddleSubscriptionId = data.id as string | undefined;

        if (paddleSubscriptionId) {
          const existingSubscription = await tx.subscription.findUnique({
            where: { paddleSubscriptionId },
          });

          const resolvedUserId = userId ?? existingSubscription?.userId;

          if (!resolvedUserId) {
            console.error("Paddle subscription has no Studibudi user mapping", {
              paddleSubscriptionId,
              eventId: event.eventId,
            });
          } else {
            const firstItem = data.items?.[0];
            const billingPeriod = data.currentBillingPeriod;
            const scheduledChange = data.scheduledChange;

            await tx.subscription.upsert({
              where: { userId: resolvedUserId },
              create: {
                userId: resolvedUserId,
                paddleCustomerId: data.customerId ?? null,
                paddleSubscriptionId,
                paddlePriceId: firstItem?.price?.id ?? null,
                paddleProductId: firstItem?.price?.productId ?? null,
                plan: "PRO",
                status: mapStatus(data.status),
                currentPeriodStart: toDate(billingPeriod?.startsAt),
                currentPeriodEnd: toDate(billingPeriod?.endsAt),
                scheduledChangeAt: toDate(scheduledChange?.effectiveAt),
                cancelAtPeriodEnd: scheduledChange?.action === "cancel",
              },
              update: {
                paddleCustomerId: data.customerId ?? null,
                paddlePriceId: firstItem?.price?.id ?? null,
                paddleProductId: firstItem?.price?.productId ?? null,
                status: mapStatus(data.status),
                currentPeriodStart: toDate(billingPeriod?.startsAt),
                currentPeriodEnd: toDate(billingPeriod?.endsAt),
                scheduledChangeAt: toDate(scheduledChange?.effectiveAt),
                cancelAtPeriodEnd: scheduledChange?.action === "cancel",
              },
            });
          }
        }
      }

      await tx.paddleWebhookEvent.create({
        data: {
          paddleEventId: event.eventId,
          eventType: event.eventType,
        },
      });
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paddle webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
