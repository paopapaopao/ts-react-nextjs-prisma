'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import { type Comment, type Post } from '@prisma/client';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { type PostWithComments } from '@/lib/types';

interface Props {
  post: Post | PostWithComments | null;
}

const PostCard = ({ post }: Props): ReactNode => {
  const [isCommentsShown, setIsCommentsShown] = useState<boolean>(false);

  const handleClick = (): void => {
    setIsCommentsShown((isCommentsShown) => !isCommentsShown);
  };

  const hasComments: boolean | undefined = post?.comments.length > 0;
  const commentsCount: number | undefined = post?.comments.length;

  const classNames: string = clsx(
    'px-4 py-2 min-w-[344px] w-full max-w-screen-xl flex flex-col gap-2',
    'md:px-6 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white group'
  );

  return (
    <div className={classNames}>
      <Link href={`/posts/${post?.id}`}>
        <h4 className='text-lg font-bold group-hover:text-green-600'>
          {post?.title}
        </h4>
      </Link>
      <p className='text-base'>{post?.body}</p>
      {hasComments && (
        <span
          onClick={handleClick}
          className='self-end text-sm cursor-pointer'
        >{`${commentsCount} comments`}</span>
      )}
      {isCommentsShown && (
        <ul className='flex flex-col gap-2 transition-all duration-500 ease-in-out'>
          {post?.comments.map((comment: Comment) => (
            <li key={comment.id}>
              <div className='flex gap-2'>
                <Image
                  src={defaultProfilePhoto}
                  width={48}
                  height={48}
                  alt='Default profile photo'
                  className='rounded-full'
                />
                <p className='text-sm'>{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostCard;
