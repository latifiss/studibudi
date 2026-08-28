-- CreateTable
CREATE TABLE "QuizHistory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT,
  "sourceName" TEXT,
  "totalQuestions" INTEGER NOT NULL DEFAULT 0,
  "questions" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "QuizHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizHistory_userId_createdAt_idx" ON "QuizHistory"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "QuizHistory"
  ADD CONSTRAINT "QuizHistory_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
