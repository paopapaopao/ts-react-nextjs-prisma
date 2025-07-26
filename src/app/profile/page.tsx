'use client';

import clsx from 'clsx';
import { type JSX } from 'react';

import { PostList } from '@/components';
import { useSignedInUser } from '@/lib/hooks';

const Page = (): JSX.Element => {
  const { signedInUser } = useSignedInUser();

  const classNames = clsx(
    'p-2 flex flex-col items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  return (
    <main className={classNames}>
      <PostList clerkUserId={signedInUser?.clerkId} />
    </main>
  );
};

export default Page;
