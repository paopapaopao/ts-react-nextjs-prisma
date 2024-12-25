'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';

import useCommentCard from './useCommentCard';

const CommentCardInteractions = (): ReactNode => {
  const { comment, onReplyListToggle } = useCommentCard();

  const classNames: string = clsx(
    'ml-12',
    'md:ml-[52px]',
    'xl:ml-14',
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
