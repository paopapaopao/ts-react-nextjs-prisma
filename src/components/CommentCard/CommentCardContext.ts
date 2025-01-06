import { type Context, createContext } from 'react';

import { type CommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction } from '@/lib/types';

type Value = {
  comment: CommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction;
  onModeToggle: () => void;
  onReplyFormToggle: () => void;
  onReplyListToggle: () => void;
  onSuccess: () => void;
};

const CommentCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default CommentCardContext;
