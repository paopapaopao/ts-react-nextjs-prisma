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

const ALLOWED_METHODS = [HttpMethod.POST, HttpMethod.OPTIONS].join(', ');

export const POST = async (
  request: NextRequest
): Promise<NextResponse<ReactionMutation>> => {
  const authenticateUserResult = await authenticateUser<ReactionMutation>(
    ALLOWED_METHODS
  );

  if (!authenticateUserResult.isAuthenticated) {
    return authenticateUserResult.response;
  }

  const parsePayloadResult = await parsePayload<
    ReactionSchema,
    ReactionMutation
  >(request, reactionSchema, ALLOWED_METHODS);

  if (!parsePayloadResult.isParsed) {
    return parsePayloadResult.response;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response = await prisma.reaction.create({
      data: parsedPayload,
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
          headers: { 'Access-Control-Allow-Methods': ALLOWED_METHODS },
        }
      )
    );
  } catch (error: unknown) {
    console.error('Reaction create error:', error);

    return responseWithCors<ReactionMutation>(
      new NextResponse(
        JSON.stringify({
          data: null,
          errors: { database: ['Reaction create failed'] },
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
