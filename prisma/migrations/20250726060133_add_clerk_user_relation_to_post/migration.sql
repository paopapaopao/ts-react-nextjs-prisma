-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "clerkUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
