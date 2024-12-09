'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components';

const Page = (): ReactNode => {
  const { id } = useParams();

  const getPost = async () => {
    const response: Response = await fetch(`/api/posts/${id}`);
    const data = await response.json();

    return data;
  };

  const { data } = useQuery({ queryKey: ['post'], queryFn: getPost });

  const classNames: string = clsx(
    'p-2 flex flex-col items-center',
    'md:p-5',
    'xl:p-8'
  );

  return (
    <main className={classNames}>
      <PostCard
        post={data?.data?.post}
        className='min-w-[344px] w-full max-w-screen-xl'
      />
    </main>
  );
};

export default Page;
