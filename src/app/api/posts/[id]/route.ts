import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { type Post } from '@prisma/client';

import { readPostWithUserAndCommentCountAndReactionCountsAndUserReaction } from '@/lib/actions';
import { prisma } from '@/lib/db';
import { postSchema } from '@/lib/schemas';
import {
  type PostSchema,
  type PostWithUserAndCommentCountAndReactionCountsAndUserReaction,
} from '@/lib/types';

type Params = {
  params: Promise<{ id: string }>;
};

type Return = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

type GETReturn = {
  data: { post: PostWithUserAndCommentCountAndReactionCountsAndUserReaction };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<GETReturn>> => {
  const id: number = Number((await params).id);

  const { userId } = await auth();

  const response: PostWithUserAndCommentCountAndReactionCountsAndUserReaction =
    await readPostWithUserAndCommentCountAndReactionCountsAndUserReaction(
      id,
      userId
    );

  return NextResponse.json({
    data: { post: response },
    errors: null,
    success: true,
  });
};

const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<Return>> => {
  const payload: PostSchema = await request.json();

  const parsedPayload: SafeParseReturnType<PostSchema, PostSchema> =
    postSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  try {
    const id: number = Number((await params).id);

    const response: Post | null = await prisma.post.update({
      where: { id },
      data: parsedPayload.data,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.id}`);

    return NextResponse.json({
      data: { post: response },
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

const DELETE = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<Return>> => {
  try {
    const id: number = Number((await params).id);

    const response: Post | null = await prisma.post.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.id}`);

    return NextResponse.json({
      data: { post: response },
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

export { DELETE, GET, PUT };
