import { useMutation, useQueryClient } from '@tanstack/react-query';

// TODO
const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | undefined) => {
      const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      const data = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'post'] });
    },
  });
};

export default useDeleteComment;
