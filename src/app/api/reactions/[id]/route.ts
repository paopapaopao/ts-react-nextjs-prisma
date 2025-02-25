import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { reactionSchema } from '@/lib/schemas';
import type { ReactionMutation, ReactionSchema } from '@/lib/types';
import { authenticateUser, parsePayload } from '@/lib/utils';

type Params = {
  params: Promise<{ id: string }>;
};

const PUT = async (
  request: NextRequest,
  { params }: Params
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

    const id = (await params).id;

    const response = await prisma.reaction.update({
      where: { id },
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
    console.error('Reaction update error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['Reaction update failed'] },
      },
      { status: 500 }
    );
  }
};

const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<ReactionMutation>> => {
  const authenticateUserResult = await authenticateUser<ReactionMutation>();

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

    return NextResponse.json(
      {
        data: { reaction: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Reaction delete error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['Reaction delete failed'] },
      },
      { status: 500 }
    );
  }
};

export { DELETE, PUT };
