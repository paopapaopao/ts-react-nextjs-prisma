'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { ReactionType } from '@prisma/client';

import { ReactionButtonGroup } from '../ReactionButtonGroup/ReactionButtonGroup';

import { useCommentCard } from './useCommentCard';

export const Interactions = (): ReactNode => {
  const { comment, onReplyFormToggle } = useCommentCard();

  const classNames = clsx('ms-12 flex gap-4', 'md:ms-[52px]', 'xl:ms-14');

  const likeButtonClassNames = clsx(
    'text-xs',
    comment?.userReaction?.type === ReactionType.LIKE
      ? 'text-green-600'
      : 'text-comment-card-foreground'
  );

  const dislikeButtonClassNames = clsx(
    'text-xs',
    comment?.userReaction?.type === ReactionType.DISLIKE
      ? 'text-red-600'
      : 'text-comment-card-foreground'
  );

  return (
    <div className={classNames}>
      <ReactionButtonGroup
        comment={comment}
        commentId={comment?.id}
        classNames='flex gap-4'
      >
        <button className={likeButtonClassNames}>Like</button>
        <button className={dislikeButtonClassNames}>Dislike</button>
      </ReactionButtonGroup>
      <button
        onClick={onReplyFormToggle}
        className='text-xs text-comment-card-foreground'
      >
        Reply
      </button>
    </div>
  );
};
