import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type Reaction } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '@/lib/db';
import { reactionSchema } from '@/lib/schemas';
import type { ReactionSchema, TReaction } from '@/lib/types';
import { authUser, parsePayload } from '@/lib/utils';

type Params = {
  params: Promise<{ id: string }>;
};

const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<TReaction>> => {
  const authUserResult = await authUser<TReaction>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  const parsePayloadResult = await parsePayload<ReactionSchema>(
    request,
    reactionSchema
  );

  if (parsePayloadResult instanceof NextResponse) {
    return parsePayloadResult;
  }

  try {
    const { parsedPayload } = parsePayloadResult;

    const id: string = (await params).id;

    const response: Reaction | null = await prisma.reaction.update({
      where: { id },
      data: parsedPayload.data,
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
      console.error('Reaction update error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Reaction update failed'] },
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

const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<TReaction>> => {
  const authUserResult = await authUser<TReaction>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  try {
    const id: string = (await params).id;

    const response: Reaction | null = await prisma.reaction.delete({
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
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Reaction delete error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Reaction delete failed'] },
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

export { DELETE, PUT };
