import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import { createPost, updatePost } from '@/actions';
import { prisma } from '@/lib/db';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';

/**
 * TODOs
 * - create return type
 */

const GET = async (
  request: NextRequest
): Promise<
  NextResponse<{
    data: Post[];
    nextCursor: number | null;
  }>
> => {
  const LIMIT = 10;
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  let posts: Post[] = [];

  try {
    posts = await prisma.post.findMany({
      ...(Number(cursor) > 0
        ? {
            cursor: {
              id: Number(cursor),
            },
            skip: 1,
          }
        : {}),
      take: LIMIT,
      orderBy: {
        createdAt: 'asc',
      },
    });
  } catch (error) {
    console.error(error);
  }

  const hasMore: boolean = posts.length > 0;

  return NextResponse.json({
    data: posts,
    nextCursor: hasMore ? posts[posts.length - 1].id : null,
    // nextCursor: hasMore ? posts.at(-1)?.id : null,
  });
};

const POST = async (
  request: NextRequest
): Promise<
  NextResponse<{
    data: Post | null;
    errors: { [key: string]: string[] } | null;
    success: boolean;
  }>
> => {
  const payload: unknown = await request.json();
  const parsedPayload: SafeParseReturnType<PostSchema, PostSchema> =
    postSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  const post: Post | null = await createPost(parsedPayload.data);

  return NextResponse.json({
    data: post,
    errors: null,
    success: true,
  });
};

const PUT = async (
  request: NextRequest
): Promise<
  NextResponse<{
    data: Post | null;
    errors: { [key: string]: string[] } | null;
    success: boolean;
  }>
> => {
  const payload: unknown = await request.json();
  const parsedPayload: SafeParseReturnType<PostSchema, PostSchema> =
    postSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  const post: Post | null = await updatePost(parsedPayload.data);

  return NextResponse.json({
    data: post,
    errors: null,
    success: true,
  });
};

export { GET, POST, PUT };
