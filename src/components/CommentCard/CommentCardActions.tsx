'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDeleteComment } from '@/lib/hooks';
import useCommentCard from './useCommentCard';

const CommentCardActions = (): ReactNode => {
  const { comment, onModeToggle } = useCommentCard();
  const { mutate: deleteComment } = useDeleteComment();

  const handleClick = (): void => {
    deleteComment(comment?.id);
  };

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <div className={classNames}>
      <button onClick={onModeToggle}>
        <FaRegEdit size={16} />
      </button>
      <button onClick={handleClick}>
        <RiDeleteBin6Line size={16} />
      </button>
    </div>
  );
};

export default CommentCardActions;
