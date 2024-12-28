'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

import { useDeletePost } from '@/lib/hooks';

import { Button } from '../Button';

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

  const hasComments: boolean | undefined =
    post && post._count && post._count.comments > 0;

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <div className={classNames}>
      <button onClick={onModeToggle}>
        <FaRegEdit size={16} />
      </button>
      <Popover
        placement='right'
        className='text-black'
      >
        <PopoverTrigger>
          <button>
            <RiDeleteBin6Line size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className='gap-2'>
          <h2 className='text-lg font-bold'>Delete Post</h2>
          <p className='text-center'>
            Are you sure you want to delete this post?
            {hasComments && (
              <>
                <br />
                All {post?._count?.comments} comments will be deleted as well.
              </>
            )}
          </p>
          <Button onClick={handleClick}>Delete</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PostCardActions;
