'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import { COMMENTS_FETCH_COUNT } from '@/lib/constants';
import { useReadComments } from '@/lib/hooks';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import CommentCard from '../CommentCard/CommentCard';
import CommentCardSkeleton from '../CommentCardSkeleton/CommentCardSkeleton';
import usePostCard from '../PostCard/usePostCard';

const CommentList = (): ReactNode => {
  const { post } = usePostCard();

  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useReadComments(post?.id);

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
      {Array.from({ length: COMMENTS_FETCH_COUNT }).map((_, index: number) => (
        <li key={`comment-skeleton-${index}`}>
          <CommentCardSkeleton />
        </li>
      ))}
    </ul>
  ) : status === 'error' ? (
    <p className='text-red-600'>
      {Object.values(error).flat().join('. ').trim()}
    </p>
  ) : (
    <div className={classNames}>
      <ul className={classNames}>
        {data?.pages
          .flatMap((page) => page.data?.comments ?? [])
          ?.map(
            (comment: CommentWithRelationsAndRelationCountsAndUserReaction) => (
              <li key={`comment-${comment?.id}`}>
                <CommentCard comment={comment} />
              </li>
            )
          )}
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
