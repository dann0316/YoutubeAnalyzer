import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VideosType, UserStoreType } from "../types/youtube.type";
import { updateUserPoint } from "@/utils/firestoreUser";

// App 전역 상태를 위한 통합 인터페이스
interface AppState {
    // Youtube video state
    videos: VideosType[];
    nextPageToken: string | null;
    error: Error | null;
    fetchVideos: (isNextPage?: boolean) => Promise<void>;
    setVideos: (videos: VideosType[]) => void;

    // Keyword & Autocomplete state
    keyword: string;
    suggestions: string[];
    selectedIndex: number;
    setKeyword: (value: string | ((prev: string) => string)) => void;
    fetchSuggestions: (input: string) => Promise<void>;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    setSuggestions: (suggestions: string[]) => void;
    setSelectedIndex: (index: number) => void;

    // UI state
    loginModal: boolean;
    setLoginModal: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Youtube video state
    videos: [],
    nextPageToken: null,
    error: null,
    setVideos: (videos) => set({ videos }),
    fetchVideos: async (isNextPage = false) => {
        const { keyword, nextPageToken, videos } = get();
        try {
            const url = `http://localhost:3000/api/videos?keyword=${keyword}${
                nextPageToken && isNextPage ? `&pageToken=${nextPageToken}` : ""
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
        }
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

    // UI state
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
