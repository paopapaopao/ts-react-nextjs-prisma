import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type SafeParseReturnType } from 'zod';
import { type Post } from '@prisma/client';
import { readPost, updatePost } from '@/lib/actions';
import { postSchema } from '@/lib/schemas';
import { type PostSchema, type PostWithComments } from '@/lib/types';

type GetParams = { params: Promise<{ id: string }> };

type GetReturn = {
  data: { post: Post | PostWithComments | null };
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
  const id: number = Number((await params).id);
  const post: Post | PostWithComments | null = await readPost({
    where: { id },
  });

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

export { GET, PUT };
