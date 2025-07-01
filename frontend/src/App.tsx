import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import './App.css';
import { useState } from "react";

function App() {

    // 검색 키워드 state
        const [keyword, setKeyword] = useState<string>("");
        //
        const [suggestions, setSuggestions] = useState<string[]>([]);
        // 선택된 자동완성 항목
        const [selectedIndex, setSelectedIndex] = useState(-1);
    
        // 영상 정보 state
            const [videos, setVideos] = useState([]);
            //
            const [nextPageToken, setNextPageToken] = useState<boolean | null>(null);
            // 에러 state
            const [error, setError] = useState<string>("");
        
            // 유튜브 영상 검색
            const fetchVideos = async (isNextPage = false) => {
                try {
                    const url = `http://43.203.72.105:80/api/videos?keyword=${keyword}${
                        nextPageToken && isNextPage ? `&pageToken=${nextPageToken}` : ""
                    }`;
                    const response = await fetch(url);
                    const data = await response.json();
        
                    if (response.ok) {
                        setVideos(
                            isNextPage ? [...videos, ...data.videos] : data.videos
                        );
                        setNextPageToken(data.nextPageToken || null);
                        setError("");
                    } else {
                        setError(data.error);
                    }
                } catch (err: unknown) {
                    setError("서버 요청 실패");
                }
            };
    
    
    // ✅ 자동완성 API 호출 함수
        const fetchSuggestions = async (input: string) => {
            setKeyword(input);
            setSelectedIndex(-1); // 입력할 때마다 선택 초기화 디바운싱
    
            if (!input.trim()) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(
                    `http://43.203.72.105:80/api/autocomplete?keyword=${input}`
                );
                const data = await response.json();
                setSuggestions(response.ok ? data.suggestions || [] : []);
            } catch (err: unknown) {
                setSuggestions([]);
            }
        };
    
        // ✅ 키보드 이벤트 핸들러
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

    return (
        <div className="w-screen h-auto">
            <Header keyword = {keyword} fetchSuggestions = {fetchSuggestions} handleKeyDown = {handleKeyDown} fetchVideos = {fetchVideos} suggestions = {suggestions} setSelectedIndex={setSelectedIndex} selectedIndex={selectedIndex} setKeyword={setKeyword} setSuggestions = {setSuggestions}/>

            <Routes>
                <Route path="/" element={<Home error = {error} videos = {videos} getPerformanceLabel = {getPerformanceLabel} fetchVideos = {fetchVideos} nextPageToken = {nextPageToken} setVideos={setVideos}/>} />
            </Routes>
        </div>
    );
}

export default App;
