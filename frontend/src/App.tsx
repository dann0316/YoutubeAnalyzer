import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import "./App.css";
// import Detail from "./pages/Detail";
import { useYoutubeData } from "./hooks/useYoutubeData";
import { useAutoCompleteData } from "./hooks/useAutoCompleteData";
import { useStore } from "./stores/store";

function App() {
    
    const {
        fetchVideos,
        videos,
        setVideos,
        nextPageToken,
        error,
    } = useYoutubeData();

    const {
        suggestions,
        setSuggestions,
        selectedIndex,
        setSelectedIndex,
        fetchSuggestions,
        handleKeyDown,
    } = useAutoCompleteData();

    const {keyword} = useStore();
    const setKeyword = useStore((state) => state.setKeyword);

    // 성과도 점수를 5단계로 변환하는 함수
    const getPerformanceLabel = (score: number) => {
        if (score >= 90) return `Great 🚀 (${score})`;
        if (score >= 70) return `Good 👍 (${score})`;
        if (score >= 50) return `Normal 😐 (${score})`;
        if (score >= 41) return `Bad 👎 (${score})`;
        return `Worst ❌ (${score})`;
    };

    return (
        <div className="w-screen h-auto">
            <Header
                keyword={keyword}
                fetchSuggestions={fetchSuggestions}
                handleKeyDown={handleKeyDown}
                fetchVideos={fetchVideos}
                suggestions={suggestions}
                setSelectedIndex={setSelectedIndex}
                selectedIndex={selectedIndex}
                setKeyword={setKeyword}
                setSuggestions={setSuggestions}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            error={error}
                            videos={videos}
                            getPerformanceLabel={getPerformanceLabel}
                            fetchVideos={fetchVideos}
                            nextPageToken={nextPageToken}
                            setVideos={setVideos}
                        />
                    }
                />
                {/* <Route path="/detail/:videoId" element={<Detail />} /> */}
            </Routes>
        </div>
    );
}

export default App;
