'use client';

import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '../enums';

const useReadPost = (id: string) => {
  const getPost = async () => {
    const response: Response = await fetch(`/api/posts/${id}`);
    const data = await response.json();

    return data;
  };

  return useQuery({
    queryKey: [QueryKey.POSTS, Number(id)],
    queryFn: getPost,
  });
};

export default useReadPost;
