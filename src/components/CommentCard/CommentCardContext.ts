import { type Context, createContext } from 'react';
import { type CommentWithUser } from '@/lib/types';

type Value = {
  comment: CommentWithUser;
  onModeToggle: () => void;
  onSuccess: () => void;
};

const CommentCardContext: Context<Value | null> = createContext<Value | null>(
  null
);

export default CommentCardContext;
