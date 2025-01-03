'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { getFullName } from '@/lib/utils';

import useCommentCard from './useCommentCard';

type Props = { children: ReactNode };

const CommentCardUser = ({ children }: Props): ReactNode => {
  const { user } = useUser();
  const { comment } = useCommentCard();

  const hasName: boolean =
    comment?.user?.firstName !== null && comment?.user?.lastName !== null;

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <div className={classNames}>
      <Image
        src={comment?.user?.image || defaultProfilePhoto}
        alt='Profile photo'
        width={40}
        height={40}
        className='self-start rounded-full'
      />
      <div className='p-2 flex flex-col gap-2 rounded-lg bg-zinc-700'>
        <span className='text-sm'>
          {hasName ? getFullName(comment?.user) : user?.username}
        </span>
        {children}
      </div>
    </div>
  );
};

export default CommentCardUser;
