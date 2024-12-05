'use client';

import { useContext } from 'react';
import { type PostWithUserAndCommentsCountAndReactionCounts } from '@/lib/types';
import PostCardContext from './PostCardContext';

type Value = { post: PostWithUserAndCommentsCountAndReactionCounts | null };

// TODO
const usePostCard = (): Value => {
  const context = useContext(PostCardContext);

  if (context === null) {
    throw new Error('usePostCard must be used within PostCardContext.Provider');
  }

  return context;
};

export default usePostCard;
