'use client';

import { useContext } from 'react';

import { type CommentWithUserAndRepliesCount } from '@/lib/types';

import CommentCardContext from './CommentCardContext';

type Value = {
  comment: CommentWithUserAndRepliesCount;
  onModeToggle: () => void;
  onReplyFormToggle: () => void;
  onReplyListToggle: () => void;
  onSuccess: () => void;
};

const useCommentCard = (): Value => {
  // TODO
  const context = useContext(CommentCardContext);

  if (context === null) {
    throw new Error(
      'useCommentCard must be used within CommentCardContext.Provider'
    );
  }

  return context;
};

export default useCommentCard;
