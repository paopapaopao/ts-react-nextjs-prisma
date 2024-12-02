'use client';

import { type ReactNode, useState } from 'react';
import { type CommentWithUser } from '@/lib/types';
import { CommentForm } from '../CommentForm';
import CommentCardActions from './CommentCardActions';
import CommentCardContext from './CommentCardContext';
import CommentCardUser from './CommentCardUser';

interface Props {
  comment: CommentWithUser;
}

const CommentCard = ({ comment }: Props): ReactNode => {
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');

  const handleModeToggle = (): void => {
    setMode((mode: 'VIEW' | 'EDIT') => (mode === 'VIEW' ? 'EDIT' : 'VIEW'));
  };

  return (
    <CommentCardContext.Provider value={{ comment }}>
      <div className='flex-auto flex gap-2'>
        <CommentCardUser>
          {mode === 'VIEW' ? (
            <p className='flex-auto'>{comment?.body}</p>
          ) : (
            <CommentForm
              comment={comment}
              className='flex-auto'
            />
          )}
        </CommentCardUser>
        <CommentCardActions onToggle={handleModeToggle} />
      </div>
    </CommentCardContext.Provider>
  );
};

export default CommentCard;
