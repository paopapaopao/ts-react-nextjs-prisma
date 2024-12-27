'use client';

import clsx from 'clsx';
import { type ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

import { COMMENTS_FETCH_COUNT } from '@/lib/constants';
import { type CommentWithUserAndReplyCount } from '@/lib/types';

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

  const { inView, ref } = useInView();

  useEffect((): void => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const classNames: string = clsx(
    'flex flex-col items-center gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return status === 'pending' ? (
    <ul className={clsx('self-stretch', classNames)}>
      {Array.from({ length: COMMENTS_FETCH_COUNT }).map((_, index) => (
        <li
          key={index}
          className='self-stretch'
        >
          <CommentCardSkeleton />
        </li>
      ))}
    </ul>
  ) : status === 'error' ? (
    <div>{error.message}</div>
  ) : (
    <>
      <ul className={classNames}>
        {data.pages.map((page, index) => (
          <li
            key={`comment-group-${index}`}
            className='self-stretch'
          >
            <ul className={classNames}>
              {page.data.comments.map(
                (comment: CommentWithUserAndReplyCount) => (
                  <li
                    key={`comment-${comment?.id}`}
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
      {!hasNextPage && <div>All comments loaded.</div>}
      <div
        ref={ref}
        className='self-stretch'
      >
        {isFetchingNextPage && <CommentCardSkeleton />}
      </div>
    </>
  );
};

export default CommentList;
