'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { Button } from '@/components';

interface Props {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: Props): ReactNode => {
  const { back, push } = useRouter();

  const handleClick = (): void => {
    push('/');
  };

  const classNames: string = clsx(
    'error-page',
    'p-8 flex flex-col items-center gap-8'
  );

  return (
    <main className={classNames}>
      <h1 className='text-xl font-bold text-red-600'>Error</h1>
      <p className='text-lg'>
        {error.name}: {error.message}
      </p>
      <Button onClick={reset}>Try again</Button>
      <div className='flex gap-4'>
        <Button onClick={back}>Return to previous page</Button>
        <Button onClick={handleClick}>Go to Home page</Button>
      </div>
    </main>
  );
};

export default Error;
