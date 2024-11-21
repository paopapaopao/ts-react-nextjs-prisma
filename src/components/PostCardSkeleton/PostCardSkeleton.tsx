import clsx from 'clsx';
import { type ReactNode } from 'react';
import { Skeleton } from '@nextui-org/react';

const PostCardSkeleton = (): ReactNode => {
  const classNames: string = clsx(
    'px-4 py-2 min-w-[328px] w-full max-w-screen-xl flex flex-col gap-2',
    'md:px-6 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800'
  );

  return (
    <div className={classNames}>
      <Skeleton className='w-[50%] h-6 rounded-lg bg-zinc-600' />
      <div className='flex flex-col gap-2'>
        <Skeleton className='w-[90%] h-4 rounded-lg bg-zinc-600' />
        <Skeleton className='w-[100%] h-4 rounded-lg bg-zinc-600' />
        <Skeleton className='w-[20%] h-4 rounded-lg bg-zinc-600' />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
