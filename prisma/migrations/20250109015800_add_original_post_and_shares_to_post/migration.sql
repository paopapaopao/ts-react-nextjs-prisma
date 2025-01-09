-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "originalPostId" INTEGER,
ALTER COLUMN "body" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_originalPostId_fkey" FOREIGN KEY ("originalPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
