import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { type Comment } from '@prisma/client';

import { COMMENTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';

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

  const { userId } = await auth();

  const comments = await prisma.comment.findMany({
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
      reactions: {
        where: { clerkUserId: userId },
        select: { type: true },
      },
    },
    take: COMMENTS_FETCH_COUNT,
    orderBy: { createdAt: 'asc' },
  });

  // TODO
  const reactionCounts = await prisma.reaction.groupBy({
    by: ['commentId', 'type'],
    _count: { type: true },
  });

  // TODO
  const commentsWithReactionCounts = comments.map((comment) => {
    const reactionCount = reactionCounts.reduce(
      (accumulator, reaction) => {
        if (reaction.commentId === comment.id) {
          accumulator[reaction.type] = reaction._count.type;
        }

        return accumulator;
      },
      { LIKE: 0, DISLIKE: 0 }
    );

    return {
      ...comment,
      reactionCount,
    };
  });

  // TODO
  const commentsWithUserReaction = commentsWithReactionCounts.map((comment) => {
    const userReaction =
      comment?.reactions?.length > 0 ? comment?.reactions?.[0].type : null;

    return {
      ...comment,
      userReaction,
    };
  });

  const hasMore: boolean = commentsWithUserReaction.length > 0;

  return NextResponse.json({
    data: {
      comments: commentsWithUserReaction,
      nextCursor: hasMore
        ? commentsWithUserReaction[commentsWithUserReaction.length - 1].id
        : null,
    },
    errors: null,
    success: true,
  });
};

export { GET };
