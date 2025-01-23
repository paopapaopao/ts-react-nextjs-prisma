import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Reaction } from '@prisma/client';

import { prisma } from '@/lib/db';
import { reactionSchema } from '@/lib/schemas';
import { type ReactionSchema } from '@/lib/types';

type Return = {
  data: { reaction: Reaction | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const POST = async (request: NextRequest): Promise<NextResponse<Return>> => {
  const payload: ReactionSchema = await request.json();

  const parsedPayload: SafeParseReturnType<ReactionSchema, ReactionSchema> =
    reactionSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  try {
    const response: Reaction | null = await prisma.reaction.create({
      data: parsedPayload.data,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.postId}`);

    return NextResponse.json({
      data: { reaction: response },
      errors: null,
      success: true,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json({
      data: null,
      errors: error,
      success: false,
    });
  }
};

export { POST };
