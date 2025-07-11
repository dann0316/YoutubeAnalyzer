import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import "./App.css";
import Detail from "./pages/Detail";
import { useYoutubeData } from "./hooks/useYoutubeData";

function App() {
    const {
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
        error,
    } = useYoutubeData();

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
                <Route path="/detail/:videoId" element={<Detail />} />
            </Routes>
        </div>
    );
}

export default App;
