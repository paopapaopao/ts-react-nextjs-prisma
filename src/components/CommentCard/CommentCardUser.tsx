'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode } from 'react';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import useCommentCard from './useCommentCard';

interface Props {
  children: ReactNode;
}

const CommentCardUser = ({ children }: Props): ReactNode => {
  const { comment } = useCommentCard();

  const fullName: string = `${comment?.user?.firstName} ${comment?.user?.lastName}`;

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
        <span className='text-sm'>{fullName}</span>
        {children}
      </div>
    </div>
  );
};

export default CommentCardUser;
