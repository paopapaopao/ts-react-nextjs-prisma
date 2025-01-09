import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';

import { COMMENTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

type Params = {
  params: Promise<{ id: string }>;
};

type Return = {
  data: {
    comments: CommentWithRelationsAndRelationCountsAndUserReaction[];
    nextCursor: number | null;
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const GET = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<Return>> => {
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
    orderBy: { createdAt: Prisma.SortOrder.asc },
  });

  const reactionCounts = await prisma.reaction.groupBy({
    by: [
      Prisma.ReactionScalarFieldEnum.commentId,
      Prisma.ReactionScalarFieldEnum.type,
    ],
    _count: { type: true },
  });

  const commentsWithReactionCounts = comments.map((comment) => {
    const counts = reactionCounts.reduce(
      (accumulator, reactionCount) => {
        if (reactionCount.commentId === comment.id) {
          accumulator[reactionCount.type] = reactionCount._count.type;
        }

        return accumulator;
      },
      { LIKE: 0, DISLIKE: 0 }
    );

    return {
      ...comment,
      reactionCounts: counts,
    };
  });

  const commentsWithUserReaction = commentsWithReactionCounts.map((comment) => {
    const userReaction =
      comment.reactions.length > 0 ? comment.reactions[0].type : null;

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
