import { create } from 'zustand'
import type { storeType } from '../types/youtube.type'

export const useStore = create<storeType>((set) => ({
    videos: [],
    nextPageToken: null,
    setVideos: (videos) => set({ videos }),
    setNextPageToken: (token) => set({ nextPageToken: token }),
    keyword: "",
    setKeyword(input :string) {
        set((state) => ({keyword: state.keyword = input}));
    }
}))

// set은 Zustand가 내부적으로 주입하는 함수 (상태 변경함수)

// const fn = (set) => ({
//   count: 0,
//   increase: () => set((state) => ({ count: state.count + 1 })),
// });
// const useStore = create(fn);