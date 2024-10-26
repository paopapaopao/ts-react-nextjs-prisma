'use client';

import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';
import { Button } from '../Button';

interface Props {
  post?: PostSchema | null;
}

const PostForm = ({ post }: Props): ReactNode => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post?.id,
      title: post?.title,
      body: post?.body,
    },
  });

  const onSubmit = async (data: PostSchema): Promise<void> => {
    await fetch('/api/posts', {
      method: post ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.id,
        title: data.title,
        body: data.body,
      }),
    });

    reset();
  };

  const buttonText = post ? 'Update post' : 'Create post';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='p-8 flex flex-col gap-4 bg-white rounded-lg shadow-md'
    >
      {post && (
        <input
          {...register('id')}
          name='id'
          className='hidden'
        />
      )}
      <label className='flex flex-col gap-2 text-sm font-bold text-gray-700'>
        Title
        <input
          {...register('title')}
          name='title'
          type='text'
          placeholder='Enter title'
          className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.title && <p>{`${errors.title.message}`}</p>}
      </label>
      <label className='flex flex-col gap-2 text-sm font-bold text-gray-700'>
        Body
        <textarea
          {...register('body')}
          name='body'
          placeholder='Enter body'
          className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none'
        />
        {errors.body && <p>{`${errors.body.message}`}</p>}
      </label>
      <Button disabled={isSubmitting}>{buttonText}</Button>
    </form>
  );
};

export default PostForm;
