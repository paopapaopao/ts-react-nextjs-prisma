import { type ReactNode } from 'react';
import { PostList, SearchField } from '@/components';

const Page = (): ReactNode => {
  return (
    <main className='p-8 flex flex-col items-center gap-4'>
      <SearchField />
      <PostList />
    </main>
  );
};

export default Page;
