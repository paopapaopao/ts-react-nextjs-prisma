import { type NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { HttpMethod } from '@/lib/enumerations';
import type { PostInfiniteQuery } from '@/lib/types';
import { authenticateUser, responseWithCors } from '@/lib/utilities';

const ALLOWED_METHODS = [HttpMethod.GET, HttpMethod.OPTIONS].join(', ');

export const GET = async (
  request: NextRequest
): Promise<NextResponse<PostInfiniteQuery>> => {
  const authenticateUserResult =
    await authenticateUser<PostInfiniteQuery>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  try {
    const { userId } = authenticateUserResult;

    const searchParams = request.nextUrl.searchParams;
    const cursor = Number(searchParams.get('cursor'));
    const query = searchParams.get('query');

    const response = await prisma.post.findMany({
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
        },
      },
      take: POSTS_FETCH_COUNT,
      orderBy: { updatedAt: Prisma.SortOrder.desc },
    });

    // TODO
    const postsWithUserReaction = response.map((post) => {
      const { reactions, ...postWithoutReactions } = post;
      const userReaction = reactions[0] ?? null;

      return { ...postWithoutReactions, userReaction };
    });

    const hasMore = postsWithUserReaction.length > 0;

    return responseWithCors<PostInfiniteQuery>(
      new NextResponse(
        JSON.stringify({
          data: {
            posts: postsWithUserReaction,
            nextCursor: hasMore
              ? postsWithUserReaction[postsWithUserReaction.length - 1].id
              : null,
          },
          errors: null,
        }),
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
          },
        }
      )
    );
  } catch (error: unknown) {
    console.error('Post find many error:', error);

    return responseWithCors<PostInfiniteQuery>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Post find many failed'] },
        }),
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
          },
        }
      )
    );
  }
};

export const OPTIONS = (): NextResponse<null> => {
  return responseWithCors<null>(
    new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
      },
    })
  );
};
