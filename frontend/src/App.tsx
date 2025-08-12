import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layoutui/Header";
import "./App.css";
import { useYoutubeData } from "./hooks/useYoutubeData";
import { useAutoCompleteData } from "./hooks/useAutoCompleteData";
import { useKeywordStore } from "./stores/store";
import SignUp from "./pages/SignUp";
import List from "@/pages/List";
import MyPage from "./pages/MyPage";
import { useInitUser } from "./hooks/useInitUser";
import ProtectedRoute from "./components/authui/ProtectedRoute";
import Footer from "./components/layoutui/Footer";
import Analyze from "./pages/Analyze";
import { useState } from "react";
import LogIn from "./components/pageui/LogIn";

function App() {
    const [loginModal, setLoginModal] = useState(false);
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

    const { keyword } = useKeywordStore();
    const setKeyword = useKeywordStore((state) => state.setKeyword);

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
                setLoginModal={setLoginModal}
            />
            {loginModal && <LogIn setLoginModal={setLoginModal} />}
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
                <Route
                    path="/analyze"
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <Analyze />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;
