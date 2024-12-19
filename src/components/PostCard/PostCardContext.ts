import { type Context, createContext } from 'react';

import { type PostWithUserAndCommentsCountAndReactionCounts } from '@/lib/types';

type Value = {
  post: PostWithUserAndCommentsCountAndReactionCounts;
  onCommentListToggle: () => void;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
