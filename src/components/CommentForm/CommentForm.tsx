'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { BiSend } from 'react-icons/bi';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Comment } from '@prisma/client';
import { useCreateComment, useUpdateComment } from '@/lib/hooks';
import { commentSchema } from '@/lib/schemas';
import { type CommentSchema } from '@/lib/types';
import usePostCard from '../PostCard/usePostCard';

interface Props {
  className?: string;
  comment?: Comment | null;
}

// *NOTE: Temporary
const USER_ID = 209;

const CommentForm = ({ className = '', comment = null }: Props): ReactNode => {
  const { user } = useUser();
  const { post } = usePostCard();

  // TODO
  const defaultValues = {
    body: comment?.body || '',
    postId: post?.id,
    userId: comment?.userId || USER_ID,
    clerkUserId: user?.id,
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

  const { mutate: createComment } = useCreateComment();
  const { mutate: updateComment } = useUpdateComment();

  const onSubmit = async (data: CommentSchema): Promise<void> => {
    if (comment === null) {
      createComment(data, {
        onSuccess: () => {
          reset();
        },
      });
    } else {
      updateComment(
        { id: comment?.id, payload: data },
        {
          onSuccess: () => {
            reset();
          },
        }
      );
    }
  };

  const classNames: string = clsx(
    'flex gap-4',
    'md:gap-6',
    'xl:gap-8',
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
      <input
        {...register('clerkUserId')}
        name='clerkUserId'
        className='hidden'
      />
      <button disabled={isSubmitting}>
        <BiSend size={24} />
      </button>
    </form>
  );
};

export default CommentForm;
