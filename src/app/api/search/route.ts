import { type NextRequest, NextResponse } from 'next/server';
import { type Post } from '@prisma/client';
import { readPosts } from '@/lib/actions';

type GetReturn = {
  data: {
    nextCursor: number | null;
    posts: Post[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (request: NextRequest): Promise<NextResponse<GetReturn>> => {
  const { searchParams } = new URL(request.url);
  const cursor: number = Number(searchParams.get('cursor'));
  const query: string = String(searchParams.get('query'));

  const posts: Post[] = await readPosts({
    ...(cursor > 0 && {
      cursor: { id: cursor },
      skip: 1,
    }),
    where: {
      OR: [
        {
          body: { contains: query },
          title: { contains: query },
        },
      ],
    },
    take: 10,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
  });

  const hasMore: boolean = posts.length > 0;

  return NextResponse.json({
    data: {
      nextCursor: hasMore ? posts[posts.length - 1].id : null,
      posts,
    },
    errors: null,
    success: true,
  });
};

export { GET };
