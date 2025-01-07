'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '../db';

const readPostWithUserAndCommentCountAndReactionCountsAndUserReaction = async (
  id: number,
  clerkUserId: string | null
) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
      reactions: {
        where: { clerkUserId },
        select: { type: true },
      },
    },
  });

  const reactionCounts = await prisma.reaction.groupBy({
    where: { postId: id },
    by: [
      Prisma.ReactionScalarFieldEnum.postId,
      Prisma.ReactionScalarFieldEnum.type,
    ],
    _count: { type: true },
  });

  const counts = reactionCounts.reduce(
    (accumulator, reactionCount) => {
      if (reactionCount.postId === post?.id) {
        accumulator[reactionCount.type] = reactionCount._count.type;
      }

      return accumulator;
    },
    { LIKE: 0, DISLIKE: 0 }
  );

  const userReaction =
    post?.reactions.length ?? 0 > 0 ? post?.reactions[0].type : null;

  return {
    ...post,
    reactionCounts: counts,
    userReaction,
  };
};

export default readPostWithUserAndCommentCountAndReactionCountsAndUserReaction;
