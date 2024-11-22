import clsx from 'clsx';
import { type ReactNode } from 'react';
import { PostForm, PostList, SearchField } from '@/components';

const Page = (): ReactNode => {
  const classNames: string = clsx(
    'p-2 flex flex-col items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  return (
    <main className={classNames}>
      <SearchField />
      <PostForm />
      <PostList />
    </main>
  );
};

export default Page;
