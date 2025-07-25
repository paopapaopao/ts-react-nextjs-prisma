import clsx from 'clsx';
import { type Metadata } from 'next';
import { type JSX } from 'react';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign Up',
};

const Page = (): JSX.Element => {
  const classNames = clsx(
    'p-2 flex justify-center items-center',
    'md:p-5',
    'xl:p-8'
  );

  return (
    <main className={classNames}>
      <SignUp />
    </main>
  );
};

export default Page;
