import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import { createPost, readPosts } from '@/lib/actions';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';

/**
 * TODOs
 * - create return type
 */

const POST = async (
  request: NextRequest
): Promise<
  NextResponse<{
    data: { post: Post | null } | null;
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

  revalidatePath('/');

  return NextResponse.json({
    data: { post },
    errors: null,
    success: true,
  });
};

// TODO
const GET = async (
  request: NextRequest
): Promise<
  NextResponse<{
    data: Post[];
    nextCursor: number | null;
  }>
> => {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');

  const posts: Post[] = await readPosts({
    ...(Number(cursor) > 0
      ? {
          cursor: {
            id: Number(cursor),
          },
          skip: 1,
        }
      : {}),
    take: 10,
    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  revalidatePath('/');

  const hasMore: boolean = posts.length > 0;

  return NextResponse.json({
    data: posts,
    nextCursor: hasMore ? posts[posts.length - 1].id : null,
    // nextCursor: hasMore ? posts.at(-1)?.id : null,
  });
};

export { GET, POST };
