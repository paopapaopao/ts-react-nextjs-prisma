import { type Context, createContext } from 'react';

import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

type Value = {
  post: PostWithRelationsAndRelationCountsAndUserReaction;
  postStats: {
    hasComments: boolean;
    hasName: boolean;
    hasReactions: boolean;
    hasShares: boolean;
    hasViews: boolean;
    isASharePost: boolean;
  };
  onCommentFormToggle: () => void;
  onCommentListToggle: () => void;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
