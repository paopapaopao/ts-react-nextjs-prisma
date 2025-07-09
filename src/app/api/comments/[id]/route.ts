import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { HttpMethod } from '@/lib/enumerations';
import { commentSchema } from '@/lib/schemas';
import type { CommentMutation, CommentSchema } from '@/lib/types';
import {
  authenticateUser,
  parsePayload,
  responseWithCors,
} from '@/lib/utilities';

type Params = {
  params: Promise<{ id: string }>;
};

const ALLOWED_METHODS = [
  HttpMethod.PUT,
  HttpMethod.DELETE,
  HttpMethod.OPTIONS,
].join(', ');

export const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<CommentMutation>> => {
  const authenticateUserResult =
    await authenticateUser<CommentMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  const parsePayloadResult = await parsePayload<CommentSchema, CommentMutation>(
    request,
    commentSchema,
    ALLOWED_METHODS
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const id = Number((await params).id);

    const response = await prisma.comment.update({
      where: { id },
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
    console.error('Comment update error:', error);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Comment update failed'] },
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

export const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<CommentMutation>> => {
  const authenticateUserResult =
    await authenticateUser<CommentMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  try {
    const id = Number((await params).id);

    const response = await prisma.comment.delete({
      where: { id },
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
    console.error('Comment delete error:', error);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Comment delete failed'] },
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

export const OPTIONS = (): NextResponse<null> => {
  return responseWithCors<null>(
    new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
      },
    })
  );
};
