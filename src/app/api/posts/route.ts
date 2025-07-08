import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { HttpMethods } from '@/lib/enums';
import { postSchema } from '@/lib/schemas';
import type { PostInfiniteQuery, PostMutation, PostSchema } from '@/lib/types';
import {
  authenticateUser,
  parsePayload,
  responseWithCors,
} from '@/lib/utilities';

const ALLOWED_METHODS = [
  HttpMethods.POST,
  HttpMethods.GET,
  HttpMethods.OPTIONS,
].join(', ');

const POST = async (
  request: NextRequest
): Promise<NextResponse<PostMutation>> => {
  const authenticateUserResult =
    await authenticateUser<PostMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  const parsePayloadResult = await parsePayload<PostSchema, PostMutation>(
    request,
    postSchema
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response = await prisma.post.create({
      data: parsedPayload.data as PostSchema,
    });

    revalidatePath('/');

    return responseWithCors<PostMutation>(
      new NextResponse(
        JSON.stringify({
          data: { post: response },
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
    console.error('Post create error:', error);

    return responseWithCors<PostMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Post create failed'] },
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

const GET = async (
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

    const response = await prisma.post.findMany({
      ...(cursor > 0 && {
        cursor: { id: cursor },
        skip: 1,
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

const OPTIONS = (): NextResponse<null> => {
  return responseWithCors<null>(
    new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
      },
    })
  );
};

export { GET, OPTIONS, POST };
