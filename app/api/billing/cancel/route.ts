import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
    if (!subscription || !["ACTIVE", "TRIALING"].includes(subscription.status)) {
      return NextResponse.json({ error: "NO_ACTIVE_SUBSCRIPTION", message: "No active Pro subscription was found." }, { status: 404 });
    }

    if (!process.env.PADDLE_API_KEY) {
      return NextResponse.json({ error: "BILLING_NOT_CONFIGURED", message: "Billing is not configured." }, { status: 500 });
    }

    const environment = process.env.PADDLE_ENVIRONMENT === "production" ? "production" : "sandbox";
    const baseUrl = environment === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
    const response = await fetch(`${baseUrl}/subscriptions/${encodeURIComponent(subscription.paddleSubscriptionId)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scheduled_change: { action: "cancel", effective_at: "next_billing_period" } }),
      cache: "no-store",
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      console.error("Paddle cancellation failed", response.status, payload);
      return NextResponse.json({ error: "CANCELLATION_FAILED", message: "We could not cancel your subscription. Please try again." }, { status: 502 });
    }

    const payload = await response.json().catch(() => null);
    const scheduledChange = payload?.data?.scheduled_change;

    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: {
        cancelAtPeriodEnd: true,
        scheduledChangeAt: scheduledChange?.effective_at ? new Date(scheduledChange.effective_at) : subscription.currentPeriodEnd,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    return NextResponse.json({ error: "CANCELLATION_FAILED", message: "We could not cancel your subscription. Please try again." }, { status: 500 });
  }
}
