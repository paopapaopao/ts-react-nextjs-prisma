import { type NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { COMMENTS_FETCH_COUNT } from '@/lib/constants';
import { prisma } from '@/lib/db';
import type { CommentInfiniteQuery } from '@/lib/types';
import { authenticateUser } from '@/lib/utilities';

type Params = {
  params: Promise<{ id: string }>;
};

const GET = async (
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<CommentInfiniteQuery>> => {
  const authenticateUserResult = await authenticateUser<CommentInfiniteQuery>();

  if (authenticateUserResult instanceof NextResponse) {
    return authenticateUserResult;
  }

  try {
    const { userId } = authenticateUserResult;

    const searchParams = request.nextUrl.searchParams;
    const cursor = Number(searchParams.get('cursor'));
    const id = Number((await params).id);

    const response = await prisma.comment.findMany({
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
          select: {
            replies: true,
            reactions: true,
          },
        },
        reactions: {
          where: { clerkUserId: userId },
        },
      },
      take: COMMENTS_FETCH_COUNT,
      orderBy: { createdAt: Prisma.SortOrder.asc },
    });

    // TODO
    const commentsWithUserReaction = response.map((comment) => {
      const { reactions, ...commentWithoutReactions } = comment;
      const userReaction = reactions[0] ?? null;

      return { ...commentWithoutReactions, userReaction };
    });

    const hasMore = commentsWithUserReaction.length > 0;

    return NextResponse.json(
      {
        data: {
          comments: commentsWithUserReaction,
          nextCursor: hasMore
            ? commentsWithUserReaction[commentsWithUserReaction.length - 1].id
            : null,
        },
        errors: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Comment find many error:', error);

    return NextResponse.json(
      {
        data: null,
        errors: { database: ['Comment find many failed'] },
      },
      { status: 500 }
    );
  }
};

export { GET };
