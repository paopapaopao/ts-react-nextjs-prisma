import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { commentSchema } from '@/lib/schemas';
import type { CommentMutation, CommentSchema } from '@/lib/types';
import { authenticateUser, parsePayload } from '@/lib/utils';

const POST = async (
  request: NextRequest
): Promise<NextResponse<CommentMutation>> => {
  const authenticateUserResult = await authenticateUser<CommentMutation>();

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
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

    const response = await prisma.comment.create({
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
    console.error('Comment create error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['Comment create failed'] },
      },
      { status: 500 }
    );
  }
};

export { POST };
