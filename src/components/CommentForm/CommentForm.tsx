'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { BiSend } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateComment, useSignedInUser } from '@/lib/hooks';
import { commentSchema } from '@/lib/schemas';
import { useCommentMutationStore } from '@/lib/stores';
import { type CommentSchema } from '@/lib/types';

import usePostCard from '../PostCard/usePostCard';

type Props = { parentCommentId?: number | null };

const CommentForm = ({ parentCommentId = null }: Props): ReactNode => {
  const { signedInUser } = useSignedInUser();
  const { post } = usePostCard();

  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
      userId: signedInUser?.id,
      postId: post?.id,
      parentCommentId,
    },
  });

  const { mutate: createComment } = useCreateComment();

  const setCommentMutationData = useCommentMutationStore(
    (state) => state.setData
  );

  const onSubmit = (data: CommentSchema): void => {
    createComment(data, {
      onSuccess: (): void => {
        setCommentMutationData(data);
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
