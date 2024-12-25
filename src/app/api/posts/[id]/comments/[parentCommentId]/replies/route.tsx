import { type NextRequest, NextResponse } from 'next/server';
import { type Comment } from '@prisma/client';

import { readComments } from '@/lib/actions';

type GETParams = {
  params: Promise<{
    id: string;
    parentCommentId: string;
  }>;
};

const GET = async (_: NextRequest, { params }: GETParams) => {
  const id: string = (await params).id;
  const parentCommentId: string = (await params).parentCommentId;

  const comments: Comment[] = await readComments({
    where: {
      postId: Number(id),
      parentCommentId: Number(parentCommentId),
    },
    include: {
      user: true,
      _count: {
        select: { replies: true },
      },
    },
    orderBy: [{ createdAt: 'asc' }],
  });

  return NextResponse.json({
    data: { comments },
    errors: null,
    success: true,
  });
};

export { GET };
