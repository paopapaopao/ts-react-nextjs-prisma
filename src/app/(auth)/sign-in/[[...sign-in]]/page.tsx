import clsx from 'clsx';
import { type Metadata } from 'next';
import { type ReactNode } from 'react';
import { SignIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign In',
};

const Page = (): ReactNode => {
  const classNames: string = clsx(
    'p-2 flex justify-center items-center',
    'md:p-5',
    'xl:p-8'
  );

  return (
    <main className={classNames}>
      <SignIn />
    </main>
  );
};

export default Page;
