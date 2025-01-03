'use server';

import { prisma } from '../db';

// TODO
const readPostWithUserAndCommentsCountAndReactionsCounts = async (
  id: number
) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: { comments: true },
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

  return {
    ...post,
    reactionCounts: counts,
  };
};

export default readPostWithUserAndCommentsCountAndReactionsCounts;
