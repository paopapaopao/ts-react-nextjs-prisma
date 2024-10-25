import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import { createPost } from '@/actions';
import { postSchema } from '@/schemas';
import { type TPostSchema } from '@/types';

/**
 * TODOs
 * - create return type
 */

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
  const parsedPayload: SafeParseReturnType<TPostSchema, TPostSchema> =
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

export { POST };
