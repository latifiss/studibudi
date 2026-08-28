import { prisma } from "@/src/lib/db/prisma";

export const FREE_LIMITS = {
  quizzes: 2,
  uploads: 2,
  answerExplanation: false,
  redoQuiz: false,
} as const;

export const PRO_LIMITS = {
  quizzes: Infinity,
  uploads: Infinity,
  answerExplanation: true,
  redoQuiz: true,
} as const;

export async function getSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription) return null;
  return ["ACTIVE", "TRIALING"].includes(subscription.status) ? subscription : null;
}

export async function isPro(userId: string) {
  return Boolean(await getSubscription(userId));
}

export async function getEntitlements(userId: string) {
  const [pro, quizCount, user] = await Promise.all([
    isPro(userId),
    prisma.quizHistory.count({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { uploadsUsed: true } }),
  ]);

  const limits = pro ? PRO_LIMITS : FREE_LIMITS;
  return {
    plan: pro ? "PRO" : "FREE",
    isPro: pro,
    quizzes: { used: quizCount, limit: limits.quizzes },
    uploads: { used: user?.uploadsUsed ?? 0, limit: limits.uploads },
    answerExplanation: limits.answerExplanation,
    redoQuiz: limits.redoQuiz,
  };
}

export async function canCreateQuiz(userId: string) {
  const [pro, quizCount] = await Promise.all([
    isPro(userId),
    prisma.quizHistory.count({ where: { userId } }),
  ]);

  return pro || quizCount < FREE_LIMITS.quizzes;
}

export async function canUpload(userId: string) {
  // Upload preparation should only depend on the user's upload entitlement.
  // Do not query QuizHistory here: an upload must be able to start even when
  // quiz-history data is unavailable or has not yet been migrated.
  const [pro, user] = await Promise.all([
    isPro(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { uploadsUsed: true },
    }),
  ]);

  if (pro) return true;
  return (user?.uploadsUsed ?? 0) < FREE_LIMITS.uploads;
}

export async function requirePro(userId: string) {
  if (!(await isPro(userId))) throw new Error("PRO_SUBSCRIPTION_REQUIRED");
}
