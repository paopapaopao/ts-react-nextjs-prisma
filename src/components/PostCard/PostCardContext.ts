import { type Context, createContext } from 'react';

import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

type Value = {
  post: PostWithRelationsAndRelationCountsAndUserReaction;
  onCommentFormToggle: () => void;
  onCommentListToggle: () => void;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
