import clsx from 'clsx';
import { type ReactNode } from 'react';

import { Skeleton } from '../ui';

type Props = { className?: string };

export const PostCardSkeleton = ({ className = '' }: Props): ReactNode => {
  const classNames = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800',
    className
  );

  return (
    <div className={classNames}>
      <div className={clsx('flex gap-2', 'md:gap-3', 'xl:gap-4')}>
        <Skeleton className='w-[48px] h-[48px] rounded-full bg-zinc-600' />
        <Skeleton className='w-[20%] h-[24px] rounded-lg bg-zinc-600' />
      </div>
      <div className={clsx('flex flex-col gap-2', 'md:gap-3', 'xl:gap-4')}>
        <Skeleton className='w-[60%] h-[28px] rounded-lg bg-zinc-600' />
        <Skeleton className='w-[90%] h-[80px] rounded-lg bg-zinc-600' />
      </div>
      <div
        className={clsx('flex justify-between gap-2', 'md:gap-3', 'xl:gap-4')}
      >
        <div className='flex gap-2'>
          <Skeleton className='w-[64px] h-[20px] rounded-lg bg-zinc-600' />
          <Skeleton className='w-[64px] h-[20px] rounded-lg bg-zinc-600' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='w-[64px] h-[20px] rounded-lg bg-zinc-600' />
          <Skeleton className='w-[64px] h-[20px] rounded-lg bg-zinc-600' />
        </div>
      </div>
    </div>
  );
};
