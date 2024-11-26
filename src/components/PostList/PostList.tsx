'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { type Post } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PostCardLink } from '../PostCardLink';
import { PostCardSkeleton } from '../PostCardSkeleton';

const PostList = (): ReactNode => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

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
    queryKey: ['posts', query],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
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
      {Array.from({ length: 10 }).map((_, index) => (
        <li
          key={index}
          className='self-stretch'
        >
          <PostCardSkeleton className='mx-auto' />
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
              {page.data.posts.map((post: Post) => (
                <li
                  key={post.id}
                  className='self-stretch'
                >
                  <PostCardLink post={post} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {!hasNextPage && <div>All posts loaded.</div>}
      <div
        ref={ref}
        className='self-stretch'
      >
        {isFetchingNextPage && <PostCardSkeleton className='mx-auto' />}
      </div>
    </>
  );
};

export default PostList;
