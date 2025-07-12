'use client';

import { type ReactNode } from 'react';

import { useCommentCard } from './useCommentCard';

export const View = (): ReactNode => {
  const { comment } = useCommentCard();

  return <p className='text-comment-card-foreground'>{comment?.body}</p>;
};
