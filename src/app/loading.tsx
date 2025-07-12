import clsx from 'clsx';
import { type JSX } from 'react';

const Loading = (): JSX.Element => {
  const classNames = clsx(
    'p-2 flex justify-center items-center gap-4',
    'md:p-5 md:gap-6',
    'xl:p-8 xl:gap-8'
  );

  return (
    <main className={classNames}>
      <h1 className='mb-[67px] text-xl font-bold text-yellow-400 italic'>
        Loading...
      </h1>
    </main>
  );
};

export default Loading;
