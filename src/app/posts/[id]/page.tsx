import clsx from 'clsx';
import React from 'react';
import { type Post } from '@prisma/client';
import { readPost, updatePost } from '@/actions';
import { PostCard, PostForm } from '@/components';

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params: { id } }: Props): Promise<JSX.Element> => {
  const post: Post | null = await readPost({
    where: {
      id: Number(id),
    },
  });

  const updatePostAction = async (formData: FormData): Promise<void> => {
    'use server';

    const title = formData.get('title');
    const body = formData.get('body');

    const data = {
      id: Number(id),
      title: String(title),
      body: String(body),
    };

    await updatePost(data);
  };

  const classNames: string = clsx(
    'post-details-page',
    'p-8 flex flex-col items-center gap-4'
  );

  return (
    <main className={classNames}>
      <PostForm
        action={updatePostAction}
        post={post}
      />
      <h1 className='text-xl font-bold'>Post {id}</h1>
      <PostCard post={post} />
    </main>
  );
};

export default Page;
