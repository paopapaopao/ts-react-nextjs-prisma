'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import { REPLIES_FETCH_COUNT } from '@/lib/constants';
import { useReadReplies } from '@/lib/hooks';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { CommentCardSkeleton } from '../CommentCardSkeleton';

import CommentCard from './CommentCard';
import useCommentCard from './useCommentCard';

const CommentCardReplyList = (): ReactNode => {
  const { comment } = useCommentCard();

  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useReadReplies(comment);

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
      {Array.from({ length: REPLIES_FETCH_COUNT }).map((_, index: number) => (
        <li key={`reply-skeleton-${index}`}>
          <CommentCardSkeleton />
        </li>
      ))}
    </ul>
  ) : status === 'error' ? (
    <p className={clsx(marginClassNames, 'text-red-600')}>
      {Object.values(error).flat().join('. ').trim()}
    </p>
  ) : (
    <div className={clsx(marginClassNames, flexClassNames)}>
      <ul className={flexClassNames}>
        {data.pages
          .flatMap((page) => page.data?.comments ?? [])
          ?.map(
            (comment: CommentWithRelationsAndRelationCountsAndUserReaction) => (
              <li key={`reply-${comment?.id}`}>
                <CommentCard comment={comment} />
              </li>
            )
          )}
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
