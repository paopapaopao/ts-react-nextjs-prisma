'use client';

import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { type CommentWithUser } from '@/lib/types';
import CommentCardActions from './CommentCardActions';
import CommentCardContext from './CommentCardContext';
import CommentCardForm from './CommentCardForm';
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

  const isSignedInUserComment: boolean = comment?.clerkUserId === user?.id;

  const classNames: string = clsx('flex gap-2', 'md:gap-3', 'xl:gap-4');

  return (
    <CommentCardContext.Provider
      value={{
        comment,
        onModeToggle: handleModeToggle,
        onSuccess: handleSuccess,
      }}
    >
      <div className={classNames}>
        <CommentCardUser>
          {mode === 'VIEW' ? <CommentCardView /> : <CommentCardForm />}
        </CommentCardUser>
        {isSignedInUserComment && <CommentCardActions />}
      </div>
    </CommentCardContext.Provider>
  );
};

export default CommentCard;
