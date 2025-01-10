'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { getFullName } from '@/lib/utils';

import usePostCard from './usePostCard';

const User = (): ReactNode => {
  const {
    post,
    postStats: { hasName },
  } = usePostCard();
  const { user } = useUser();

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <div className={classNames}>
      <Image
        src={post?.user?.image || defaultProfilePhoto}
        alt='Profile photo'
        width={48}
        height={48}
        className='rounded-full'
      />
      <span>{hasName ? getFullName(post?.user) : user?.username}</span>
    </div>
  );
};

export default User;
