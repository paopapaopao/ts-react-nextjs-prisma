import { type NextRequest, NextResponse } from 'next/server';
import { type Post } from '@prisma/client';

import { readPosts } from '@/lib/actions';
import { prisma } from '@/lib/db';

type GETReturn = {
  data: {
    nextCursor: number | null;
    posts: Post[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (request: NextRequest): Promise<NextResponse<GETReturn>> => {
  const { searchParams } = new URL(request.url);
  const cursor: number = Number(searchParams.get('cursor'));
  const query: string | null = searchParams.get('query');

  const posts: Post[] = await readPosts({
    ...(cursor > 0 && {
      cursor: { id: cursor },
      skip: 1,
    }),
    ...(query !== null && {
      where: {
        OR: [
          {
            body: { contains: String(query) },
            title: { contains: String(query) },
          },
        ],
      },
    }),
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
    },
    take: 8,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
  });

  const reactionCounts = await prisma.reaction.groupBy({
    by: ['postId', 'type'],
    _count: { type: true },
  });

  const postsWithReactionCounts = posts.map((post) => {
    const counts = reactionCounts.reduce(
      (accumulator, reaction) => {
        if (reaction.postId === post.id) {
          accumulator[reaction.type] = reaction._count.type;
        }

        return accumulator;
      },
      { LIKE: 0, DISLIKE: 0 }
    );

    return { ...post, reactionCounts: counts };
  });

  const hasMore: boolean = postsWithReactionCounts.length > 0;

  return NextResponse.json({
    data: {
      nextCursor: hasMore
        ? postsWithReactionCounts[postsWithReactionCounts.length - 1].id
        : null,
      posts: postsWithReactionCounts,
    },
    errors: null,
    success: true,
  });
};

export { GET };
