'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { BiSend } from 'react-icons/bi';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';

interface Props {
  className?: string;
  postId: number | undefined;
}

const CommentForm = ({ className = '', postId }: Props): ReactNode => {
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
      postId: Number(postId),
    },
  });

  const onSubmit = async (data: CommentSchema): Promise<void> => {
    console.log('data', data);
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
        onChange={(event) => {
          console.log('event.target.value', event.target.value);
        }}
        className='flex-auto outline-none bg-zinc-700 text-white'
      />
      <button disabled={isSubmitting}>
        <BiSend size={24} />
      </button>
    </form>
  );
};

export default CommentForm;
