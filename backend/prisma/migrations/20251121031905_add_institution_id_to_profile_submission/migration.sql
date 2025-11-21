-- AlterTable
ALTER TABLE "profile_submissions" ADD COLUMN     "institutionId" TEXT;

-- CreateIndex
CREATE INDEX "profile_submissions_institutionId_idx" ON "profile_submissions"("institutionId");

-- AddForeignKey
ALTER TABLE "profile_submissions" ADD CONSTRAINT "profile_submissions_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
