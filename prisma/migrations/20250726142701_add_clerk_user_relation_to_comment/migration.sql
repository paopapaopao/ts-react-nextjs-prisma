-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "clerkUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
