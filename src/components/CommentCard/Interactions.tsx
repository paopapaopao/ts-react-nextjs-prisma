'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { ReactionType } from '@prisma/client';

import { ReactionButtonGroup } from '../ReactionButtonGroup';

import useCommentCard from './useCommentCard';

const Interactions = (): ReactNode => {
  const { comment, onReplyFormToggle } = useCommentCard();

  const likeButtonClassNames: string = clsx(
    'text-xs',
    comment?.userReaction === ReactionType.LIKE && 'text-green-600'
  );

  const dislikeButtonClassNames: string = clsx(
    'text-xs',
    comment?.userReaction === ReactionType.DISLIKE && 'text-red-600'
  );

  const classNames: string = clsx(
    'ms-12 flex gap-4',
    'md:ms-[52px]',
    'xl:ms-14'
  );

  return (
    <div className={classNames}>
      <ReactionButtonGroup commentId={comment?.id}>
        <button className={likeButtonClassNames}>Like</button>
        <button className={dislikeButtonClassNames}>Dislike</button>
      </ReactionButtonGroup>
      <button
        onClick={onReplyFormToggle}
        className='text-xs'
      >
        Reply
      </button>
    </div>
  );
};

export default Interactions;
