import { type NextRequest, NextResponse } from 'next/server';
import { type Comment } from '@prisma/client';

import { readComments } from '@/lib/actions';

type GETParams = {
  params: Promise<{
    id: string;
    parentCommentId: string;
  }>;
};

type GETReturn = {
  data: { comments: Comment[] };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  _: NextRequest,
  { params }: GETParams
): Promise<NextResponse<GETReturn>> => {
  const id: number = Number((await params).id);
  const parentCommentId: number = Number((await params).parentCommentId);

  const comments: Comment[] = await readComments({
    where: {
      postId: id,
      parentCommentId,
    },
    include: {
      user: true,
      _count: {
        select: { replies: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({
    data: { comments },
    errors: null,
    success: true,
  });
};

export { GET };
