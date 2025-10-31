-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDTECH', 'IE', 'CONSULTANT');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "TrafficLightColor" AS ENUM ('RED', 'YELLOW', 'GREEN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edtech_companies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edtech_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions" (
    "id" TEXT NOT NULL,
    "edtechCompanyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "logoUrl" TEXT,
    "levels" TEXT[],
    "areas" TEXT[],
    "productTypes" TEXT[],
    "contexts" TEXT[],
    "devices" TEXT[],
    "businessModels" TEXT[],
    "security" TEXT[],
    "adaptability" TEXT[],
    "priceRange" TEXT,
    "pedagogicalScore" INTEGER,
    "adaptabilityScore" INTEGER,
    "impactScore" INTEGER,
    "organizationalScore" INTEGER,
    "pedagogicalColor" "TrafficLightColor",
    "adaptabilityColor" "TrafficLightColor",
    "impactColor" "TrafficLightColor",
    "organizationalColor" "TrafficLightColor",
    "questionnaireData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidences" (
    "id" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rural" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "characterizationData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ie_matches" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ie_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultant_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traffic_light_rules" (
    "id" TEXT NOT NULL,
    "axis" TEXT NOT NULL,
    "thresholdRed" INTEGER NOT NULL,
    "thresholdYellow" INTEGER NOT NULL,
    "weights" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traffic_light_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "edtech_companies_userId_key" ON "edtech_companies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "institutions_userId_key" ON "institutions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ie_matches_institutionId_solutionId_key" ON "ie_matches"("institutionId", "solutionId");

-- CreateIndex
CREATE UNIQUE INDEX "consultant_profiles_userId_key" ON "consultant_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "catalogs_value_key" ON "catalogs"("value");

-- CreateIndex
CREATE UNIQUE INDEX "catalogs_type_value_key" ON "catalogs"("type", "value");

-- CreateIndex
CREATE INDEX "traffic_light_rules_axis_active_idx" ON "traffic_light_rules"("axis", "active");

-- AddForeignKey
ALTER TABLE "edtech_companies" ADD CONSTRAINT "edtech_companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_edtechCompanyId_fkey" FOREIGN KEY ("edtechCompanyId") REFERENCES "edtech_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ie_matches" ADD CONSTRAINT "ie_matches_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ie_matches" ADD CONSTRAINT "ie_matches_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultant_profiles" ADD CONSTRAINT "consultant_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
