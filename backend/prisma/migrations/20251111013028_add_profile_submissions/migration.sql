-- CreateEnum
CREATE TYPE "ProfileSubmissionStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "profile_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "edtechCompanyId" TEXT,
    "solutionId" TEXT,
    "status" "ProfileSubmissionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "answers" JSONB NOT NULL DEFAULT '{}',
    "summarySnapshot" JSONB NOT NULL DEFAULT '{}',
    "summaryText" TEXT,
    "consentData" JSONB,
    "sectionProgress" JSONB,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_attachments" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "contentType" TEXT,
    "sizeBytes" INTEGER,
    "storageProvider" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profile_submissions_userId_idx" ON "profile_submissions"("userId");

-- CreateIndex
CREATE INDEX "profile_submissions_edtechCompanyId_idx" ON "profile_submissions"("edtechCompanyId");

-- CreateIndex
CREATE INDEX "profile_submissions_solutionId_idx" ON "profile_submissions"("solutionId");

-- CreateIndex
CREATE INDEX "profile_attachments_submissionId_questionId_idx" ON "profile_attachments"("submissionId", "questionId");

-- AddForeignKey
ALTER TABLE "profile_submissions" ADD CONSTRAINT "profile_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_submissions" ADD CONSTRAINT "profile_submissions_edtechCompanyId_fkey" FOREIGN KEY ("edtechCompanyId") REFERENCES "edtech_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_submissions" ADD CONSTRAINT "profile_submissions_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "solutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_attachments" ADD CONSTRAINT "profile_attachments_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "profile_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
