import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientToken = process.env.PADDLE_CLIENT_TOKEN;
  const priceId = process.env.PADDLE_PRO_PRICE_ID;

  if (!clientToken || !priceId) {
    return NextResponse.json(
      { error: "Paddle production configuration is incomplete" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      environment: "production",
      clientToken,
      priceId,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
