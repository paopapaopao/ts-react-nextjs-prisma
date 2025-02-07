'use client';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';
import { TPostQuery } from '../types';

const useReadPost = (id: string): UseQueryResult<TPostQuery> => {
  return useQuery({
    queryKey: [QueryKey.POSTS, Number(id)],
    queryFn: async (): Promise<TPostQuery> => {
      const response: Response = await fetch(`/api/posts/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw result.errors;
      }

      // TODO
      return result;
    },
  });
};

export default useReadPost;
