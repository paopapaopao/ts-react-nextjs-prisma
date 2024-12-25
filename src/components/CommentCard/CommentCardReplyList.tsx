'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

import { type CommentWithUserAndReplyCount } from '@/lib/types';

import { CommentCardSkeleton } from '../CommentCardSkeleton';

import CommentCard from './CommentCard';
import useCommentCard from './useCommentCard';

const CommentCardReplyList = (): ReactNode => {
  const { comment } = useCommentCard();

  const getCommentReplies = async () => {
    const response: Response = await fetch(
      `/api/posts/${comment?.postId}/comments/${comment?.id}/replies`
    );

    const data = await response.json();

    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['replies', comment?.postId, comment?.id],
    queryFn: getCommentReplies,
  });

  const classNames: string = clsx(
    'ml-12 flex flex-col gap-2',
    'md:ml-[52px]',
    'xl:ml-14'
  );

  return isLoading ? (
    <ul className={classNames}>
      {Array.from({ length: 2 }).map((_, index) => (
        <li key={index}>
          <CommentCardSkeleton />
        </li>
      ))}
    </ul>
  ) : (
    <ul className={classNames}>
      {data?.data?.comments.map((comment: CommentWithUserAndReplyCount) => (
        <li key={comment?.id}>
          <CommentCard comment={comment} />
        </li>
      ))}
    </ul>
  );
};

export default CommentCardReplyList;
