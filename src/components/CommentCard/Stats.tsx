'use client';

import { type ReactNode } from 'react';
import { GrDislike, GrLike } from 'react-icons/gr';

import useCommentCard from './useCommentCard';

const Stats = (): ReactNode => {
  const { comment, onReplyListToggle } = useCommentCard();

  const hasLikes: boolean = comment.reactionCount.LIKE > 0;
  const hasDislikes: boolean = comment.reactionCount.DISLIKE > 0;
  const hasReplies: boolean = (comment?._count?.replies ?? 0) > 0;

  return (
    <div className='flex gap-4'>
      {hasLikes && (
        <div className='flex items-center gap-2'>
          <span className='text-xs'>{comment.reactionCount.LIKE}</span>
          <GrLike size={16} />
        </div>
      )}
      {hasDislikes && (
        <div className='flex items-center gap-2'>
          <span className='text-xs'>{comment.reactionCount.DISLIKE}</span>
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
