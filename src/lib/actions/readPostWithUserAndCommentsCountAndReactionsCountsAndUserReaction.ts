'use server';

import { prisma } from '../db';

// TODO
const readPostWithUserAndCommentsCountAndReactionsCountsAndUserReaction =
  async (id: number, clerkUserId: string | null) => {
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
      _count: { type: true },
      by: ['postId', 'type'],
    });

    const counts = reactionCounts.reduce(
      (accumulator, reaction) => {
        if (reaction.postId === post?.id) {
          accumulator[reaction.type] = reaction._count.type;
        }

        return accumulator;
      },
      { LIKE: 0, DISLIKE: 0 }
    );

    const userReaction =
      post && post.reactions && post.reactions.length > 0
        ? post.reactions[0].type
        : null;

    return {
      ...post,
      reactionCounts: counts,
      userReaction,
    };
  };

export default readPostWithUserAndCommentsCountAndReactionsCountsAndUserReaction;
