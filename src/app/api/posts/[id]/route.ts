import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import {
  deletePost,
  readPostWithUserAndCommentsCountAndReactionCounts,
} from '@/lib/actions';
import { prisma } from '@/lib/db';
import { postSchema } from '@/lib/schemas';
import {
  type PostSchema,
  type PostWithUserAndCommentsCountAndReactionCounts,
} from '@/lib/types';

type GETParams = { params: Promise<{ id: string }> };

type GETReturn = {
  data: { post: PostWithUserAndCommentsCountAndReactionCounts | null };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

type PUTParams = { params: Promise<{ id: string }> };

type PUTReturn = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: GETParams
): Promise<NextResponse<GETReturn>> => {
  const id: string = (await params).id;
  const post: PostWithUserAndCommentsCountAndReactionCounts =
    await readPostWithUserAndCommentsCountAndReactionCounts(Number(id));

  return NextResponse.json({
    data: { post },
    errors: null,
    success: true,
  });
};

const PUT = async (
  request: NextRequest,
  { params }: PUTParams
): Promise<NextResponse<PUTReturn>> => {
  const payload: unknown = await request.json();
  const id: number = Number((await params).id);
  const parsedPayload: SafeParseReturnType<unknown, PostSchema> =
    postSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  let response: Post | null = null;

  try {
    response = await prisma.post.update({
      where: { id },
      data: parsedPayload.data,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json({
      data: null,
      errors: error,
      success: false,
    });
  }

  revalidatePath(`/posts/${id}`);

  return NextResponse.json({
    data: { post: response },
    errors: null,
    success: true,
  });
};

const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;
  const post: Post | null = await deletePost(Number(id));

  revalidatePath('/');

  return NextResponse.json({
    data: { post },
    errors: null,
    success: true,
  });
};

export { DELETE, GET, PUT };
