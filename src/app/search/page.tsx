import clsx from 'clsx';
import { type Metadata } from 'next';
import { type JSX } from 'react';

import { PostList, SearchForm } from '@/components';

type Props = {
  searchParams: Promise<{ query: string | null }>;
};

export const metadata: Metadata = {
  title: 'Search',
};

const Page = async ({ searchParams }: Props): Promise<JSX.Element> => {
  const query = (await searchParams).query;

  const classNames = clsx(
    'p-2 flex flex-col items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  return (
    <main className={classNames}>
      <SearchForm />
      <PostList query={query} />
    </main>
  );
};

export default Page;
