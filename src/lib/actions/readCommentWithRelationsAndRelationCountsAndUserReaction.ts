'use server';

import { prisma } from '../db';

const readCommentWithRelationsAndRelationCountsAndUserReaction = async (
  id: number,
  clerkUserId: string | null
) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: {
          replies: true,
          reactions: true,
        },
      },
      reactions: {
        where: { clerkUserId },
        select: { type: true },
      },
    },
  });

  if (comment === null) {
    return null;
  }

  const { reactions, ...updatedComment } = comment;
  const userReaction = reactions?.[0]?.type || null;

  return {
    ...updatedComment,
    userReaction,
  };
};

export default readCommentWithRelationsAndRelationCountsAndUserReaction;
