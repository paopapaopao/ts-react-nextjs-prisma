import { type ReactNode } from 'react';
import { PostForm, PostList, SearchField } from '@/components';

const Page = (): ReactNode => {
  return (
    <main className='p-8 flex flex-col items-center gap-4'>
      <SearchField />
      <PostForm />
      <PostList />
    </main>
  );
};

export default Page;
