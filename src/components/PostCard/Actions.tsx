'use client';

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

import { useDeletePost } from '@/lib/hooks';
import { getPostQueryKey } from '@/lib/utilities';

import { Popover, PopoverContent, PopoverTrigger } from '../ui';
import Button from '../Button/Button';

import usePostCard from './usePostCard';

const Actions = (): ReactNode => {
  const { post, hasComments, onModeToggle } = usePostCard();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const queryKey = getPostQueryKey(pathname, searchParams, params);
  const { mutate: deletePost } = useDeletePost(queryKey, pathname);

  const { push } = useRouter();

  const handleClick = (): void => {
    deletePost(post?.id, {
      onSuccess: (): void => {
        toast.success('Post deleted successfully!');
        push(pathname === '/search' ? '/search' : '/');
      },
      onError: (error: Error): void => {
        toast.error(Object.values(error).flat().join('. ').trim());
      },
    });
  };

  return (
    <div className='flex gap-4'>
      {!post?.hasSharedPost && (
        <button onClick={onModeToggle}>
          <FaRegEdit size={16} />
        </button>
      )}
      <Popover>
        <PopoverTrigger>
          <RiDeleteBin6Line size={16} />
        </PopoverTrigger>
        <PopoverContent className='gap-2'>
          <h2 className='text-lg font-bold'>Delete post</h2>
          <p className='text-center'>
            {hasComments && (
              <>
                All {post && '_count' in post && post._count.comments} comments
                will be deleted as well.
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
