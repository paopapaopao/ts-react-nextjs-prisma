'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import usePostCard from './usePostCard';

const Stats = (): ReactNode => {
  const { post, onCommentListToggle } = usePostCard();

  const hasReactions: boolean =
    post.reactionCounts.LIKE > 0 || post.reactionCounts.DISLIKE > 0;

  const hasComments: boolean = (post?._count?.comments ?? 0) > 0;

  const classNames: string = clsx(
    [
      'flex',
      hasReactions && 'justify-between',
      !hasReactions && hasComments && 'justify-end',
      'gap-2',
    ],
    'md:gap-3',
    'xl:gap-4'
  );

  return (
    <div className={classNames}>
      {hasReactions && (
        <div className='flex gap-4'>
          <span className='text-sm'>{`${post?.reactionCounts.LIKE} likes`}</span>
          <span className='text-sm'>{`${post?.reactionCounts.DISLIKE} dislikes`}</span>
        </div>
      )}
      {hasComments && (
        <button
          onClick={onCommentListToggle}
          className='text-sm'
        >{`${post?._count?.comments} comments`}</button>
      )}
    </div>
  );
};

export default Stats;
