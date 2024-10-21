import clsx from 'clsx';
import React from 'react';
import { type Post } from '@prisma/client';
import { readPost } from '@/apis';
import { PostCard } from '@/components';

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

  const classNames: string = clsx(
    'post-details-page',
    'p-8 flex flex-col items-center gap-4'
  );

  return (
    <main className={classNames}>
      <h1 className='text-xl font-bold'>Post {id}</h1>
      <PostCard post={post} />
    </main>
  );
};

export default Page;
