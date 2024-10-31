import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import { readPost, updatePost } from '@/lib/actions';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';

/**
 * TODOs
 * - create return type
 */

const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<
  NextResponse<{
    data: Post | null;
    errors: { [key: string]: string[] } | null;
    success: boolean;
  }>
> => {
  const post: Post | null = await readPost({
    where: {
      id: Number(id),
    },
  });

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

export { GET, PUT };
