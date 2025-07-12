'use client';

import { type ReactNode } from 'react';
import { GrDislike, GrLike } from 'react-icons/gr';

import { useCommentCard } from './useCommentCard';

export const Stats = (): ReactNode => {
  const { comment, hasReactions, hasReplies, onReplyListToggle } =
    useCommentCard();

  return (
    <div className='flex gap-4'>
      {hasReactions && (
        <div className='flex items-center gap-2 text-comment-card-foreground'>
          <span className='text-xs'>{comment?._count.reactions}</span>
          <GrLike size={16} />
          <GrDislike size={16} />
        </div>
      )}
      {hasReplies && (
        <button
          onClick={onReplyListToggle}
          className='text-xs text-comment-card-foreground'
        >
          {`${comment?._count.replies} replies`}
        </button>
      )}
    </div>
  );
};
