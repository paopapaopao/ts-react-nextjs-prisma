'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '../enums';
// import { type ReactionSchema } from '../types';

// TODO
const useMutateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // TODO
    mutationFn: async (payload: unknown) => {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.COMMENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.REPLIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.POST] });
    },
  });
};

export default useMutateReaction;
