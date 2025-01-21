'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '../enums';

const mutationFn = async (id: number | undefined) => {
  const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  const data = await response.json();

  return data;
};

const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.REPLIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useDeleteComment;
