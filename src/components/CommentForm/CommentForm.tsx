'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { BiSend } from 'react-icons/bi';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';
import usePostCard from '../PostCard/usePostCard';

interface Props {
  className?: string;
}

const CommentForm = ({ className = '' }: Props): ReactNode => {
  const { post } = usePostCard();

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
      postId: post?.id,
    },
  });

  const onSubmit = async (data: CommentSchema): Promise<void> => {
    await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: data.body,
        postId: data.postId,
      }),
    });

    reset();
  };

  const classNames: string = clsx(
    'px-3 py-2 flex gap-4',
    'md:px-4.5 md:py-3 md:gap-6',
    'xl:px-6 xl:py-4 xl:gap-8',
    'rounded-lg bg-zinc-700',
    className
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames}
    >
      <input
        {...register('body')}
        name='body'
        className='flex-auto outline-none bg-zinc-700 text-white'
      />
      <input
        {...register('postId')}
        name='postId'
        className='hidden'
      />
      <button disabled={isSubmitting}>
        <BiSend size={24} />
      </button>
    </form>
  );
};

export default CommentForm;
