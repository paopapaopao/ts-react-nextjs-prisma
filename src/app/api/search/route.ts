import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { type PostWithUserAndCommentsCountAndReactionsCountsAndUserReaction } from '@/lib/types';

type GETReturn = {
  data: {
    posts: PostWithUserAndCommentsCountAndReactionsCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (request: NextRequest): Promise<NextResponse<GETReturn>> => {
  const { searchParams } = new URL(request.url);
  const cursor: number = Number(searchParams.get('cursor'));
  const query: string | null = searchParams.get('query');

  const { userId } = await auth();

  const posts = await prisma.post.findMany({
    ...(cursor > 0 && {
      cursor: { id: cursor },
      skip: 1,
    }),
    ...(query !== null && {
      where: {
        OR: [
          {
            title: { contains: String(query) },
            body: { contains: String(query) },
          },
        ],
      },
    }),
    include: {
      user: true,
      _count: {
        select: {
          comments: {
            where: { parentCommentId: null },
          },
        },
      },
      reactions: {
        where: { clerkUserId: userId },
        select: { type: true },
      },
    },
    take: POSTS_FETCH_COUNT,
    orderBy: { updatedAt: 'desc' },
  });

  // TODO
  const reactionCounts = await prisma.reaction.groupBy({
    by: ['postId', 'type'],
    _count: { type: true },
  });

  // TODO
  const postsWithReactionCounts = posts.map((post) => {
    const counts = reactionCounts.reduce(
      (accumulator, reaction) => {
        if (reaction.postId === post.id) {
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
  });

  // TODO
  const postsWithUserReaction = postsWithReactionCounts.map((post) => {
    const userReaction =
      post && post?.reactions && post?.reactions?.length > 0
        ? post?.reactions?.[0].type
        : null;

    return {
      ...post,
      userReaction,
    };
  });

  const hasMore: boolean = postsWithUserReaction.length > 0;

  return NextResponse.json({
    data: {
      posts: postsWithUserReaction,
      nextCursor: hasMore
        ? postsWithUserReaction[postsWithUserReaction.length - 1].id
        : null,
    },
    errors: null,
    success: true,
  });
};

export { GET };
