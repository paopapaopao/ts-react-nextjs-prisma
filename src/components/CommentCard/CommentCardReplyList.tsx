'use client';

import clsx from 'clsx';
import { type ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

import { REPLIES_FETCH_COUNT } from '@/lib/constants';
import { type CommentWithUserAndReplyCount } from '@/lib/types';

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

  const { inView, ref } = useInView();

  useEffect((): void => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const classNames: string = clsx(
    'ms-12 flex flex-col gap-2',
    'md:ms-[52px] md:gap-3',
    'xl:ms-14 xl:gap-4'
  );

  return status === 'pending' ? (
    <ul className={clsx('self-stretch', classNames)}>
      {Array.from({ length: REPLIES_FETCH_COUNT }).map(
        (_: unknown, index: number) => (
          <li
            key={`reply-skeleton-${index}`}
            className='self-stretch'
          >
            <CommentCardSkeleton />
          </li>
        )
      )}
    </ul>
  ) : status === 'error' ? (
    <div>{error.message}</div>
  ) : (
    <>
      <ul className={classNames}>
        {data.pages.map((page, index: number) => (
          <li
            key={`reply-group-${index}`}
            className='self-stretch'
          >
            <ul className={clsx('flex flex-col gap-2', 'md:gap-3', 'xl:gap-4')}>
              {page.data.comments.map(
                (comment: CommentWithUserAndReplyCount) => (
                  <li
                    key={`reply-${comment?.id}`}
                    className='self-stretch'
                  >
                    <CommentCard comment={comment} />
                  </li>
                )
              )}
            </ul>
          </li>
        ))}
      </ul>
      {!hasNextPage && (
        <div className={clsx('ms-12', 'md:ms-[52px]', 'xl:ms-14')}>
          All replies loaded.
        </div>
      )}
      <div
        ref={ref}
        className='self-stretch'
      >
        {isFetchingNextPage && <CommentCardSkeleton />}
      </div>
    </>
  );
};

export default CommentCardReplyList;
