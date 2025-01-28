import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { type Post, Prisma } from '@prisma/client';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { postSchema } from '@/lib/schemas';
import type { PostSchema, TPosts } from '@/lib/types';

type POSTReturn = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const POST = async (
  request: NextRequest
): Promise<NextResponse<POSTReturn>> => {
  const payload: PostSchema = await request.json();

  const parsedPayload: SafeParseReturnType<PostSchema, PostSchema> =
    postSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  try {
    const response: Post | null = await prisma.post.create({
      data: parsedPayload.data,
    });

    revalidatePath('/');

    return NextResponse.json({
      data: { post: response },
      errors: null,
      success: true,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json({
      data: null,
      errors: error,
      success: false,
    });
  }
};

const GET = async (request: NextRequest): Promise<NextResponse<TPosts>> => {
  const { searchParams } = new URL(request.url);
  const cursor: number = Number(searchParams.get('cursor'));

  const { userId } = await auth();

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
        where: { clerkUserId: userId },
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

export { GET, POST };
