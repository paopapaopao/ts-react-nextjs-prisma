import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
  data: { post: PostWithRelationsAndRelationCountsAndUserReaction } | null;
  errors: { [key: string]: string[] } | null;
};

const GET = async (
  _: NextRequest,
  { params }: Params
): Promise<NextResponse<GETReturn>> => {
  const authUserResult = await authUser<GETReturn>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
  }

  try {
    const id: number = Number((await params).id);

    const response = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        originalPost: {
          include: { user: true },
        },
        _count: {
          select: {
            shares: true,
            comments: {
              where: { parentCommentId: null },
            },
            reactions: true,
            views: true,
          },
        },
        reactions: {
          where: { clerkUserId: authUserResult.userId },
        },
      },
    });

    if (response === null) {
      return NextResponse.json(
        {
          data: { post: null },
          errors: null,
        },
        { status: 404 }
      );
    }

    const { reactions, ...postWithoutReactions } = response;
    const userReaction = reactions?.[0] ?? null;

    return NextResponse.json(
      {
        data: {
          post: {
            ...postWithoutReactions,
            userReaction,
          },
        },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Post find unique error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['Post find unique failed'] },
      },
      { status: 500 }
    );
  }
};

const PUT = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<TPost>> => {
  const authUserResult = await authUser<TPost>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
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
  const authUserResult = await authUser<TPost>();

  if (authUserResult instanceof NextResponse) {
    return authUserResult;
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
