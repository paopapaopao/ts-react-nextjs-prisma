'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { BiSend } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateComment } from '@/lib/hooks';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';

import usePostCard from '../PostCard/usePostCard';

type Props = { parentCommentId?: number | null };

// *NOTE: Temporary
const USER_ID: number = 209;

const CommentForm = ({ parentCommentId = null }: Props): ReactNode => {
  const { user } = useUser();
  const { post } = usePostCard();

  // TODO
  const defaultValues = {
    body: '',
    userId: USER_ID,
    postId: post?.id,
    parentCommentId,
  };

  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues,
  });

  const { mutate: createComment } = useCreateComment();

  const onSubmit = (data: CommentSchema): void => {
    createComment(data, {
      onSuccess: (): void => {
        reset();
        toast.success(
          `${
            parentCommentId === null ? 'Comment' : 'Reply'
          } created successfully!`
        );
      },
    });
  };

  const classNames: string = clsx(
    'p-2 flex-auto flex gap-4',
    'md:gap-6',
    'xl:gap-8',
    'rounded-lg bg-zinc-700'
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames}
    >
      <input
        {...register('body')}
        name='body'
        className='flex-auto outline-none rounded-lg bg-zinc-700 text-white'
      />
      <button disabled={isSubmitting}>
        <BiSend size={24} />
      </button>
    </form>
  );
};

export default CommentForm;
