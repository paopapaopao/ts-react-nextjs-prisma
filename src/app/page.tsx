import clsx from 'clsx';
import { type ReactNode } from 'react';
import { PostForm, PostList } from '@/components';

const Page = (): ReactNode => {
  const classNames: string = clsx(
    'home-page',
    'p-8 flex flex-col items-center gap-4'
  );

  return (
    <main className={classNames}>
      <PostForm />
      <PostList />
    </main>
  );
};

export default Page;
