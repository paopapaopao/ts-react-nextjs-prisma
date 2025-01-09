'use client';

import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

import { useDeletePost } from '@/lib/hooks';

import { Button } from '../Button';

import usePostCard from './usePostCard';

const Actions = (): ReactNode => {
  const {
    post,
    postStats: { isASharePost, hasComments },
    onModeToggle,
  } = usePostCard();

  const { mutate: deletePost } = useDeletePost();

  const handleClick = (): void => {
    deletePost(post?.id, {
      onSuccess: (): void => {
        toast.success('Post deleted successfully!');
      },
    });
  };

  return (
    <div className='flex gap-4'>
      {!isASharePost && (
        <button onClick={onModeToggle}>
          <FaRegEdit size={16} />
        </button>
      )}
      <Popover
        placement='top'
        className='text-black'
      >
        <PopoverTrigger>
          <button>
            <RiDeleteBin6Line size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className='gap-2'>
          <h2 className='text-lg font-bold'>Delete post</h2>
          <p className='text-center'>
            {hasComments && (
              <>
                All {post?._count?.comments} comments will be deleted as well.
                <br />
              </>
            )}
            Are you sure you want to delete this post?
          </p>
          <Button onClick={handleClick}>Delete</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Actions;
