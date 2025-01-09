'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import usePostCard from './usePostCard';

const Stats = (): ReactNode => {
  const {
    post,
    postStates: { hasReactions, hasComments, hasShares },
    onCommentListToggle,
  } = usePostCard();

  const classNames: string = clsx(
    'flex',
    hasReactions && 'justify-between',
    !hasReactions && (hasComments || hasShares) && 'justify-end',
    'gap-4'
  );

  return (
    <div className={classNames}>
      {hasReactions && (
        <span className='text-sm'>{`${post?._count?.reactions} reactions`}</span>
      )}
      {(hasComments || hasShares) && (
        <div className='flex gap-4'>
          {hasComments && (
            <button
              onClick={onCommentListToggle}
              className='text-sm'
            >{`${post?._count?.comments} comments`}</button>
          )}
          {hasShares && (
            <span className='text-sm'>{`${post?._count?.shares} shares`}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Stats;
