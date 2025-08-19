import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layoutui/Header";
import "./App.css";
import SignUp from "./pages/SignUp";
import List from "@/pages/List";
import MyPage from "./pages/MyPage";
import { useInitUser } from "./hooks/useInitUser";
import ProtectedRoute from "./components/authui/ProtectedRoute";
import Footer from "./components/layoutui/Footer";
import Analyze from "./pages/Analyze";
import LogIn from "./components/pageui/LogIn";
import { useAppStore } from "./stores/store";

function App() {
    const { loginModal } = useAppStore();

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
            <Header />
            {loginModal && <LogIn />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/list"
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <List getPerformanceLabel={getPerformanceLabel} />
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
