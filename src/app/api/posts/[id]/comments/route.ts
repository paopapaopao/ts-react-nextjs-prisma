import { type NextRequest, NextResponse } from 'next/server';
import { type Comment } from '@prisma/client';
import { readComments } from '@/lib/actions';

type GetParams = { params: Promise<{ id: string }> };

type GetReturn = {
  data: { comments: Comment[] | null };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: GetParams
): Promise<NextResponse<GetReturn>> => {
  const id: string = (await params).id;
  const comments: Comment[] = await readComments({
    where: { postId: Number(id) },
  });

  return NextResponse.json({
    data: { comments },
    errors: null,
    success: true,
  });
};

export { GET };
