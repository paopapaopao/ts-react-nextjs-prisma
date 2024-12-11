'use client';

import { type ReactNode, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { type CommentWithUser } from '@/lib/types';
import { CommentForm } from '../CommentForm';
import CommentCardActions from './CommentCardActions';
import CommentCardContext from './CommentCardContext';
import CommentCardUser from './CommentCardUser';
import CommentCardView from './CommentCardView';

interface Props {
  comment: CommentWithUser;
}

const CommentCard = ({ comment }: Props): ReactNode => {
  const { user } = useUser();

  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');

  const handleModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  const handleSuccess = (): void => {
    setMode('VIEW');
  };

  const isSignedInUserComment = comment?.clerkUserId === user?.id;

  return (
    <CommentCardContext.Provider
      value={{
        comment,
        onModeToggle: handleModeToggle,
        onSuccess: handleSuccess,
      }}
    >
      <div className='flex-auto flex gap-2'>
        <CommentCardUser>
          {mode === 'VIEW' ? (
            <CommentCardView />
          ) : (
            <CommentForm
              comment={comment}
              className='flex-auto'
            />
          )}
        </CommentCardUser>
        {isSignedInUserComment && <CommentCardActions />}
      </div>
    </CommentCardContext.Provider>
  );
};

export default CommentCard;
