import { type StoreApi, type UseBoundStore, create } from 'zustand';

import { type CommentMutationStore, type CommentSchema } from '../types';

const useCommentMutationStore: UseBoundStore<StoreApi<CommentMutationStore>> =
  create<CommentMutationStore>((set) => {
    return {
      data: null,
      id: 0,
      setData: (data: CommentSchema) => {
        set({ data });
      },
      setId: (id: number | undefined) => {
        set({ id });
      },
    };
  });

export default useCommentMutationStore;
