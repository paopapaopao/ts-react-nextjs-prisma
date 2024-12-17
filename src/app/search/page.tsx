import clsx from 'clsx';
import { type Metadata } from 'next';
import { type ReactNode } from 'react';
import { PostList, SearchField } from '@/components';

export const metadata: Metadata = {
  title: 'Search',
};

const Page = (): ReactNode => {
  const classNames: string = clsx(
    'p-2 flex flex-col items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  return (
    <main className={classNames}>
      <SearchField />
      <PostList />
    </main>
  );
};

export default Page;
