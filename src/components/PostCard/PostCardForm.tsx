'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePost } from '@/lib/hooks';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';
import { Button } from '../Button';
import usePostCard from './usePostCard';

const PostCardForm = (): ReactNode => {
  const { user } = useUser();
  const { post, onSuccess } = usePostCard();

  // TODO
  const defaultValues = {
    title: post?.title,
    body: post?.body,
    userId: post?.userId,
    clerkUserId: user?.id,
  };

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues,
  });

  const { mutate: updatePost } = useUpdatePost();

  const onSubmit = (data: PostSchema): void => {
    updatePost(
      { id: post?.id, payload: data },
      {
        onSuccess: (): void => {
          reset();
          onSuccess();
        },
      }
    );
  };

  const classNames: string = clsx(
    'flex flex-col gap-4',
    'md:gap-6',
    'xl:gap-8',
    'bg-zinc-800'
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames}
    >
      <div className='flex flex-col gap-2'>
        <input
          {...register('title')}
          name='title'
          type='text'
          placeholder='Enter title'
          className='bg-zinc-700 shadow border rounded py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.title && (
          <p className='text-red-700'>{`${errors.title.message}`}</p>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <textarea
          {...register('body')}
          name='body'
          rows={4}
          placeholder='Enter body'
          className='bg-zinc-700 shadow border rounded py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline resize-none'
        />
        {errors.body && (
          <p className='text-red-700'>{`${errors.body.message}`}</p>
        )}
      </div>
      <Button disabled={isSubmitting}>Update post</Button>
    </form>
  );
};

export default PostCardForm;
