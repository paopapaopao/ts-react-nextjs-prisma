'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { type JSX } from 'react';

import { Button } from '@/components';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: Props): JSX.Element => {
  const { back, push } = useRouter();

  const handleClick = (): void => {
    push('/');
  };

  const classNames = clsx(
    'p-2 flex flex-col justify-center items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  const buttonGroupClassNames = clsx(
    'mb-[67px] self-stretch flex flex-col gap-4',
    'md:mx-auto md:flex-row md:gap-6',
    'xl:gap-8'
  );

  return (
    <main className={classNames}>
      <h1 className='text-xl font-bold text-red-600'>Error</h1>
      <p className='text-center text-lg'>
        {error.name}: {error.message}
      </p>
      <Button
        onClick={reset}
        className='self-stretch md:self-auto'
      >
        Try again
      </Button>
      <div className={buttonGroupClassNames}>
        <Button onClick={back}>Return to previous page</Button>
        <Button onClick={handleClick}>Go to Home page</Button>
      </div>
    </main>
  );
};

export default Error;
