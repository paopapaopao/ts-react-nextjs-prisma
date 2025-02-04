import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { type Post } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { readPostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/actions';
import { prisma } from '@/lib/db';
import { postSchema } from '@/lib/schemas';
import type {
  PostSchema,
  PostWithRelationsAndRelationCountsAndUserReaction,
  TPost,
} from '@/lib/types';
import { authUser } from '@/lib/utils';

type Params = {
  params: Promise<{ id: string }>;
};

type GETReturn = {
  data: { post: PostWithRelationsAndRelationCountsAndUserReaction };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<GETReturn>> => {
  const id: number = Number((await params).id);

  const { userId } = await auth();

  const response: PostWithRelationsAndRelationCountsAndUserReaction =
    await readPostWithRelationsAndRelationCountsAndUserReaction(id, userId);

  return NextResponse.json({
    data: { post: response },
    errors: null,
    success: true,
  });
};

const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<TPost>> => {
  const authUserResult = await authUser();

  if (authUserResult instanceof NextResponse) {
    return authUserResult as NextResponse<TPost>;
  }

  try {
    const payload: PostSchema = await request.json();

    const parsedPayload: SafeParseReturnType<PostSchema, PostSchema> =
      postSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          data: null,
          errors: parsedPayload.error?.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const id: number = Number((await params).id);

    const response: Post | null = await prisma.post.update({
      where: { id },
      data: parsedPayload.data,
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.id}`);

    return NextResponse.json(
      {
        data: { post: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Post update error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Post update failed'] },
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
): Promise<NextResponse<TPost>> => {
  const authUserResult = await authUser();

  if (authUserResult instanceof NextResponse) {
    return authUserResult as NextResponse<TPost>;
  }

  try {
    const id: number = Number((await params).id);

    const response: Post | null = await prisma.post.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath(`/posts/${response?.id}`);

    return NextResponse.json(
      {
        data: { post: response },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Post delete error:', error);

      return NextResponse.json(
        {
          data: null,
          errors: { database: ['Post delete failed'] },
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

export { DELETE, GET, PUT };
