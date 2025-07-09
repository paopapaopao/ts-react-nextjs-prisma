'use client';

import { type ReactNode } from 'react';

import { useCommentCard } from './useCommentCard';

export const View = (): ReactNode => {
  const { comment } = useCommentCard();

  return <p>{comment?.body}</p>;
};
