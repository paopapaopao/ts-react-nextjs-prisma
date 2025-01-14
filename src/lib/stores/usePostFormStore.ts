import { create } from 'zustand';

import { type PostSchema } from '../types';

type PostFormStore = {
  data: PostSchema | null;
  id: number | undefined;
  setData: (data: PostSchema) => void;
  setId: (id: number | undefined) => void;
};

const usePostFormStore = create<PostFormStore>((set) => {
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

export default usePostFormStore;
