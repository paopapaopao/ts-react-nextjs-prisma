import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import {
  deletePost,
  readPostWithUserAndCommentsCount,
  updatePost,
} from '@/lib/actions';
import { postSchema } from '@/lib/schemas';
import {
  type PostSchema,
  type PostWithUserAndCommentsCount,
} from '@/lib/types';

type GetParams = { params: Promise<{ id: string }> };

type GetReturn = {
  data: { post: Post | null };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

type PutReturn = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: GetParams
): Promise<NextResponse<GetReturn>> => {
  const id: string = (await params).id;
  const post: PostWithUserAndCommentsCount =
    await readPostWithUserAndCommentsCount(Number(id));

  return NextResponse.json({
    data: { post },
    errors: null,
    success: true,
  });
};

const PUT = async (request: NextRequest): Promise<NextResponse<PutReturn>> => {
  const payload: unknown = await request.json();
  const parsedPayload: SafeParseReturnType<PostSchema, PostSchema> =
    postSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json({
      data: null,
      errors: parsedPayload.error?.flatten().fieldErrors,
      success: false,
    });
  }

  const post: Post | null = await updatePost(parsedPayload.data);

  revalidatePath(`/posts/${post?.id}`);

  return NextResponse.json({
    data: { post },
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
