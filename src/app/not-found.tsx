'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';

import { Button } from '@/components';

const NotFound = (): ReactNode => {
  const { back, push } = useRouter();

  const handleClick = (): void => {
    push('/');
  };

  const classNames: string = clsx(
    'p-2 flex flex-col justify-center items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  const buttonGroupClassNames: string = clsx(
    'mb-[65px] self-stretch flex flex-col gap-4',
    'md:mx-auto md:flex-row md:gap-6',
    'xl:gap-8'
  );

  return (
    <main className={classNames}>
      <h1 className='text-xl font-bold text-red-600'>Not Found</h1>
      <p className='text-center text-lg'>Could not find requested resource</p>
      <div className={buttonGroupClassNames}>
        <Button onClick={back}>Return to previous page</Button>
        <Button onClick={handleClick}>Go to Home page</Button>
      </div>
    </main>
  );
};

export default NotFound;
