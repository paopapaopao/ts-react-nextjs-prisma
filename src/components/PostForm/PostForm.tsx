'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';
import { Button } from '../Button';

interface Props {
  className?: string;
  post?: PostSchema | null;
}

// *NOTE: Temporary
const USER_ID = 21;

const PostForm = ({ className = '', post }: Props): ReactNode => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post?.id,
      title: post?.title || '',
      body: post?.body || '',
      userId: post?.userId || USER_ID,
    },
  });

  const onSubmit = async (formData: PostSchema): Promise<void> => {
    const data = {
      id: formData.id,
      title: formData.title,
      body: formData.body,
      userId: formData.userId,
    };

    await fetch(`/api/${post ? `posts/${post.id}` : 'posts'}`, {
      method: post ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    reset();
  };

  const classNames: string = clsx(
    'min-w-[344px] w-full flex flex-col gap-4',
    'md:gap-6',
    'xl:gap-8',
    'bg-zinc-800',
    className
  );

  const buttonText = post ? 'Update post' : 'Create post';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames}
    >
      {post && (
        <input
          {...register('id')}
          name='id'
          className='hidden'
        />
      )}
      <label className='flex flex-col gap-2 text-sm font-bold text-white'>
        Title
        <input
          {...register('title')}
          name='title'
          type='text'
          placeholder='Enter title'
          className='bg-zinc-700 shadow border rounded py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.title && <p>{`${errors.title.message}`}</p>}
      </label>
      <label className='flex flex-col gap-2 text-sm font-bold text-white'>
        Body
        <textarea
          {...register('body')}
          name='body'
          rows={4}
          placeholder='Enter body'
          className='bg-zinc-700 shadow border rounded py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline resize-none'
        />
        {errors.body && <p>{`${errors.body.message}`}</p>}
      </label>
      <input
        {...register('userId')}
        name='userId'
        className='hidden'
      />
      <Button disabled={isSubmitting}>{buttonText}</Button>
    </form>
  );
};

export default PostForm;
