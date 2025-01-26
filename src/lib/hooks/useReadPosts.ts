'use client';

import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { type PostWithRelationsAndRelationCountsAndUserReaction } from '../types';

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
): UseInfiniteQueryResult<InfiniteData<TPosts, number | null>, Error> => {
  return useInfiniteQuery({
    queryKey: query === null ? [QueryKey.POSTS] : [QueryKey.POSTS, query],
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | null;
    }): Promise<TPosts> => {
      const homeURL: string = `/api/posts?cursor=${pageParam}`;
      let searchURL: string = `/api/search?cursor=${pageParam}`;

      if (query) {
        searchURL += `&query=${query}`;
      }

      const response: Response = await fetch(query ? searchURL : homeURL);

      if (!response.ok) throw new Error('Network response was not ok');

      return await response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: TPosts): number | null => {
      return lastPage.data.nextCursor;
    },
  });
};

export default useReadPosts;
