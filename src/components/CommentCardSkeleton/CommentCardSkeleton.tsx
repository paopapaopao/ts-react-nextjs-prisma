import clsx from 'clsx';
import { type ReactNode } from 'react';
import { Skeleton } from '@nextui-org/react';

interface Props {
  className?: string;
}

const CommentCardSkeleton = ({ className = '' }: Props): ReactNode => {
  const classNames: string = clsx('flex gap-2', className);

  return (
    <div className={classNames}>
      <Skeleton className='w-[48px] h-[48px] rounded-full bg-zinc-600' />
      <Skeleton className='w-[80%] h-[36px] rounded-lg bg-zinc-600' />
    </div>
  );
};

export default CommentCardSkeleton;
