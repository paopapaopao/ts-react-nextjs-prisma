'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import usePostCard from './usePostCard';

const Stats = (): ReactNode => {
  const {
    post,
    hasReactions,
    hasComments,
    hasShares,
    hasViews,
    onCommentListToggle,
  } = usePostCard();

  const classNames: string = clsx(
    'flex',
    (hasReactions || hasComments) && 'justify-between',
    !(hasReactions || hasComments) && (hasShares || hasViews) && 'justify-end',
    'gap-4'
  );

  return (
    <div className={classNames}>
      {(hasReactions || hasComments) && (
        <div className='flex gap-4'>
          {hasReactions && (
            <span className='text-sm'>
              {post && '_count' in post && `${post._count.reactions} reactions`}
            </span>
          )}
          {hasComments && (
            <button
              onClick={onCommentListToggle}
              className='text-sm'
            >
              {post && '_count' in post && `${post?._count.comments} comments`}
            </button>
          )}
        </div>
      )}
      {(hasShares || hasViews) && (
        <div className='flex gap-4'>
          {hasShares && (
            <span className='text-sm'>
              {post && '_count' in post && `${post?._count.shares} shares`}
            </span>
          )}
          {hasViews && (
            <span className='text-sm'>
              {post && '_count' in post && `${post?._count.views} views`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Stats;
