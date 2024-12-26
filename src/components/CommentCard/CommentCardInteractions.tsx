'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import useCommentCard from './useCommentCard';

const CommentCardInteractions = (): ReactNode => {
  const { comment, onReplyListToggle } = useCommentCard();

  const classNames: string = clsx(
    'ms-12',
    'md:ms-[52px]',
    'xl:ms-14',
    'text-xs cursor-pointer'
  );

  return (
    <span
      onClick={onReplyListToggle}
      className={classNames}
    >
      {`View ${comment?._count.replies} replies`}
    </span>
  );
};

export default CommentCardInteractions;
