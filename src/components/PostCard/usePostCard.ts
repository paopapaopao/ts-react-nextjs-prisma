'use client';

import { useContext } from 'react';

import { type PostWithUserAndCommentsCountAndReactionsCounts } from '@/lib/types';

import PostCardContext from './PostCardContext';

type Value = {
  post: PostWithUserAndCommentsCountAndReactionsCounts;
  onCommentListToggle: () => void;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const usePostCard = (): Value => {
  // TODO
  const context = useContext(PostCardContext);

  if (context === null) {
    throw new Error('usePostCard must be used within PostCardContext.Provider');
  }

  return context;
};

export default usePostCard;
