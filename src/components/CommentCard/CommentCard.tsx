'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { CommentWithUser } from '@/lib/types';
import { CommentForm } from '../CommentForm';

interface Props {
  comment: CommentWithUser;
}

const CommentCard = ({ comment }: Props): ReactNode => {
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');

  const handleModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  const handleDeleteClick = async (): Promise<void> => {
    await fetch(`/api/comments/${comment?.id}`, { method: 'DELETE' });
  };

  const fullName: string = `${comment?.user.firstName} ${comment?.user.lastName}`;

  return (
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
      <button onClick={handleModeToggle}>
        <FaRegEdit
          className='self-center'
          size={16}
        />
      </button>
      <button onClick={handleDeleteClick}>
        <RiDeleteBin6Line
          className='self-center'
          size={16}
        />
      </button>
    </div>
  );
};

export default CommentCard;
