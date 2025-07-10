import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/database';
import { HttpMethod } from '@/lib/enumerations';
import { reactionSchema } from '@/lib/schemas';
import type { ReactionMutation, ReactionSchema } from '@/lib/types';
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
): Promise<NextResponse<ReactionMutation>> => {
  const authenticateUserResult =
    await authenticateUser<ReactionMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  const parsePayloadResult = await parsePayload<
    ReactionSchema,
    ReactionMutation
  >(request, reactionSchema, ALLOWED_METHODS);

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const id = (await params).id;

    const response = await prisma.reaction.update({
      where: { id },
      data: parsedPayload.data as ReactionSchema,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.postId}`);

    return responseWithCors<ReactionMutation>(
      new NextResponse(
        JSON.stringify({
          data: { reaction: response },
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
    console.error('Reaction update error:', error);

    return responseWithCors<ReactionMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Reaction update failed'] },
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
): Promise<NextResponse<ReactionMutation>> => {
  const authenticateUserResult =
    await authenticateUser<ReactionMutation>(ALLOWED_METHODS);

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  try {
    const id = (await params).id;

    const response = await prisma.reaction.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.postId}`);

    return responseWithCors<ReactionMutation>(
      new NextResponse(
        JSON.stringify({
          data: { reaction: response },
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
    console.error('Reaction delete error:', error);

    return responseWithCors<ReactionMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Reaction delete failed'] },
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
