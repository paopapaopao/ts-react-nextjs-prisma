import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { postSchema } from '@/lib/schemas';
import type { PostSchema, TPost, TPosts } from '@/lib/types';
import { authUser } from '@/lib/utils';

const POST = async (request: NextRequest): Promise<NextResponse<TPost>> => {
  const authUserResult = await authUser<TPost>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  try {
    const payload: PostSchema = await request.json();

    const parsedPayload: SafeParseReturnType<PostSchema, PostSchema> =
      postSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          data: null,
          errors: parsedPayload.error?.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const response: Post | null = await prisma.post.create({
      data: parsedPayload.data,
    });

    revalidatePath('/');

    return NextResponse.json(
      {
        data: { post: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Post create error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Post create failed'] },
        },
        { status: 500 }
      );
    }

    console.error('Payload parse error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { server: ['Internal server error'] },
      },
      { status: 500 }
    );
  }
};

const GET = async (request: NextRequest): Promise<NextResponse<TPosts>> => {
  const authUserResult = await authUser<TPosts>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const cursor: number = Number(searchParams.get('cursor'));

    const posts = await prisma.post.findMany({
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

export { GET, POST };
