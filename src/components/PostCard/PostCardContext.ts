import { type Context, createContext } from 'react';

import { type PostWithUserAndCommentCountAndReactionCounts } from '@/lib/types';

type Value = {
  post: PostWithUserAndCommentCountAndReactionCounts;
  onCommentListToggle: () => void;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
