'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { COMMENTS_FETCH_COUNT } from '@/lib/constants';
import { type CommentWithUserAndRepliesCount } from '@/lib/types';

import { CommentCard } from '../CommentCard';
import { CommentCardSkeleton } from '../CommentCardSkeleton';
import usePostCard from '../PostCard/usePostCard';

const CommentList = (): ReactNode => {
  const { post } = usePostCard();

  // TODO
  const getComments = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `/api/posts/${post?.id}/comments?cursor=${pageParam}`
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
    queryFn: getComments,
    queryKey: ['comments', post?.id],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

  const handleClick = (): void => {
    fetchNextPage();
  };

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return status === 'pending' ? (
    <ul className={classNames}>
      {Array.from({ length: COMMENTS_FETCH_COUNT }).map(
        (_: unknown, index: number) => (
          <li key={`comment-skeleton-${index}`}>
            <CommentCardSkeleton />
          </li>
        )
      )}
    </ul>
  ) : status === 'error' ? (
    <p>{error.message}</p>
  ) : (
    <div className={classNames}>
      <ul className={classNames}>
        {data.pages.map((page, index: number) => {
          if (page.data.comments.length === 0) {
            return null;
          }

          return (
            <li key={`comment-group-${index}`}>
              <ul className={classNames}>
                {page.data.comments.map(
                  (comment: CommentWithUserAndRepliesCount) => (
                    <li key={`comment-${comment?.id}`}>
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
          className='cursor-pointer'
        >
          View more comments
        </p>
      ) : (
        <p>All comments loaded.</p>
      )}
    </div>
  );
};

export default CommentList;
