'use client';

import clsx from 'clsx';
import {
  type ReactNode,
  startTransition,
  useEffect,
  useOptimistic,
} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { COMMENTS_FETCH_COUNT } from '@/lib/constants';
import { QueryKey } from '@/lib/enums';
import { useSignedInUser } from '@/lib/hooks';
import { useCommentMutationStore } from '@/lib/stores';
import { type CommentWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { CommentCard } from '../CommentCard';
import { CommentCardSkeleton } from '../CommentCardSkeleton';
import usePostCard from '../PostCard/usePostCard';

const mockCommentData = {
  id: 0,
  body: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
  postId: 0,
  parentCommentId: null,
  user: {
    id: 0,
    clerkId: '',
    firstName: '',
    lastName: '',
    username: '',
    image: '',
    updatedAt: new Date(),
  },
  _count: {
    replies: 0,
    reactions: 0,
  },
  userReaction: null,
};

const CommentList = (): ReactNode => {
  const { post } = usePostCard();

  // TODO
  const getComments = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `/api/posts/${post?.id}/comments?cursor=${pageParam}`
    );

    if (!response.ok) throw new Error('Network response was not ok');

    return response.json();
  };

  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useInfiniteQuery({
    queryFn: getComments,
    queryKey: [QueryKey.COMMENTS, post?.id],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

  const { signedInUser } = useSignedInUser();
  const commentMutationData = useCommentMutationStore((state) => state.data);
  const [optimisticData, setOptimisticData] = useOptimistic(
    data?.pages.flatMap((page) => page.data.comments)
  );

  useEffect((): void => {
    startTransition((): void => {
      setOptimisticData((optimisticData) => {
        return [
          ...(optimisticData || []),
          {
            ...mockCommentData,
            user: { ...signedInUser },
            ...commentMutationData,
          },
        ];
      });
    });
  }, [signedInUser, commentMutationData, setOptimisticData]);

  const handleClick = (): void => {
    fetchNextPage();
  };

  const classNames: string = clsx(
    'flex flex-col gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return status === 'pending' ? (
    <ul className={classNames}>
      {Array.from({ length: COMMENTS_FETCH_COUNT }).map(
        (_: unknown, index: number) => (
          <li key={`comment-skeleton-${index}`}>
            <CommentCardSkeleton />
          </li>
        )
      )}
    </ul>
  ) : status === 'error' ? (
    <p>{error.message}</p>
  ) : (
    <div className={classNames}>
      <ul className={classNames}>
        {optimisticData?.map(
          (comment: CommentWithRelationsAndRelationCountsAndUserReaction) => (
            <li key={`comment-${comment?.id}`}>
              <CommentCard comment={comment} />
            </li>
          )
        )}
      </ul>
      {isFetchingNextPage && <CommentCardSkeleton />}
      {hasNextPage ? (
        <p
          onClick={handleClick}
          className='cursor-pointer'
        >
          View more comments
        </p>
      ) : (
        <p>All comments loaded.</p>
      )}
    </div>
  );
};

export default CommentList;
