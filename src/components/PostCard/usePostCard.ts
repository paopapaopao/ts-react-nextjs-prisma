'use client';

import { useContext } from 'react';
import { type Post, type User } from '@prisma/client';

import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import PostCardContext from './PostCardContext';

type Value = {
  hasComments?: boolean;
  hasReactions?: boolean;
  hasShares?: boolean;
  hasViews?: boolean;
  post:
    | PostWithRelationsAndRelationCountsAndUserReaction
    | (Post & { user: User });
  onCommentFormToggle?: () => void;
  onCommentListToggle?: () => void;
  onModeToggle?: () => void;
  onSuccess?: () => void;
};

const usePostCard = (): Value => {
  const context = useContext(PostCardContext);

  if (context === null) {
    throw new Error('usePostCard must be used within PostCardContext.Provider');
  }

  return context;
};

export default usePostCard;
