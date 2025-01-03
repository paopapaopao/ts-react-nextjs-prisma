import { type NextRequest, NextResponse } from 'next/server';
import { type Comment } from '@prisma/client';

import { readComments } from '@/lib/actions';
import { COMMENTS_FETCH_COUNT } from '@/lib/constants';

type GETParams = {
  params: Promise<{ id: string }>;
};

type GETReturn = {
  data: {
    comments: Comment[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  request: NextRequest,
  { params }: GETParams
): Promise<NextResponse<GETReturn>> => {
  const { searchParams } = new URL(request.url);
  const cursor: number = Number(searchParams.get('cursor'));
  const id: number = Number((await params).id);

  const comments: Comment[] = await readComments({
    ...(cursor > 0 && {
      cursor: { id: cursor },
      skip: 1,
    }),
    where: {
      postId: id,
      parentCommentId: null,
    },
    include: {
      user: true,
      _count: {
        select: { replies: true },
      },
    },
    take: COMMENTS_FETCH_COUNT,
    orderBy: { createdAt: 'asc' },
  });

  const hasMore: boolean = comments.length > 0;

  return NextResponse.json({
    data: {
      comments,
      nextCursor: hasMore ? comments[comments.length - 1].id : null,
    },
    errors: null,
    success: true,
  });
};

export { GET };
