import { useState } from "react";
import { useKeywordStore } from "../stores/store";

export const useAutoCompleteData = () => {
    // 검색 키워드 state
    // const [keyword, setKeyword] = useState<string>("");
    const {keyword} = useKeywordStore();
    const setKeyword = useKeywordStore((state) => state.setKeyword);
    // 자동 완성 state
    const [suggestions, setSuggestions] = useState<string[]>([]);
    // 선택된 자동완성 항목
    const [selectedIndex, setSelectedIndex] = useState(-1);

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

    

    // 키보드 이벤트 핸들러 함수
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

    return {
        keyword,
        setKeyword,
        suggestions,
        setSuggestions,
        selectedIndex,
        setSelectedIndex,
        fetchSuggestions,
        handleKeyDown,
    }
}