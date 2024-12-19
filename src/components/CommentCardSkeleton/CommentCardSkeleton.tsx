import clsx from 'clsx';
import { type ReactNode } from 'react';
import { Skeleton } from '@nextui-org/react';

const CommentCardSkeleton = (): ReactNode => {
  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <div className={classNames}>
      <Skeleton className='w-[40px] h-[40px] rounded-full bg-zinc-600' />
      <div className='p-2 flex-auto flex flex-col gap-2 rounded-lg bg-zinc-700'>
        <Skeleton className='w-[20%] h-[20px] rounded-lg bg-zinc-600' />
        <Skeleton className='w-[40%] h-[24px] rounded-lg bg-zinc-600' />
      </div>
    </div>
  );
};

export default CommentCardSkeleton;
