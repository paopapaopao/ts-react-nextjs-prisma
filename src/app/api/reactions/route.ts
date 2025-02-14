import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type Reaction } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '@/lib/db';
import { reactionSchema } from '@/lib/schemas';
import type { ReactionSchema, ReactionMutation } from '@/lib/types';
import { authenticateUser, parsePayload } from '@/lib/utils';

const POST = async (
  request: NextRequest
): Promise<NextResponse<ReactionMutation>> => {
  const authUserResult = await authenticateUser<ReactionMutation>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  const parsePayloadResult = await parsePayload<
    ReactionSchema,
    ReactionMutation
  >(request, reactionSchema);

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const response: Reaction | null = await prisma.reaction.create({
      data: parsedPayload.data as ReactionSchema,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.postId}`);

    return NextResponse.json(
      {
        data: { reaction: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Reaction create error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Reaction create failed'] },
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
