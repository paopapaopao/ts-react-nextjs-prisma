'use client';

import clsx from 'clsx';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdatePost } from '@/lib/hooks';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';
import { getPostQueryKey } from '@/lib/utils';

import { Button } from '../Button';

import usePostCard from './usePostCard';

const Form = (): ReactNode => {
  const { post, onSuccess } = usePostCard();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title,
      body: post?.body,
      userId: post?.userId,
      originalPostId: post?.originalPostId,
      hasSharedPost: post?.hasSharedPost,
    },
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const queryKey = getPostQueryKey(pathname, searchParams, params);
  const { mutate: updatePost } = useUpdatePost(queryKey, pathname);

  const onSubmit = (data: PostSchema): void => {
    updatePost(
      { id: post?.id, payload: data },
      {
        onSuccess: (): void => {
          reset();
          onSuccess?.();
          toast.success('Post updated successfully!');
        },
        onError: (error): void => {
          toast.error(Object.values(error).flat().join('. ').trim());
        },
      }
    );
  };

  const classNames: string = clsx(
    'flex flex-col gap-4',
    'md:gap-5',
    'xl:gap-6'
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
          placeholder='Enter title'
          className='bg-zinc-700 shadow border rounded py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.title && (
          <p className='text-sm text-red-700'>{`${errors.title.message}`}</p>
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
          <p className='text-sm text-red-700'>{`${errors.body.message}`}</p>
        )}
      </div>
      <Button disabled={isSubmitting}>Update post</Button>
    </form>
  );
};

export default Form;
