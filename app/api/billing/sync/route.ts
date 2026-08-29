import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { auth } from "@/src/lib/auth/auth";
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

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const transactionId = new URL(request.url).searchParams.get("transactionId");
  if (!transactionId) {
    return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
  }

  try {
    const transaction = await paddle.transactions.get(transactionId);

    if (transaction.status !== "completed" && transaction.status !== "paid") {
      return NextResponse.json({ synced: false, status: transaction.status });
    }

    const customData = transaction.customData ?? {};
    const customUserId = typeof customData.userId === "string" ? customData.userId : null;

    // Never trust a transaction ID alone. It must belong to the currently
    // authenticated Studibudi user through the custom data we attached at checkout.
    if (customUserId !== session.user.id) {
      return NextResponse.json({ error: "Transaction does not belong to this user" }, { status: 403 });
    }

    if (!transaction.subscriptionId) {
      return NextResponse.json({ synced: false, status: "subscription_pending" });
    }

    const subscription = await paddle.subscriptions.get(transaction.subscriptionId);
    const firstItem = subscription.items?.[0];
    const billingPeriod = subscription.currentBillingPeriod;
    const scheduledChange = subscription.scheduledChange;
    const status = mapStatus(subscription.status);

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        paddleCustomerId: subscription.customerId ?? transaction.customerId ?? null,
        paddleSubscriptionId: subscription.id,
        paddlePriceId: firstItem?.price?.id ?? null,
        paddleProductId: firstItem?.price?.productId ?? null,
        plan: "PRO",
        status,
        currentPeriodStart: toDate(billingPeriod?.startsAt),
        currentPeriodEnd: toDate(billingPeriod?.endsAt),
        scheduledChangeAt: toDate(scheduledChange?.effectiveAt),
        cancelAtPeriodEnd: scheduledChange?.action === "cancel",
      },
      update: {
        paddleCustomerId: subscription.customerId ?? transaction.customerId ?? null,
        paddlePriceId: firstItem?.price?.id ?? null,
        paddleProductId: firstItem?.price?.productId ?? null,
        status,
        currentPeriodStart: toDate(billingPeriod?.startsAt),
        currentPeriodEnd: toDate(billingPeriod?.endsAt),
        scheduledChangeAt: toDate(scheduledChange?.effectiveAt),
        cancelAtPeriodEnd: scheduledChange?.action === "cancel",
      },
    });

    return NextResponse.json({ synced: true, isPro: ["ACTIVE", "TRIALING"].includes(status) });
  } catch (error) {
    console.error("Paddle subscription sync failed:", error);
    return NextResponse.json({ error: "Unable to sync Paddle subscription" }, { status: 500 });
  }
}
