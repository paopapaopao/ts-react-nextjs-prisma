'use server';

import { prisma } from '../db';

// TODO
const readCommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction =
  async (id: number, clerkUserId: string | null) => {
    const response = await prisma.comment.findUnique({
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

    const reactionsCounts = await prisma.reaction.groupBy({
      where: { commentId: id },
      _count: { type: true },
      by: ['commentId', 'type'],
    });

    const reactionCount = reactionsCounts.reduce(
      (accumulator, reaction) => {
        if (reaction.commentId === response?.id) {
          accumulator[reaction.type] = reaction._count.type;
        }

        return accumulator;
      },
      { LIKE: 0, DISLIKE: 0 }
    );

    const userReaction =
      response && response.reactions && response.reactions.length > 0
        ? response.reactions[0].type
        : null;

    return {
      ...response,
      reactionCount,
      userReaction,
    };
  };

export default readCommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction;
