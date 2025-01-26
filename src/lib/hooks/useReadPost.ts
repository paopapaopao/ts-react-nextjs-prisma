'use client';

import { type Post } from '@prisma/client';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';

type TPost = {
  data: { post: Post | null } | null;
  errors: { [key: string]: string[] } | unknown | null;
  success: boolean;
};

const useReadPost = (id: string): UseQueryResult<TPost> => {
  return useQuery({
    queryKey: [QueryKey.POSTS, Number(id)],
    queryFn: async (): Promise<TPost> => {
      const response: Response = await fetch(`/api/posts/${id}`);

      return await response.json();
    },
  });
};

export default useReadPost;
