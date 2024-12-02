'use client';

import clsx from 'clsx';
import { type ReactNode, useEffect, useState } from 'react';
import { type Comment } from '@prisma/client';
import { CommentCard } from '../CommentCard';
import usePostCard from '../PostCard/usePostCard';

const CommentList = (): ReactNode => {
  const { post } = usePostCard();
  const [comments, setComments] = useState<Comment[]>([]);

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
      {comments.map((comment: Comment) => (
        <li key={comment.id}>
          <CommentCard comment={comment} />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
