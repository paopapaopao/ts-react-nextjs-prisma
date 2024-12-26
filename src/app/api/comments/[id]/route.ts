import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Comment } from '@prisma/client';

import { prisma } from '@/lib/db';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';

type Params = {
  params: Promise<{ id: string }>;
};

type Return = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<Return>> => {
  const payload: CommentSchema = await request.json();

  const parsedPayload: SafeParseReturnType<CommentSchema, CommentSchema> =
    commentSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  const id: number = Number((await params).id);

  let response: Comment | null = null;

  try {
    response = await prisma.comment.update({
      where: { id },
      data: parsedPayload.data,
    });
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

const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<Return>> => {
  const id: number = Number((await params).id);

  let response: Comment | null = null;

  try {
    response = await prisma.comment.delete({
      where: { id },
    });
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

export { DELETE, PUT };
