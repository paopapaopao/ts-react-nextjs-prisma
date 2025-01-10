import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

type GETReturn = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
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
      originalPost: {
        include: { user: true },
      },
      _count: {
        select: {
          shares: true,
          comments: {
            where: { parentCommentId: null },
          },
          reactions: true,
          views: true,
        },
      },
      reactions: {
        where: { clerkUserId: userId },
        select: { type: true },
      },
    },
    take: POSTS_FETCH_COUNT,
    orderBy: { updatedAt: Prisma.SortOrder.desc },
  });

  const postsWithUserReaction = posts.map((post) => {
    const { reactions, ...postWithoutReactions } = post;
    const userReaction = reactions?.[0]?.type || null;

    return {
      ...postWithoutReactions,
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
