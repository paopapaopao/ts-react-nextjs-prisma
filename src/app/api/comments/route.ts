import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Comment } from '@prisma/client';
import { createComment } from '@/lib/actions';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';

type PostReturn = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const POST = async (
  request: NextRequest
): Promise<NextResponse<PostReturn>> => {
  const payload: unknown = await request.json();
  const parsedPayload: SafeParseReturnType<CommentSchema, CommentSchema> =
    commentSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  const comment: Comment | null = await createComment(parsedPayload.data);

  revalidatePath('/');

  return NextResponse.json({
    data: { comment },
    errors: null,
    success: true,
  });
};

export { POST };
