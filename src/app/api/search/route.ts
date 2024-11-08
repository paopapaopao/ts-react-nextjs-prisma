import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { type Post } from '@prisma/client';
import { readPosts } from '@/lib/actions';

// TODO
const GET = async (
  request: NextRequest
): Promise<
  NextResponse<{
    data: Post[];
    nextCursor: number | null;
  }>
> => {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const query = searchParams.get('query');

  const posts: Post[] = await readPosts({
    ...(Number(cursor) > 0
      ? {
          cursor: {
            id: Number(cursor),
          },
          skip: 1,
        }
      : {}),
    take: 10,
    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    where: {
      OR: [
        {
          title: {
            contains: String(query),
          },
          body: {
            contains: String(query),
          },
        },
      ],
    },
  });

  revalidatePath('/search');

  const hasMore: boolean = posts.length > 0;

  return NextResponse.json({
    data: posts,
    nextCursor: hasMore ? posts[posts.length - 1].id : null,
    // nextCursor: hasMore ? posts.at(-1)?.id : null,
  });
};

export { GET };
