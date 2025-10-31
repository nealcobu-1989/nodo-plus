-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT,
ADD COLUMN     "picture" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "users_providerId_provider_idx" ON "users"("providerId", "provider");
