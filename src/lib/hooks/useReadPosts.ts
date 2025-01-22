'use client';

import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { PostWithRelationsAndRelationCountsAndUserReaction } from '../types';

type TPosts = {
  data: {
    nextCursor: number | null;
    posts: PostWithRelationsAndRelationCountsAndUserReaction[];
  };
  errors: { [key: string]: string[] } | null;
  success: boolean;
};

const useReadPosts = (
  query: string | null
): UseInfiniteQueryResult<InfiniteData<TPosts, unknown>, Error> => {
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
    queryKey: query === null ? [QueryKey.POSTS] : [QueryKey.POSTS, query],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });
};

export default useReadPosts;
