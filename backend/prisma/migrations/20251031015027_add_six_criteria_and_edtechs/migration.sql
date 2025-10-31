-- AlterTable
ALTER TABLE "solutions" ADD COLUMN     "affordabilityColor" "TrafficLightColor",
ADD COLUMN     "affordabilityScore" INTEGER,
ADD COLUMN     "technicalQualityColor" "TrafficLightColor",
ADD COLUMN     "technicalQualityScore" INTEGER,
ADD COLUMN     "websiteUrl" TEXT;
