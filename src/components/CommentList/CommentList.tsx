'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CommentWithUser } from '@/lib/types';
import { CommentCard } from '../CommentCard';
import { CommentCardSkeleton } from '../CommentCardSkeleton';
import usePostCard from '../PostCard/usePostCard';

const CommentList = (): ReactNode => {
  const { post } = usePostCard();

  const getComments = async () => {
    const response: Response = await fetch(`/api/posts/${post?.id}/comments`);
    const data = await response.json();

    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['comments', post?.id],
    queryFn: getComments,
  });

  const classNames: string = clsx('flex flex-col gap-2');

  return isLoading ? (
    <CommentCardSkeleton />
  ) : (
    <ul className={classNames}>
      {data?.data?.comments.map((comment: CommentWithUser) => (
        <li key={comment?.id}>
          <CommentCard comment={comment} />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
