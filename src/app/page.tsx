import clsx from 'clsx';
import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { PostForm, PostList, SearchForm } from '@/components';

export const metadata: Metadata = {
  title: 'Home',
};

const Page = (): ReactNode => {
  const classNames: string = clsx(
    'p-2 flex flex-col items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  return (
    <main className={classNames}>
      <SearchForm />
      <PostForm className='p-4 md:p-6 xl:p-8 max-w-screen-md rounded-lg' />
      <PostList />
    </main>
  );
};

export default Page;
