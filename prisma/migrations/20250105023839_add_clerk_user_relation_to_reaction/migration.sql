-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "clerkUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;
