import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { type Reaction } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { prisma } from '@/lib/db';
import { reactionSchema } from '@/lib/schemas';
import type { ReactionSchema, TReaction } from '@/lib/types';

const POST = async (request: NextRequest): Promise<NextResponse<TReaction>> => {
  try {
    const { userId } = await auth();

    if (userId === null) {
      return NextResponse.json(
        {
          data: null,
          errors: { auth: ['User unauthenticated/unauthorized'] },
        },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error('User auth error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { auth: ['User auth failed'] },
      },
      { status: 401 }
    );
  }

  try {
    const payload: ReactionSchema = await request.json();

    const parsedPayload: SafeParseReturnType<ReactionSchema, ReactionSchema> =
      reactionSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          data: null,
          errors: parsedPayload.error?.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const response: Reaction | null = await prisma.reaction.create({
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
