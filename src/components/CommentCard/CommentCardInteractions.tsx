'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import { ReactionButtonGroup } from '../ReactionButtonGroup';

import useCommentCard from './useCommentCard';

const CommentCardInteractions = (): ReactNode => {
  const { comment, onReplyFormToggle, onReplyListToggle } = useCommentCard();

  const hasReplies: boolean | null =
    comment && comment._count && comment._count.replies > 0;

  const classNames: string = clsx('flex flex-col gap-4');

  return (
    <div className={classNames}>
      <div className='flex gap-4'>
        <span
          onClick={onReplyFormToggle}
          className={clsx(
            'ms-12',
            'md:ms-[52px]',
            'xl:ms-14',
            'text-xs cursor-pointer'
          )}
        >
          Reply
        </span>
        <ReactionButtonGroup commentId={comment?.id}>
          <span className='text-xs cursor-pointer'>Like</span>
          <span className='text-xs cursor-pointer'>Dislike</span>
        </ReactionButtonGroup>
      </div>
      {hasReplies && (
        <span
          onClick={onReplyListToggle}
          className={clsx(
            'ms-12',
            'md:ms-[52px]',
            'xl:ms-14',
            'text-xs cursor-pointer'
          )}
        >
          {`View ${comment?._count.replies} replies`}
        </span>
      )}
    </div>
  );
};

export default CommentCardInteractions;
