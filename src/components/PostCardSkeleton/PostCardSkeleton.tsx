import clsx from 'clsx';
import { type ReactNode } from 'react';
import { Skeleton } from '@nextui-org/react';
import styles from './PostCardSkeleton.module.css';

const PostCardSkeleton = (): ReactNode => {
  const classNames: string = clsx(
    styles['post-card-skeleton'],
    `px-8 py-4 flex flex-col gap-4 bg-zinc-800 rounded-lg shadow-lg`
  );

  return (
    <div className={classNames}>
      <Skeleton className='w-[50%] h-6 bg-zinc-600 rounded-lg' />
      <div className='flex flex-col gap-2'>
        <Skeleton className='w-[90%] h-4 bg-zinc-600 rounded-lg' />
        <Skeleton className='w-[100%] h-4 bg-zinc-600 rounded-lg' />
        <Skeleton className='w-[20%] h-4 bg-zinc-600 rounded-lg' />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
