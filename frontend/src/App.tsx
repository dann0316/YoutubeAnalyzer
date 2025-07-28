import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layoutui/Header";
import "./App.css";
import { useYoutubeData } from "./hooks/useYoutubeData";
import { useAutoCompleteData } from "./hooks/useAutoCompleteData";
import { useStore } from "./stores/store";
import SignUp from "./pages/SignUp";
import List from "@/pages/List";
import MyPage from "./pages/MyPage";
import { useInitUser } from "./hooks/useInitUser";
import ProtectedRoute from "./components/authui/ProtectedRoute";

function App() {
    const { fetchVideos, videos, setVideos, nextPageToken, error } =
        useYoutubeData();

    const {
        suggestions,
        setSuggestions,
        selectedIndex,
        setSelectedIndex,
        fetchSuggestions,
        handleKeyDown,
    } = useAutoCompleteData();

    const { keyword } = useStore();
    const setKeyword = useStore((state) => state.setKeyword);

    // 성과도 점수를 5단계로 변환하는 함수
    const getPerformanceLabel = (score: number) => {
        if (score >= 90) return `Great 🚀 (${score})`;
        if (score >= 70) return `Good 👍 (${score})`;
        if (score >= 50) return `Normal 😐 (${score})`;
        if (score >= 41) return `Bad 👎 (${score})`;
        return `Worst ❌ (${score})`;
    };

    useInitUser();

    return (
        <div>
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
                <Route path="/" element={<Home />} />
                <Route
                    path="/list"
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <List
                                error={error}
                                videos={videos}
                                getPerformanceLabel={getPerformanceLabel}
                                fetchVideos={fetchVideos}
                                nextPageToken={nextPageToken}
                                setVideos={setVideos}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <SignUp />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mypage"
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <MyPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
