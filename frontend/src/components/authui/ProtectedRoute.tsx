import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/store";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean; // true: 로그인 필요, false: 로그인 상태면 못 들어감
}

const ProtectedRoute = ({
    children,
    requireAuth = true,
}: ProtectedRouteProps) => {
    const { uid } = useUserStore();

    const isLoggedIn = !!uid;

    //replace 속성은 Navigate 컴포넌트가 페이지를 이동할 때 히스토리를 덮어쓰기 해서, 이동 전 페이지를 브라우저의 뒤로 가기(Back) 버튼으로 돌아갈 수 없게 만듦

    // 로그인 필요 + 로그인 안 했을 때 → 로그인 페이지로
    if (requireAuth && !isLoggedIn) {
        alert('로그인이 필요한 페이지입니다!')
        return <Navigate to="/" replace />;
    }

    // 로그인 상태인데 비회원용 페이지 접속 시도 → 홈으로
    if (!requireAuth && isLoggedIn) {
        alert('비회원용 페이지입니다!')
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
