import { type NextRequest, NextResponse } from 'next/server';
import { type Comment } from '@prisma/client';
import { readComments } from '@/lib/actions';

type GetParams = { params: Promise<{ id: string }> };

type GetReturn = {
  data: {
    comments: Comment[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse<GetReturn>> => {
  const { searchParams } = new URL(request.url);
  const cursor: number = Number(searchParams.get('cursor'));

  const id: string = (await params).id;

  const comments: Comment[] = await readComments({
    ...(cursor > 0 && {
      cursor: { id: cursor },
      skip: 1,
    }),
    where: { postId: Number(id) },
    include: { user: true },
    take: 4,
    orderBy: [{ createdAt: 'asc' }],
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
