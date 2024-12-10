import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Comment } from '@prisma/client';
import { prisma } from '@/lib/db';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

type PUTReturn = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

type DELETEReturn = {
  data: { comment: Comment | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<PUTReturn>> => {
  const payload: unknown = await request.json();
  const id: number = Number((await params).id);

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
): Promise<NextResponse<DELETEReturn>> => {
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
