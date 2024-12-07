import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { type Post } from '@prisma/client';
import { readPosts } from '@/lib/actions';
import { prisma } from '@/lib/db';
import { postSchema } from '@/lib/schemas';
import {
  type PostSchema,
  type PostWithUserAndCommentsCountAndReactionCounts,
} from '@/lib/types';

type GETReturn = {
  data: {
    nextCursor: number | null;
    posts: PostWithUserAndCommentsCountAndReactionCounts[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

type POSTReturn = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

// TODO
const POST = async (
  request: NextRequest
): Promise<NextResponse<POSTReturn>> => {
  const payload = await request.json();
  const { userId } = await auth();

  const parsedPayload: SafeParseReturnType<unknown, PostSchema> =
    postSchema.safeParse({
      ...payload,
      clerkUserId: userId,
    });

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  let response: Post | null = null;

  try {
    response = await prisma.post.create({ data: parsedPayload.data });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json({
      data: null,
      errors: error,
      success: false,
    });
  }

  revalidatePath('/');

  return NextResponse.json({
    data: { post: response },
    errors: null,
    success: true,
  });
};

const GET = async (request: NextRequest): Promise<NextResponse<GETReturn>> => {
  const { searchParams } = new URL(request.url);
  const cursor: number = Number(searchParams.get('cursor'));

  const posts: Post[] = await readPosts({
    ...(cursor > 0 && {
      cursor: { id: cursor },
      skip: 1,
    }),
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
    },
    take: 10,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
  });

  const reactionCounts = await prisma.reaction.groupBy({
    by: ['postId', 'type'],
    _count: { type: true },
  });

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

    return { ...post, reactionCounts: counts };
  });

  const hasMore: boolean = postsWithReactionCounts.length > 0;

  return NextResponse.json({
    data: {
      nextCursor: hasMore
        ? postsWithReactionCounts[postsWithReactionCounts.length - 1].id
        : null,
      posts: postsWithReactionCounts,
    },
    errors: null,
    success: true,
  });
};

export { GET, POST };
