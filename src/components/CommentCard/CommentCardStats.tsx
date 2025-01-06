'use client';

import { ReactNode } from 'react';
import { GrDislike } from 'react-icons/gr';
import { GrLike } from 'react-icons/gr';

import useCommentCard from './useCommentCard';

const CommentCardStats = (): ReactNode => {
  const { comment } = useCommentCard();

  const hasLikes: boolean = comment.reactionCount.LIKE > 0;
  const hasDislikes: boolean = comment.reactionCount.DISLIKE > 0;

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
    </div>
  );
};

export default CommentCardStats;
