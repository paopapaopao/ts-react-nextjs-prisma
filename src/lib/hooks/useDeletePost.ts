import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await response.json();

      return data.data.post;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export default useDeletePost;
