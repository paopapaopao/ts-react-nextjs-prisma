'use client';

import clsx from 'clsx';
import { type ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import {
  type ReactNode,
  startTransition,
  useEffect,
  useOptimistic,
} from 'react';
import { useInView } from 'react-intersection-observer';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { useReadPosts, useSignedInUser } from '@/lib/hooks';
import { usePostMutationStore } from '@/lib/stores';
import {
  type PostMutationStore,
  type PostSchema,
  type PostWithRelationsAndRelationCountsAndUserReaction,
} from '@/lib/types';

import { PostCard } from '../PostCard';
import { PostCardSkeleton } from '../PostCardSkeleton';

const mockPostData = {
  id: 0,
  title: '',
  body: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
  originalPostId: null,
  hasSharedPost: false,
  user: null,
  originalPost: null,
  _count: {
    shares: 0,
    comments: 0,
    reactions: 0,
    views: 0,
  },
  userReaction: null,
};

const PostList = (): ReactNode => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const query: string | null = searchParams.get('query');

  const {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useReadPosts(query);

  const { inView, ref } = useInView();

  useEffect((): void => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const { signedInUser } = useSignedInUser();

  const postMutationData: PostSchema | null = usePostMutationStore(
    (state: PostMutationStore): PostSchema | null => state.data
  );

  const postMutationId: number | undefined = usePostMutationStore(
    (state: PostMutationStore): number | undefined => state.id
  );

  const [optimisticData, setOptimisticData] = useOptimistic(
    data?.pages.flatMap((page) => page.data.posts)
  );

  useEffect((): void => {
    startTransition((): void => {
      setOptimisticData((optimisticData) => {
        return [
          {
            ...mockPostData,
            user: { ...signedInUser },
            ...postMutationData,
          },
          ...(optimisticData || []),
        ];
      });
    });
  }, [signedInUser, postMutationData, setOptimisticData]);

  useEffect((): void => {
    startTransition((): void => {
      setOptimisticData((optimisticData) => {
        return optimisticData?.filter((post) => post.id !== postMutationId);
      });
    });
  }, [postMutationId, setOptimisticData]);

  const classNames: string = clsx(
    'flex flex-col items-center gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return status === 'pending' ? (
    <ul className={clsx('self-stretch', classNames)}>
      {Array.from({ length: POSTS_FETCH_COUNT }).map(
        (_: unknown, index: number) => (
          <li
            key={`post-skeleton-${index}`}
            className='self-stretch'
          >
            <PostCardSkeleton className='mx-auto min-w-[344px] max-w-screen-xl' />
          </li>
        )
      )}
    </ul>
  ) : status === 'error' ? (
    <p>{error.message}</p>
  ) : (
    <>
      <ul className={classNames}>
        {optimisticData?.map(
          (post: PostWithRelationsAndRelationCountsAndUserReaction) => (
            <li
              key={`post-${post?.id}`}
              className='self-stretch'
            >
              <PostCard
                post={post}
                className='min-w-[344px] max-w-screen-xl'
              />
            </li>
          )
        )}
      </ul>
      {hasNextPage ? (
        <div
          ref={ref}
          className='self-stretch'
        >
          {isFetchingNextPage && (
            <PostCardSkeleton className='mx-auto min-w-[344px] max-w-screen-xl' />
          )}
        </div>
      ) : (
        <p>All posts loaded.</p>
      )}
    </>
  );
};

export default PostList;
