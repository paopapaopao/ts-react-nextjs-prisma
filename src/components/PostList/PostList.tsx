'use client';

import { type ReactNode, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { type Post } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PostCard } from '../PostCard';

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
    <div>Loading...</div>
  ) : status === 'error' ? (
    <div>{error.message}</div>
  ) : (
    <div className='flex flex-col gap-2'>
      {data.pages.map((page) => {
        return (
          <div
            key={page.currentPage}
            className='flex flex-col gap-2'
          >
            {page.data.map((post: Post) => {
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  isLink
                />
              );
            })}
          </div>
        );
      })}
      <div ref={ref}>{isFetchingNextPage && 'Loading...'}</div>
      {!hasNextPage && <div>All posts loaded.</div>}
    </div>
  );
};

export default PostList;
