'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { type User as PrismaUser, type Post } from '@prisma/client';
import { useUser } from '@clerk/nextjs';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { getFullName } from '@/lib/utils';

type PostWithUser = Post & { user: PrismaUser };

type Props = {
  className?: string;
  post: PostWithUser;
};

const SharedPostCard = ({ className = '', post }: Props): ReactNode => {
  const { user } = useUser();

  const hasName: boolean =
    post?.user?.firstName !== null && post?.user?.lastName !== null;

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  const postCardClassNames: string = clsx(
    'px-2 py-2 flex flex-col gap-2',
    'md:px-5 md:py-3 md:gap-3',
    'xl:px-8 xl:py-4 xl:gap-4',
    'rounded-lg bg-zinc-800 text-white',
    className
  );

  return (
    <div className={postCardClassNames}>
      <div className={clsx('flex gap-2', 'md:gap-3', 'xl:gap-4')}>
        <Image
          src={post?.user?.image || defaultProfilePhoto}
          alt='Profile photo'
          width={48}
          height={48}
          className='rounded-full'
        />
        <span>{hasName ? getFullName(post?.user) : user?.username}</span>
      </div>
      <div className={classNames}>
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
