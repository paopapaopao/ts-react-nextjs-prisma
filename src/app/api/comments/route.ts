import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Comment } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '@/lib/db';
import { commentSchema } from '@/lib/schemas';
import type { CommentSchema, TComment } from '@/lib/types';
import { authUser } from '@/lib/utils';

const POST = async (request: NextRequest): Promise<NextResponse<TComment>> => {
  const authUserResult = await authUser();

  if (authUserResult instanceof NextResponse) {
    return authUserResult as NextResponse<TComment>;
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

    const response: Comment | null = await prisma.comment.create({
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
      console.error('Comment create error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Comment create failed'] },
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

export { POST };
