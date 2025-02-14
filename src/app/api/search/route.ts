import { type NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import type { PostInfiniteQuery } from '@/lib/types';
import { authenticateUser } from '@/lib/utils';

const GET = async (
  request: NextRequest
): Promise<NextResponse<PostInfiniteQuery>> => {
  const authUserResult = await authenticateUser<PostInfiniteQuery>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const cursor: number = Number(searchParams.get('cursor'));
    const query: string | null = searchParams.get('query');

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
          where: { clerkUserId: authUserResult.userId },
        },
      },
      take: POSTS_FETCH_COUNT,
      orderBy: { updatedAt: Prisma.SortOrder.desc },
    });

    const postsWithUserReaction = posts.map((post) => {
      const { reactions, ...postWithoutReactions } = post;
      const userReaction = reactions?.[0] ?? null;

      return {
        ...postWithoutReactions,
        userReaction,
      };
    });

    const hasMore: boolean = postsWithUserReaction.length > 0;

    return NextResponse.json(
      {
        data: {
          posts: postsWithUserReaction,
          nextCursor: hasMore
            ? postsWithUserReaction[postsWithUserReaction.length - 1].id
            : null,
        },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Post find many error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['Post find many failed'] },
      },
      { status: 500 }
    );
  }
};

export { GET };
