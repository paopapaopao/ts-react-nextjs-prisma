import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Comment } from '@prisma/client';

import { prisma } from '@/lib/db';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';

type POSTReturn = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const POST = async (
  request: NextRequest
): Promise<NextResponse<POSTReturn>> => {
  const payload: unknown = await request.json();
  const parsedPayload: SafeParseReturnType<unknown, CommentSchema> =
    commentSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  let response: Comment | null = null;

  try {
    response = await prisma.comment.create({ data: parsedPayload.data });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json({
      data: null,
      errors: error,
      success: false,
    });
  }

  revalidatePath('/');
  revalidatePath(`/posts/${response?.postId}`);

  return NextResponse.json({
    data: { comment: response },
    errors: null,
    success: true,
  });
};

export { POST };
