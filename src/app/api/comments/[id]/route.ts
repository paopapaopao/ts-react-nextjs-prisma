import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { type Comment } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '@/lib/db';
import { commentSchema } from '@/lib/schemas';
import type { CommentSchema, TComment } from '@/lib/types';

type Params = {
  params: Promise<{ id: string }>;
};

const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<TComment>> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return NextResponse.json(
        {
          data: null,
          errors: { auth: ['User unauthenticated/unauthorized'] },
        },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error('User auth error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { auth: ['User auth failed'] },
      },
      { status: 401 }
    );
  }

  try {
    const payload: CommentSchema = await request.json();

    const parsedPayload: SafeParseReturnType<CommentSchema, CommentSchema> =
      commentSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          data: null,
          errors: parsedPayload.error?.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const id: number = Number((await params).id);

    const response: Comment | null = await prisma.comment.update({
      where: { id },
      data: parsedPayload.data,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.postId}`);

    return NextResponse.json(
      {
        data: { comment: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Comment update error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Comment update failed'] },
        },
        { status: 500 }
      );
    }

    console.error('Payload parse error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { server: ['Internal server error'] },
      },
      { status: 500 }
    );
  }
};

const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<TComment>> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return NextResponse.json(
        {
          data: null,
          errors: { auth: ['User unauthenticated/unauthorized'] },
        },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error('User auth error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { auth: ['User auth failed'] },
      },
      { status: 401 }
    );
  }

  try {
    const id: number = Number((await params).id);

    const response: Comment | null = await prisma.comment.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.postId}`);

    return NextResponse.json(
      {
        data: { comment: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Comment delete error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Comment delete failed'] },
        },
        { status: 500 }
      );
    }

    console.error('Payload parse error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { server: ['Internal server error'] },
      },
      { status: 500 }
    );
  }
};

export { DELETE, PUT };
