import { type Context, createContext } from 'react';
import { type Post, type User } from '@prisma/client';

import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

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

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
