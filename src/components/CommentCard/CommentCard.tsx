'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { type Comment } from '@prisma/client';
import defaultProfilePhoto from '@/assets/images/default-profile-photo.jpg';
import { CommentForm } from '../CommentForm';

interface Props {
  comment: Comment | null;
}

const CommentCard = ({ comment }: Props): ReactNode => {
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');

  const handleModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  const handleDeleteClick = async (): Promise<void> => {
    await fetch(`/api/comments/${comment?.id}`, { method: 'DELETE' });
  };

  return (
    <div className='flex gap-2'>
      <Image
        src={defaultProfilePhoto}
        width={48}
        height={48}
        alt='Default profile photo'
        className='rounded-full'
      />
      {mode === 'VIEW' ? (
        <p className='flex-auto text-sm'>{comment?.body}</p>
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
