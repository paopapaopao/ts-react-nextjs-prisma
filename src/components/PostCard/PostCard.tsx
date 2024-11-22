import clsx from 'clsx';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { type Post } from '@prisma/client';

interface Props {
  isLink?: boolean;
  post: Post | null;
}

const PostCard = ({ isLink = false, post }: Props): ReactNode => {
  const classNames: string = clsx(
    'px-4 py-2 min-w-[344px] w-full max-w-screen-xl flex flex-col gap-2',
    'md:px-6 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white group'
  );

  return isLink ? (
    <Link
      href={`/posts/${post?.id}`}
      className={classNames}
    >
      <h4 className='text-lg font-bold group-hover:text-green-600'>
        {post?.title}
      </h4>
      <p className='text-base'>{post?.body}</p>
    </Link>
  ) : (
    <div className={classNames}>
      <h4 className='text-lg font-bold'>{post?.title}</h4>
      <p className='text-base'>{post?.body}</p>
    </div>
  );
};

export default PostCard;
