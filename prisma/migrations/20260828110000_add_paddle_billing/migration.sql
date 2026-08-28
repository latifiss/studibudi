-- Paddle Billing subscription support
ALTER TABLE "user" ADD COLUMN "uploadsUsed" INTEGER NOT NULL DEFAULT 0;

CREATE TYPE "SubscriptionPlan" AS ENUM ('PRO');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIALING', 'PAST_DUE', 'PAUSED', 'CANCELED');

CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "paddleCustomerId" TEXT,
  "paddleSubscriptionId" TEXT NOT NULL,
  "paddlePriceId" TEXT,
  "paddleProductId" TEXT,
  "plan" "SubscriptionPlan" NOT NULL DEFAULT 'PRO',
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "scheduledChangeAt" TIMESTAMP(3),
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaddleWebhookEvent" (
  "id" TEXT NOT NULL,
  "paddleEventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaddleWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_paddleSubscriptionId_key" ON "Subscription"("paddleSubscriptionId");
CREATE INDEX "Subscription_paddleCustomerId_idx" ON "Subscription"("paddleCustomerId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");
CREATE UNIQUE INDEX "PaddleWebhookEvent_paddleEventId_key" ON "PaddleWebhookEvent"("paddleEventId");
CREATE INDEX "PaddleWebhookEvent_eventType_idx" ON "PaddleWebhookEvent"("eventType");

ALTER TABLE "Subscription"
  ADD CONSTRAINT "Subscription_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
