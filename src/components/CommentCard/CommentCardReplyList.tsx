'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { REPLIES_FETCH_COUNT } from '@/lib/constants';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { CommentCardSkeleton } from '../CommentCardSkeleton';

import CommentCard from './CommentCard';
import useCommentCard from './useCommentCard';

const CommentCardReplyList = (): ReactNode => {
  const { comment } = useCommentCard();

  // TODO
  const getReplies = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `/api/posts/${comment?.postId}/comments/${comment?.id}/replies?cursor=${pageParam}`
    );

    if (!response.ok) throw new Error('Network response was not ok');

    return response.json();
  };

  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useInfiniteQuery({
    queryFn: getReplies,
    queryKey: ['replies', comment?.postId, comment?.id],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

  const handleClick = (): void => {
    fetchNextPage();
  };

  const marginClassNames: string = clsx('ms-12', 'md:ms-[52px]', 'xl:ms-14');

  const flexClassNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return status === 'pending' ? (
    <ul className={clsx(marginClassNames, flexClassNames)}>
      {Array.from({ length: REPLIES_FETCH_COUNT }).map(
        (_: unknown, index: number) => (
          <li key={`reply-skeleton-${index}`}>
            <CommentCardSkeleton />
          </li>
        )
      )}
    </ul>
  ) : status === 'error' ? (
    <p>{error.message}</p>
  ) : (
    <div className={clsx(marginClassNames, flexClassNames)}>
      <ul className={flexClassNames}>
        {data.pages.map((page, index: number) => {
          if (page.data.comments.length === 0) {
            return null;
          }

          return (
            <li key={`reply-group-${index}`}>
              <ul className={flexClassNames}>
                {page.data.comments.map(
                  (
                    comment: CommentWithRelationsAndRelationCountsAndUserReaction
                  ) => (
                    <li key={`reply-${comment?.id}`}>
                      <CommentCard comment={comment} />
                    </li>
                  )
                )}
              </ul>
            </li>
          );
        })}
      </ul>
      {isFetchingNextPage && <CommentCardSkeleton />}
      {hasNextPage ? (
        <p
          onClick={handleClick}
          className='text-sm cursor-pointer'
        >
          View more replies
        </p>
      ) : (
        <p>All replies loaded.</p>
      )}
    </div>
  );
};

export default CommentCardReplyList;
