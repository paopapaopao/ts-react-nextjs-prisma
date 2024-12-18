'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useDeletePost } from '@/lib/hooks';
import usePostCard from './usePostCard';

const PostCardActions = (): ReactNode => {
  const { post, onModeToggle } = usePostCard();
  const { mutate: deletePost } = useDeletePost();

  const handleClick = (): void => {
    deletePost(post?.id, {
      onSuccess: (): void => {
        toast.success('Post deleted successfully!');
      },
    });
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

export default PostCardActions;
