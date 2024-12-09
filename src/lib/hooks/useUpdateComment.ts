import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type CommentSchema } from '../types';

// TODO
const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number | undefined;
      payload: CommentSchema;
    }) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
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

export default useUpdateComment;
