import { type NextRequest, NextResponse } from 'next/server';
import { type Post } from '@prisma/client';

import { readPosts } from '@/lib/actions';
import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';

type GETReturn = {
  data: {
    posts: Post[];
    nextCursor: number | null;
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
            title: { contains: String(query) },
            body: { contains: String(query) },
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
    take: POSTS_FETCH_COUNT,
    orderBy: { updatedAt: 'desc' },
  });

  // TODO
  const reactionCounts = await prisma.reaction.groupBy({
    by: ['postId', 'type'],
    _count: { type: true },
  });

  // TODO
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
      posts: postsWithReactionCounts,
      nextCursor: hasMore
        ? postsWithReactionCounts[postsWithReactionCounts.length - 1].id
        : null,
    },
    errors: null,
    success: true,
  });
};

export { GET };
