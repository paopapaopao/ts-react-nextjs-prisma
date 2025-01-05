'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import { ReactionButtonGroup } from '../ReactionButtonGroup';

import useCommentCard from './useCommentCard';

const Interactions = (): ReactNode => {
  const { comment, onReplyFormToggle } = useCommentCard();

  const classNames: string = clsx(
    'ms-12 flex gap-4',
    'md:ms-[52px]',
    'xl:ms-14'
  );

  return (
    <div className={classNames}>
      <ReactionButtonGroup commentId={comment?.id}>
        <button className='text-xs'>Like</button>
        <button className='text-xs'>Dislike</button>
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
