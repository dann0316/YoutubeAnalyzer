import { useState } from "react";
import { FaSearch } from "react-icons/fa";


type Video = {
    videoId: string;
    thumbnail: string;
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    views: number;
    performanceScore: number;
};

const Header = () => {

    // 검색 키워드 state
    const [keyword, setKeyword] = useState<string>("");
    //
    const [suggestions, setSuggestions] = useState([]);
    // 선택된 자동완성 항목
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // 영상 정보 state
        const [videos, setVideos] = useState<Video[]>([]);
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



    return (
        <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-[#3aad6c] flex justify-between items-center px-6 z-10">

            {/* 왼쪽 제목 */}
            <h3 className="text-3xl font-bold text-[#3aad6c]">Youtube Analyzer</h3>

            {/* 오른쪽 검색창 */}
            <div className="relative">
                
                <div className="flex flex-row justify-between items-center bg-[#3aad6c]">
                    <input
                        type="text"
                        placeholder="검색할 키워드"
                        value={keyword}
                        onChange={(e) => fetchSuggestions(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border-2 border-[#3aad6c] h-10"
                    />

                    <button
                        onClick={() => fetchVideos()}
                        className="text-white"
                    >
                        <FaSearch />
                    </button>
                    
                </div>

                {/* ✅ 자동완성 목록 */}
                <div className="absolute left-0 top-full mt-1 w-full border border-black bg-white z-20">
                    {suggestions.length > 0 && (
                        <ul className="border-2 border-black">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    onClick={() => {
                                        setKeyword(suggestion);
                                        setSuggestions([]);
                                        fetchVideos();
                                    }}
                                    style={{
                                        padding: "8px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee",
                                        background:
                                            selectedIndex === index
                                                ? "#f0f0f0"
                                                : "transparent", // ✅ 선택된 항목 강조
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                    </div>

            </div>
        </header>
    )
}

export default Header;