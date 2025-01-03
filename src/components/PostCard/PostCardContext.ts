import { type Context, createContext } from 'react';

import { type PostWithUserAndCommentsCountAndReactionsCounts } from '@/lib/types';

type Value = {
  post: PostWithUserAndCommentsCountAndReactionsCounts;
  onCommentListToggle: () => void;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const PostCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default PostCardContext;
