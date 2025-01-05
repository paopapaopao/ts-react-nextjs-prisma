'use client';

import { type ReactNode } from 'react';

import useCommentCard from './useCommentCard';

const View = (): ReactNode => {
  const { comment } = useCommentCard();

  return <p>{comment?.body}</p>;
};

export default View;
