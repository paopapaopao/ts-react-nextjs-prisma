'use client';

import { useContext } from 'react';
import { type CommentWithUser } from '@/lib/types';
import CommentCardContext from './CommentCardContext';

type Value = { comment: CommentWithUser; onSuccess: () => void };

// TODO
const useCommentCard = (): Value => {
  const context = useContext(CommentCardContext);

  if (context === null) {
    throw new Error(
      'useCommentCard must be used within CommentCardContext.Provider'
    );
  }

  return context;
};

export default useCommentCard;
