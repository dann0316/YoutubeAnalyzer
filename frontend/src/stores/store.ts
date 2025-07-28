import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { storeType, UserStoreType } from '../types/youtube.type'

export const useStore = create<storeType>((set) => ({
    videos: [],
    nextPageToken: null,
    setVideos: (videos) => set({ videos }),
    setNextPageToken: (token) => set({ nextPageToken: token }),
    keyword: "",
    setKeyword: (value) =>
        set((state) => ({
            keyword: typeof value === 'function'
                ? value(state.keyword)
                : value
        })),
}));

export const useUserStore = create<UserStoreType>()(
    persist(
        (set) => ({
            uid: "",
            email: "",
            nickname: "",
            point: 0,
            role: "",
            setUser: (user) => set(user),
            setPoint: (value) => set({ point: value }),
            clearUser: () => set({
                uid: "",
                email: "",
                nickname: "",
                point: 0,
                role: "",
            })
        }),
        {
            name: "user"
        }
    )
)

// set은 Zustand가 내부적으로 주입하는 함수 (상태 변경함수)

// const fn = (set) => ({
//   count: 0,
//   increase: () => set((state) => ({ count: state.count + 1 })),
// });
// const useStore = create(fn);

// 헤더 이름 "Token"을 대문자로 쓴 것이 문제의 핵심입니다. TypeScript의 req.headers['token']는 자동으로 소문자 키로 정규화되기 때문에 "Token" → "token"으로 바꿔야 합니다.

// ✅ 요약: req.headers의 특징
// Node.js/Express의 req.headers는 모든 키를 소문자로 처리합니다.

// 즉, req.headers["Token"]은 undefined가 됩니다.

// 반면 req.headers["token"]은 올바르게 값을 가져옵니다.

// 🧠 보너스 정보: Authorization 헤더를 쓰는 게 더 일반적이에요
// 일반적으로 "Token" 대신 "Authorization: Bearer ${token}" 방식이 더 표준화되어 있고 보안 상도 더 낫습니다.

// 예시:
// 🔐 클라이언트
// headers: {
//     'Authorization': `Bearer ${token}`,
//     "Content-Type": "application/json"
// }
// 🔐 서버
// const authHeader = req.headers['authorization'];