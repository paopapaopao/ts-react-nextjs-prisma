import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Comment } from '@prisma/client';
import { deleteComment, updateComment } from '@/lib/actions';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';

type PutReturn = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const PUT = async (request: NextRequest): Promise<NextResponse<PutReturn>> => {
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

  const comment: Comment | null = await updateComment(parsedPayload.data);

  revalidatePath(`/posts/${comment?.postId}`);

  return NextResponse.json({
    data: { comment },
    errors: null,
    success: true,
  });
};

const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;
  const comment: Comment | null = await deleteComment(Number(id));

  revalidatePath(`/posts/${comment?.postId}`);

  return NextResponse.json({
    data: { comment },
    errors: null,
    success: true,
  });
};

export { DELETE, PUT };
