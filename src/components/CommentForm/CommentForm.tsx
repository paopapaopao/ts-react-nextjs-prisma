'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { BiSend } from 'react-icons/bi';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Comment } from '@prisma/client';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';
import usePostCard from '../PostCard/usePostCard';

interface Props {
  className?: string;
  comment?: Comment | null;
}

// *NOTE: Temporary
const USER_ID = 21;

const CommentForm = ({ className = '', comment = null }: Props): ReactNode => {
  const { post } = usePostCard();

  // TODO
  const defaultValues = {
    ...(comment && { id: comment?.id }),
    body: comment?.body || '',
    postId: post?.id,
    userId: comment?.userId || USER_ID,
  };

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues,
  });

  const onSubmit = async (data: CommentSchema): Promise<void> => {
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    reset();
  };

  const classNames: string = clsx(
    'px-2 flex gap-4',
    'md:px-4 md:gap-6',
    'xl:gap-8',
    'rounded-lg bg-zinc-700',
    className
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames}
    >
      {comment && (
        <input
          {...register('id')}
          name='id'
          className='hidden'
        />
      )}
      <input
        {...register('body')}
        name='body'
        className='flex-auto outline-none rounded-lg bg-zinc-700 text-white'
      />
      <input
        {...register('postId')}
        name='postId'
        className='hidden'
      />
      <input
        {...register('userId')}
        name='userId'
        className='hidden'
      />
      <button disabled={isSubmitting}>
        <BiSend size={24} />
      </button>
    </form>
  );
};

export default CommentForm;
