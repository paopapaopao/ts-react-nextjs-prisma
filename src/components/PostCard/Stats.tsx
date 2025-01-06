'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import usePostCard from './usePostCard';

const Stats = (): ReactNode => {
  const { post, onCommentListToggle } = usePostCard();

  const hasLikes: boolean = post.reactionCounts.LIKE > 0;
  const hasDislikes: boolean = post.reactionCounts.DISLIKE > 0;
  const hasComments: boolean = (post?._count?.comments ?? 0) > 0;

  const classNames: string = clsx(
    'flex',
    (hasLikes || hasDislikes) && 'justify-between',
    !(hasLikes || hasDislikes) && hasComments && 'justify-end',
    'gap-4'
  );

  return (
    <div className={classNames}>
      {(hasLikes || hasDislikes) && (
        <div className='flex gap-4'>
          {hasLikes && (
            <span className='text-sm'>{`${post?.reactionCounts.LIKE} likes`}</span>
          )}
          {hasDislikes && (
            <span className='text-sm'>{`${post?.reactionCounts.DISLIKE} dislikes`}</span>
          )}
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
