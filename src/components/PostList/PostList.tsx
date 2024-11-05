'use client';

import { type ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { type Post } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PostCard } from '../PostCard';
import { PostCardSkeleton } from '../PostCardSkeleton';

const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
  const response = await fetch(`/api/posts?cursor=${pageParam}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const PostList = (): ReactNode => {
  const {
    data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return status === 'pending' ? (
    <ul className='p-8 flex flex-col items-center gap-4'>
      {Array.from({ length: 10 }).map((_, index) => (
        <li key={index}>
          <PostCardSkeleton />
        </li>
      ))}
    </ul>
  ) : status === 'error' ? (
    <div>{error.message}</div>
  ) : (
    <>
      <ul className='p-8 flex flex-col items-center gap-4'>
        {data.pages.map((page, index) => (
          <li key={index}>
            <ul className='flex flex-col items-center gap-4'>
              {page.data.map((post: Post) => (
                <li key={post.id}>
                  <PostCard
                    post={post}
                    isLink
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div ref={ref}>{isFetchingNextPage && <PostCardSkeleton />}</div>
      {!hasNextPage && <div>All posts loaded.</div>}
    </>
  );
};

export default PostList;
