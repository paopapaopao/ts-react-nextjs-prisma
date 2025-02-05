'use client';

import clsx from 'clsx';
import { type ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { POSTS_FETCH_COUNT } from '@/lib/constants';
import { useReadPosts } from '@/lib/hooks';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '@/lib/types';

import { PostCard } from '../PostCard';
import { PostCardSkeleton } from '../PostCardSkeleton';

type Props = { query?: string | null };

const PostList = ({ query = null }: Props): ReactNode => {
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

  const classNames: string = clsx(
    'flex flex-col items-center gap-2',
    'md:gap-3',
    'xl:gap-4'
  );

  return status === 'pending' ? (
    <ul className={clsx('self-stretch', classNames)}>
      {Array.from({ length: POSTS_FETCH_COUNT }).map((_, index: number) => (
        <li
          key={`post-skeleton-${index}`}
          className='self-stretch'
        >
          <PostCardSkeleton className='mx-auto min-w-[344px] max-w-screen-xl' />
        </li>
      ))}
    </ul>
  ) : status === 'error' ? (
    <p>{Object.values(error).flat().join('. ').trim()}</p>
  ) : (
    <>
      <ul className={classNames}>
        {data.pages
          .flatMap((page) => page.data?.posts ?? [])
          ?.map((post: PostWithRelationsAndRelationCountsAndUserReaction) => (
            <li
              key={`post-${post?.id}`}
              className='self-stretch'
            >
              <PostCard
                post={post}
                className='min-w-[344px] max-w-screen-xl'
              />
            </li>
          ))}
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
