'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { BiSend } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateComment } from '@/lib/hooks';
import { commentSchema } from '@/lib/schemas';
import { useCommentMutationStore } from '@/lib/stores';
import { type CommentSchema } from '@/lib/types';

import useCommentCard from './useCommentCard';

const Form = (): ReactNode => {
  const { comment, onSuccess } = useCommentCard();

  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: comment?.body,
      userId: comment?.userId,
      postId: comment?.postId,
      parentCommentId: comment?.parentCommentId,
    },
  });

  const { mutate: updateComment } = useUpdateComment();

  const setCommentMutationData: (data: CommentSchema) => void =
    useCommentMutationStore((state) => state.setData);

  const onSubmit = (data: CommentSchema): void => {
    updateComment(
      { id: comment?.id, payload: data },
      {
        onSuccess: (): void => {
          setCommentMutationData(data);
          reset();
          onSuccess();
          toast.success(
            `${
              comment?.parentCommentId === null ? 'Comment' : 'Reply'
            } updated successfully!`
          );
        },
      }
    );
  };

  const classNames: string = clsx('flex gap-4', 'md:gap-5', 'xl:gap-6');

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

export default Form;
