'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

import { useDeleteComment } from '@/lib/hooks';

import { Button } from '../Button';

import useCommentCard from './useCommentCard';

const CommentCardActions = (): ReactNode => {
  const { comment, onModeToggle } = useCommentCard();

  const { mutate: deleteComment } = useDeleteComment();

  const type: string = comment?.parentCommentId === null ? 'Comment' : 'Reply';

  const handleClick = (): void => {
    deleteComment(comment?.id, {
      onSuccess: (): void => {
        toast.success(`${type} deleted successfully!`);
      },
    });
  };

  const hasReplies: boolean | null =
    comment && comment._count && comment._count.replies > 0;

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
          <h2 className='text-lg font-bold'>
            Delete {type.toLocaleLowerCase()}
          </h2>
          <p className='text-center'>
            Are you sure you want to delete this {type.toLocaleLowerCase()}?
            {hasReplies && (
              <>
                <br />
                All {comment?._count.replies} replies will be deleted as well.
              </>
            )}
          </p>
          <Button onClick={handleClick}>Delete</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CommentCardActions;
