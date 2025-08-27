import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserStoreType, AppStateType } from "../types/youtube.type";
import { updateUserPoint } from "@/utils/firestoreUser";

export const useAppStore = create<AppStateType>((set, get) => ({
    // Youtube video state
    videos: [],
    nextPageToken: null,
    isLoading: false,
    error: null,
    setVideos: (videos) => set({ videos }),
    fetchVideos: async (isNextPage = false) => {
        if (!isNextPage) { set({ isLoading: true }); }
        try {
            const { keyword, nextPageToken, videos } = get();

            const url = `http://localhost:3000/api/videos?keyword=${keyword}${nextPageToken && isNextPage ? `&pageToken=${nextPageToken}` : ""
                }`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                set({
                    videos: isNextPage ? [...videos, ...data.videos] : data.videos,
                    nextPageToken: data.nextPageToken || null,
                    error: null,
                });
            } else {
                set({ error: data.error });
            }
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                set({ error: err });
            }
        } finally { set({ isLoading: false }); }
    },

    // Keyword & Autocomplete state
    keyword: "",
    suggestions: [],
    selectedIndex: -1,
    setKeyword: (value) =>
        set((state) => ({
            keyword: typeof value === "function" ? value(state.keyword) : value,
        })),
    setSuggestions: (suggestions) => set({ suggestions }),
    setSelectedIndex: (index) => set({ selectedIndex: index }),
    fetchSuggestions: async (input: string) => {
        get().setKeyword(input);
        get().setSelectedIndex(-1);

        if (!input.trim()) {
            get().setSuggestions([]);
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:3000/api/autocomplete?keyword=${input}`
            );
            const data = await response.json();
            get().setSuggestions(response.ok ? data.suggestions || [] : []);
        } catch (err) {
            console.error(err);
            get().setSuggestions([]);
        }
    },
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { suggestions, selectedIndex, fetchVideos, setKeyword, setSuggestions } = get();
        if (suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            set((state) => ({
                selectedIndex:
                    state.selectedIndex < suggestions.length - 1
                        ? state.selectedIndex + 1
                        : state.selectedIndex,
            }));
        } else if (e.key === "ArrowUp") {
            set((state) => ({
                selectedIndex:
                    state.selectedIndex > 0
                        ? state.selectedIndex - 1
                        : state.selectedIndex,
            }));
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0) {
                setKeyword(suggestions[selectedIndex]);
                setSuggestions([]);
            }
            fetchVideos();
        }
    },

    // Login UI state
    loginModal: false,
    setLoginModal: (isOpen) => set({ loginModal: isOpen }),
}));

// User store (기존 코드 유지)
export const useUserStore = create<UserStoreType>()(
    persist(
        (set) => ({
            uid: "",
            token: "",
            email: "",
            nickname: "",
            point: 0,
            role: "",
            setUser: (user) => set(user),
            setPoint: (value) =>
                set((state) => {
                    if (state.uid) updateUserPoint(state.uid, value);
                    return { ...state, point: value };
                }),
            clearUser: () =>
                set({
                    uid: "",
                    token: "",
                    email: "",
                    nickname: "",
                    point: 0,
                    role: "",
                }),
        }),
        {
            name: "user",
            partialize: (state) => ({
                uid: state.uid,
                email: state.email,
                role: state.role,
                nickname: state.nickname,
                point: state.point,
                token: state.token,
            }),
        }
    )
);

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