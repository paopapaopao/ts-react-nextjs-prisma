import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type Comment } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '@/lib/db';
import { commentSchema } from '@/lib/schemas';
import type { CommentSchema, CommentMutation } from '@/lib/types';
import { authenticateUser, parsePayload } from '@/lib/utils';

const POST = async (
  request: NextRequest
): Promise<NextResponse<CommentMutation>> => {
  const authUserResult = await authenticateUser<CommentMutation>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  const parsePayloadResult = await parsePayload<CommentSchema, CommentMutation>(
    request,
    commentSchema
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response: Comment | null = await prisma.comment.create({
      data: parsedPayload.data as CommentSchema,
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
