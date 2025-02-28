'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode } from 'react';

import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { getName } from '@/lib/utilities';

import useCommentCard from './useCommentCard';

type Props = { children: ReactNode };

const User = ({ children }: Props): ReactNode => {
  const { comment } = useCommentCard();

  const classNames = clsx('flex items-start gap-2', 'md:gap-3', 'xl:gap-4');

  const contentClassNames = clsx(
    'p-2 flex flex-col items-start gap-2',
    'rounded-lg bg-zinc-700'
  );

  return (
    <div className={classNames}>
      <Image
        src={comment?.user?.image || defaultProfilePhoto}
        alt='Profile photo'
        width={40}
        height={40}
        className='rounded-full'
      />
      <div className={contentClassNames}>
        <span className='text-sm font-bold'>{getName(comment?.user)}</span>
        {children}
      </div>
    </div>
  );
};

export default User;
