import { type Context, createContext } from 'react';

import { type PostWithUserAndCommentsCountAndReactionsCountsAndUserReaction } from '@/lib/types';

type Value = {
  post: PostWithUserAndCommentsCountAndReactionsCountsAndUserReaction;
  onCommentListToggle: () => void;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
