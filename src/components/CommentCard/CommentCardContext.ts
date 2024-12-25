import { type Context, createContext } from 'react';

import { type CommentWithUserAndReplyCount } from '@/lib/types';

type Value = {
  comment: CommentWithUserAndReplyCount;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const CommentCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default CommentCardContext;
