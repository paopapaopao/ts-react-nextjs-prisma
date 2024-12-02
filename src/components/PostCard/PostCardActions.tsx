'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import usePostCard from './usePostCard';

interface Props {
  onToggle: () => void;
}

const PostCardActions = ({ onToggle }: Props): ReactNode => {
  const { post } = usePostCard();

  const handleClick = async (): Promise<void> => {
    await fetch(`/api/posts/${post?.id}`, { method: 'DELETE' });
  };

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <div className={classNames}>
      <button onClick={onToggle}>
        <FaRegEdit size={16} />
      </button>
      <button onClick={handleClick}>
        <RiDeleteBin6Line size={16} />
      </button>
    </div>
  );
};

export default PostCardActions;
