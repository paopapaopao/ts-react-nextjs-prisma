import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/database';
import { HttpMethod } from '@/lib/enumerations';
import { commentSchema } from '@/lib/schemas';
import type { CommentMutation, CommentSchema } from '@/lib/types';
import {
  authenticateUser,
  authorizeUser,
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
  const authenticateUserResult = await authenticateUser<CommentMutation>(
    ALLOWED_METHODS
  );

  if (!authenticateUserResult.isAuthenticated) {
    return authenticateUserResult.response;
  }

  const id = Number((await params).id);

  try {
    const { userId: clerkId } = authenticateUserResult;

    const [user, comment] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId },
      }),
      prisma.comment.findUnique({
        where: { id },
      }),
    ]);

    const authorizeUserResult = authorizeUser<CommentMutation>(
      user,
      comment,
      ALLOWED_METHODS
    );

    if (!authorizeUserResult.isAuthorized) {
      return authorizeUserResult.response;
    }
  } catch (error: unknown) {
    console.error('Authorize user error:', error);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { server: ['Authorize user failed'] },
        }),
        {
          status: 500,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  }

  const parsePayloadResult = await parsePayload<CommentSchema, CommentMutation>(
    request,
    commentSchema,
    ALLOWED_METHODS
  );

  if (!parsePayloadResult.isParsed) {
    return parsePayloadResult.response;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response = await prisma.comment.update({
      where: { id },
      data: parsedPayload,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response.postId}`);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: { comment: response },
          errors: null,
        }),
        {
          status: 200,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  } catch (error: unknown) {
    console.error('Update comment error:', error);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { server: ['Update comment failed'] },
        }),
        {
          status: 500,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  }
};

export const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<CommentMutation>> => {
  const authenticateUserResult = await authenticateUser<CommentMutation>(
    ALLOWED_METHODS
  );

  if (!authenticateUserResult.isAuthenticated) {
    return authenticateUserResult.response;
  }

  const id = Number((await params).id);

  try {
    const { userId: clerkId } = authenticateUserResult;

    const [user, comment] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId },
      }),
      prisma.comment.findUnique({
        where: { id },
      }),
    ]);

    const authorizeUserResult = authorizeUser<CommentMutation>(
      user,
      comment,
      ALLOWED_METHODS
    );

    if (!authorizeUserResult.isAuthorized) {
      return authorizeUserResult.response;
    }
  } catch (error: unknown) {
    console.error('Authorize user error:', error);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { server: ['Authorize user failed'] },
        }),
        {
          status: 500,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  }

  try {
    const response = await prisma.comment.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response.postId}`);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: { comment: response },
          errors: null,
        }),
        {
          status: 200,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  } catch (error: unknown) {
    console.error('Delete comment error:', error);

    return responseWithCors<CommentMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { server: ['Delete comment failed'] },
        }),
        {
          status: 500,
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  }
};

export const OPTIONS = (): NextResponse<null> => {
  return responseWithCors<null>(
    new NextResponse(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
    })
  );
};
