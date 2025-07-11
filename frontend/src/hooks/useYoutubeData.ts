import { useState } from "react";
import type { VideosType } from "../types/youtube.type";

export const useYoutubeData = () => {
    // 검색 키워드 state
    const [keyword, setKeyword] = useState<string>("");
    // 자동 완성 state
    const [suggestions, setSuggestions] = useState<string[]>([]);
    // 선택된 자동완성 항목
    const [selectedIndex, setSelectedIndex] = useState(-1);
    // 영상 정보 state
    const [videos, setVideos] = useState<VideosType[]>([]);
    // 데이터 더 보기 토큰 state
    const [nextPageToken, setNextPageToken] = useState<boolean | null>(null);
    // 에러 state
    const [error, setError] = useState<Error | null>(null);

    // 유튜브 영상 검색 함수
    const fetchVideos = async (isNextPage = false) => {
        try {
            const url = `http://localhost:3000/api/videos?keyword=${keyword}${nextPageToken && isNextPage ? `&pageToken=${nextPageToken}` : ""
                }`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setVideos(
                    isNextPage ? [...videos, ...data.videos] : data.videos
                );
                setNextPageToken(data.nextPageToken || null);
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (err: unknown) {
            console.error(err);
        }
    };

    // 자동완성 API 호출 함수
    const fetchSuggestions = async (input: string) => {
        setKeyword(input);
        setSelectedIndex(-1); // 입력할 때마다 선택 초기화 디바운싱

        if (!input.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:3000/api/autocomplete?keyword=${input}`
            );
            const data = await response.json();
            setSuggestions(response.ok ? data.suggestions || [] : []);
        } catch (err) {
            console.error(err);
            setSuggestions([]);
        }
    };

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0) {
                setKeyword(suggestions[selectedIndex]);
                setSuggestions([]);
            }
            fetchVideos();
        }
    };

    // ✅ 성과도 점수를 5단계로 변환하는 함수
    const getPerformanceLabel = (score: number) => {
        if (score >= 90) return `Great 🚀 (${score})`;
        if (score >= 70) return `Good 👍 (${score})`;
        if (score >= 50) return `Normal 😐 (${score})`;
        if (score >= 41) return `Bad 👎 (${score})`;
        return `Worst ❌ (${score})`;
    };

    return {
        keyword,
        setKeyword,
        suggestions,
        setSuggestions,
        selectedIndex,
        setSelectedIndex,
        fetchSuggestions,
        handleKeyDown,
        fetchVideos,
        getPerformanceLabel,
        videos,
        setVideos,
        nextPageToken,
        error
    }
}