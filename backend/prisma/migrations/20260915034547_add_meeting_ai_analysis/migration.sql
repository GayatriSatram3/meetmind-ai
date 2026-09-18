-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "aiActionItems" JSONB,
ADD COLUMN     "aiDecisions" JSONB,
ADD COLUMN     "aiResponsibilities" JSONB,
ADD COLUMN     "aiSummary" TEXT;
