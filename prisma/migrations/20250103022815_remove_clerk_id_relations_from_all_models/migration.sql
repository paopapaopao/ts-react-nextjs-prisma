/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `clerkUserId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `clerkUserId` on the `Reaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_clerkUserId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_clerkUserId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_clerkUserId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "clerkUserId";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "clerkUserId";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "clerkUserId";
