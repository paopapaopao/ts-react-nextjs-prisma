'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import useCommentCard from './useCommentCard';

const CommentCardInteractions = (): ReactNode => {
  const { comment, onReplyFormToggle, onReplyListToggle } = useCommentCard();

  const hasReplies: boolean | null =
    comment && comment._count && comment._count.replies > 0;

  const classNames: string = clsx('flex flex-col gap-2');

  return (
    <div className={classNames}>
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
