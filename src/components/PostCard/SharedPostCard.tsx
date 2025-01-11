'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { type Post, type User } from '@prisma/client';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { getName } from '@/lib/utils';

type Props = { post: (Post & { user: User }) | null | undefined };

const SharedPostCard = ({ post }: Props): ReactNode => {
  const userClassNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  const viewClassNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  const postCardClassNames: string = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white'
  );

  return (
    <div className={postCardClassNames}>
      <div className={userClassNames}>
        <Image
          src={post?.user?.image || defaultProfilePhoto}
          alt='Profile photo'
          width={48}
          height={48}
          className='rounded-full'
        />
        <span>{getName(post?.user)}</span>
      </div>
      <div className={viewClassNames}>
        <Link href={`/posts/${post?.id}`}>
          <h4 className='text-lg font-bold hover:text-green-600'>
            {post?.title}
          </h4>
        </Link>
        <p className='indent-4 text-base'>{post?.body}</p>
      </div>
    </div>
  );
};

export default SharedPostCard;
