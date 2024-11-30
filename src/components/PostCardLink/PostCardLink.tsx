import clsx from 'clsx';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { type Post } from '@prisma/client';

interface Props {
  className?: string;
  post: Post | null;
}

const PostCardLink = ({ className = '', post }: Props): ReactNode => {
  const classNames: string = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white group',
    className
  );

  return (
    <Link
      href={`/posts/${post?.id}`}
      className={classNames}
    >
      <h4 className='text-lg font-bold group-hover:text-green-600'>
        {post?.title}
      </h4>
      <p className='text-base'>{post?.body}</p>
    </Link>
  );
};

export default PostCardLink;
