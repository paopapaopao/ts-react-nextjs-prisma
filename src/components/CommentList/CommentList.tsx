'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { type Comment } from '@prisma/client';
import { CommentCard } from '../CommentCard';
import usePostCard from '../PostCard/usePostCard';

const CommentList = (): ReactNode => {
  const { post } = usePostCard();

  const classNames: string = clsx('flex flex-col gap-2');

  return (
    <ul className={classNames}>
      {post?.comments.map((comment: Comment) => (
        <li key={comment.id}>
          <CommentCard comment={comment} />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
