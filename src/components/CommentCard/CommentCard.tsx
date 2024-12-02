'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { type CommentWithUser } from '@/lib/types';
import { CommentForm } from '../CommentForm';
import CommentCardActions from './CommentCardActions';
import CommentCardContext from './CommentCardContext';

interface Props {
  comment: CommentWithUser;
}

const CommentCard = ({ comment }: Props): ReactNode => {
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');

  const handleModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  const fullName: string = `${comment?.user.firstName} ${comment?.user.lastName}`;

  return (
    <CommentCardContext.Provider value={{ comment }}>
      <div className='flex gap-2'>
        <Image
          src={comment?.user.image || defaultProfilePhoto}
          width={48}
          height={48}
          alt='Default profile photo'
          className='rounded-full'
        />
        {mode === 'VIEW' ? (
          <div className='flex-auto flex flex-col gap-2'>
            <span className='text-sm'>{fullName}</span>
            <p className='flex-auto'>{comment?.body}</p>
          </div>
        ) : (
          <CommentForm
            comment={comment}
            className='flex-auto'
          />
        )}
        <CommentCardActions onToggle={handleModeToggle} />
      </div>
    </CommentCardContext.Provider>
  );
};

export default CommentCard;
