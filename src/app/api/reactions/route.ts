import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Reaction } from '@prisma/client';

import { prisma } from '@/lib/db';
import { reactionSchema } from '@/lib/schemas';
import { type ReactionSchema } from '@/lib/types';

type POSTReturn = {
  data: { reaction: Reaction | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const POST = async (
  request: NextRequest
): Promise<NextResponse<POSTReturn>> => {
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

  let response: Reaction | null = null;

  try {
    const { type, userId, postId, commentId } = parsedPayload.data;

    const postWhere = {
      userId_postId: {
        userId,
        postId: Number(postId),
      },
    };

    const commentWhere = {
      userId_commentId: {
        userId,
        commentId: Number(commentId),
      },
    };

    const reaction: Reaction | null = await prisma.reaction.findUnique({
      where: postId ? postWhere : commentWhere,
    });

    if (reaction === null) {
      response = await prisma.reaction.create({ data: parsedPayload.data });
    } else {
      response = await prisma.reaction.update({
        where: postId ? postWhere : commentWhere,
        data: { type },
      });
    }
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json({
      data: null,
      errors: error,
      success: false,
    });
  }

  revalidatePath('/');
  revalidatePath(`/posts/${response?.postId}`);

  return NextResponse.json({
    data: { reaction: response },
    errors: null,
    success: true,
  });
};

export { POST };
