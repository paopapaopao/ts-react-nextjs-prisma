import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { HttpMethods } from '@/lib/enums';
import { commentSchema } from '@/lib/schemas';
import type { CommentMutation, CommentSchema } from '@/lib/types';
import {
  authenticateUser,
  parsePayload,
  responseWithCors,
} from '@/lib/utilities';

const ALLOWED_METHODS = [HttpMethods.POST, HttpMethods.OPTIONS].join(', ');

const POST = async (
  request: NextRequest
): Promise<NextResponse<CommentMutation>> => {
  const authenticateUserResult =
    await authenticateUser<CommentMutation>(ALLOWED_METHODS);

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

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: { comment: response },
          errors: null,
        }),
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
          },
        }
      )
    );
  } catch (error: unknown) {
    console.error('Comment create error:', error);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Comment create failed'] },
        }),
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
          },
        }
      )
    );
  }
};

const OPTIONS = (): NextResponse<null> => {
  return responseWithCors<null>(
    new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
      },
    })
  );
};

export { OPTIONS, POST };
