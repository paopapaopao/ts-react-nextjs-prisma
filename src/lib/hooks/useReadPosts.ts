'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';

const useReadPosts = (query: string | null) => {
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

  return useInfiniteQuery({
    queryFn: getPosts,
    queryKey: [QueryKey.POSTS, query],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });
};

export default useReadPosts;
