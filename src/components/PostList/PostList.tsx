'use client';

import clsx from 'clsx';
import { type ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

import { type PostWithUserAndCommentsCountAndReactionCounts } from '@/lib/types';

import { PostCard } from '../PostCard';
import { PostCardSkeleton } from '../PostCardSkeleton';

const PostList = (): ReactNode => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const query: string | null = searchParams.get('query');

  // TODO
  const getPosts = async ({ pageParam }: { pageParam: number }) => {
    const homeURL = `/api/posts?cursor=${pageParam}`;
    let searchURL = `/api/search?cursor=${pageParam}`;

    if (query) {
      searchURL += `&query=${query}`;
    }

    const url = query ? searchURL : homeURL;

    const response = await fetch(url);
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
    queryFn: getPosts,
    queryKey: ['posts', query],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

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
      {Array.from({ length: 8 }).map((_, index) => (
        <li
          key={index}
          className='self-stretch'
        >
          <PostCardSkeleton className='mx-auto min-w-[344px] max-w-screen-xl' />
        </li>
      ))}
    </ul>
  ) : status === 'error' ? (
    <div>{error.message}</div>
  ) : (
    <>
      <ul className={classNames}>
        {data.pages.map((page, index) => (
          <li
            key={index}
            className='self-stretch'
          >
            <ul className={classNames}>
              {page.data.posts.map(
                (post: PostWithUserAndCommentsCountAndReactionCounts) => (
                  <li
                    key={post?.id}
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
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div
          ref={ref}
          className='self-stretch'
        >
          {isFetchingNextPage && (
            <PostCardSkeleton className='mx-auto min-w-[344px] max-w-screen-xl' />
          )}
        </div>
      )}
      {!hasNextPage && <p>All posts loaded.</p>}
    </>
  );
};

export default PostList;
