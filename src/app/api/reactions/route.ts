import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { reactionSchema } from '@/lib/schemas';
import type { ReactionMutation, ReactionSchema } from '@/lib/types';
import { authenticateUser, parsePayload } from '@/lib/utils';

const POST = async (
  request: NextRequest
): Promise<NextResponse<ReactionMutation>> => {
  const authenticateUserResult = await authenticateUser<ReactionMutation>();

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
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

    const response = await prisma.reaction.create({
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
    console.error('Reaction create error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['Reaction create failed'] },
      },
      { status: 500 }
    );
  }
};

export { POST };
