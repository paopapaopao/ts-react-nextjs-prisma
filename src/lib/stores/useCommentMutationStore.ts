import { type StoreApi, type UseBoundStore, create } from 'zustand';

import { type CommentSchema } from '../types';

type CommentMutationStore = {
  data: CommentSchema | null;
  id: number | undefined;
  setData: (data: CommentSchema) => void;
  setId: (id: number | undefined) => void;
};

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
