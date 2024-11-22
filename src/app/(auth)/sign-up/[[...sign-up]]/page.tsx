import clsx from 'clsx';
import { type ReactNode } from 'react';
import { SignUp } from '@clerk/nextjs';

const Page = (): ReactNode => {
  const classNames: string = clsx(
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
