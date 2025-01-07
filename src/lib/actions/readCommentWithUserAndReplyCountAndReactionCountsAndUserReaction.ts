'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '../db';

const readCommentWithUserAndReplyCountAndReactionCountsAndUserReaction = async (
  id: number,
  clerkUserId: string | null
) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: { replies: true },
      },
      reactions: {
        where: { clerkUserId },
        select: { type: true },
      },
    },
  });

  const reactionCounts = await prisma.reaction.groupBy({
    where: { commentId: id },
    by: [
      Prisma.ReactionScalarFieldEnum.commentId,
      Prisma.ReactionScalarFieldEnum.type,
    ],
    _count: { type: true },
  });

  const counts = reactionCounts.reduce(
    (accumulator, reactionCount) => {
      if (reactionCount.commentId === comment?.id) {
        accumulator[reactionCount.type] = reactionCount._count.type;
      }

      return accumulator;
    },
    { LIKE: 0, DISLIKE: 0 }
  );

  const userReaction =
    comment?.reactions.length ?? 0 > 0 ? comment?.reactions[0].type : null;

  return {
    ...comment,
    reactionCounts: counts,
    userReaction,
  };
};

export default readCommentWithUserAndReplyCountAndReactionCountsAndUserReaction;
