'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '@/lib/hooks';
import { postSchema } from '@/lib/schemas';
import { type PostSchema } from '@/lib/types';
import { Button } from '../Button';

interface Props {
  className?: string;
}

// *NOTE: Temporary
const USER_ID: number = 209;

const PostForm = ({ className = '' }: Props): ReactNode => {
  const { user } = useUser();

  // TODO
  const defaultValues = {
    title: '',
    body: '',
    userId: USER_ID,
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

  const { mutate: createPost } = useCreatePost();

  const onSubmit = (data: PostSchema): void => {
    createPost(data, {
      onSuccess: (): void => {
        reset();
        toast.success('Created post successfully!');
      },
    });
  };

  const classNames: string = clsx(
    'min-w-[344px] w-full flex flex-col gap-4',
    'md:gap-6',
    'xl:gap-8',
    'bg-zinc-800',
    className
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames}
    >
      <label className='flex flex-col gap-2 text-sm font-bold text-white'>
        Title
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
        {errors.body && (
          <p className='text-red-700'>{`${errors.body.message}`}</p>
        )}
      </label>
      <Button disabled={isSubmitting}>Create post</Button>
    </form>
  );
};

export default PostForm;
