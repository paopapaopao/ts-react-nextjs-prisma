import { type StoreApi, type UseBoundStore, create } from 'zustand';

import { type PostSchema } from '../types';

type PostMutationStore = {
  data: PostSchema | null;
  id: number | undefined;
  setData: (data: PostSchema) => void;
  setId: (id: number | undefined) => void;
};

const usePostMutationStore: UseBoundStore<StoreApi<PostMutationStore>> =
  create<PostMutationStore>((set) => {
    return {
      data: null,
      id: 0,
      setData: (data: PostSchema) => {
        set({ data });
      },
      setId: (id: number | undefined) => {
        set({ id });
      },
    };
  });

export default usePostMutationStore;
