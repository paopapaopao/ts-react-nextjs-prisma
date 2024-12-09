import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type CommentSchema } from '../types';

// TODO
const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CommentSchema) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'post'] });
    },
  });
};

export default useCreateComment;
