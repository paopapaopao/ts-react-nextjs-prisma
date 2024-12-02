'use client';

import clsx from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';
import { CommentWithUser } from '@/lib/types';
import { CommentCard } from '../CommentCard';
import usePostCard from '../PostCard/usePostCard';

const CommentList = (): ReactNode => {
  const { post } = usePostCard();
  const [comments, setComments] = useState<CommentWithUser[]>([]);

  useEffect(() => {
    const getComments = async () => {
      const response: Response = await fetch(`/api/posts/${post?.id}/comments`);
      const data = await response.json();

      setComments(data.data.comments);
    };

    getComments();
  }, [post?.id]);

  const classNames: string = clsx('flex flex-col gap-2');

  return (
    <ul className={classNames}>
      {comments.map((comment: CommentWithUser) => (
        <li key={comment?.id}>
          <CommentCard comment={comment} />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
