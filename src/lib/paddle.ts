import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const apiKey = process.env.PADDLE_API_KEY;

export const paddle = apiKey
  ? new Paddle(apiKey, {
      environment:
        process.env.PADDLE_ENVIRONMENT === "production"
          ? Environment.production
          : Environment.sandbox,
    })
  : null;

export function getPaddlePriceId() {
  const priceId = process.env.PADDLE_PRO_PRICE_ID;
  if (!priceId) throw new Error("PADDLE_PRO_PRICE_ID is not configured");
  return priceId;
}

export function getPaddleClientToken() {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) throw new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not configured");
  return token;
}
