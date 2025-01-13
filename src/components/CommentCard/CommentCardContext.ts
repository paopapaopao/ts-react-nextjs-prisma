import { type Context, createContext } from 'react';

import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

type Value = {
  comment: CommentWithRelationsAndRelationCountsAndUserReaction;
  hasReactions: boolean;
  hasReplies: boolean;
  type: 'Comment' | 'Reply';
  onModeToggle: () => void;
  onReplyFormToggle: () => void;
  onReplyListToggle: () => void;
  onSuccess: () => void;
};

const CommentCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default CommentCardContext;
