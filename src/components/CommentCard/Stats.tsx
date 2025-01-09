'use client';

import { type ReactNode } from 'react';
import { GrDislike, GrLike } from 'react-icons/gr';

import useCommentCard from './useCommentCard';

const Stats = (): ReactNode => {
  const {
    comment,
    commentStats: { hasReactions, hasReplies },
    onReplyListToggle,
  } = useCommentCard();

  return (
    <div className='flex gap-4'>
      {hasReactions && (
        <div className='flex items-center gap-2'>
          <span className='text-xs'>{comment?._count?.reactions}</span>
          <GrLike size={16} />
          <GrDislike size={16} />
        </div>
      )}
      {hasReplies && (
        <button
          onClick={onReplyListToggle}
          className='text-xs'
        >
          {`${comment?._count?.replies} replies`}
        </button>
      )}
    </div>
  );
};

export default Stats;
