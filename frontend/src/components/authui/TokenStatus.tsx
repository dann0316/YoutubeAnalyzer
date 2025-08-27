import { useEffect, useState } from "react";
import { getAuth, getIdTokenResult } from "firebase/auth";

const TokenStatus = () => {
    const [expiresIn, setExpiresIn] = useState<string>("");

    const fetchTime = async () => {
        const user = getAuth().currentUser;
        if (!user) return;

        const result = await getIdTokenResult(user);
        const expiration = new Date(result.expirationTime);
        const now = new Date();

        const diffMs = expiration.getTime() - now.getTime();
        const minutes = Math.floor(diffMs / 1000 / 60);
        const seconds = Math.floor((diffMs / 1000) % 60);

        setExpiresIn(`${minutes}분 ${seconds}초`);

        if(minutes === 30 && seconds === 59) {
            alert('30분 후에 로그아웃됩니다!');
        } else if(minutes === 15 && seconds === 59){
            alert('15분 후에 로그아웃됩니다!');
        }
        
    };

    useEffect(() => {
        fetchTime();
        const interval = setInterval(fetchTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const refreshToken = async () => {
        const user = getAuth().currentUser;
        if (!user) return;

        await user.getIdToken(true);
        alert("🔁 토큰이 갱신되었습니다!");
        fetchTime(); // 만료 시간 다시 갱신
    };

    return (
        <div className="flex flex-row justify-end items-center gap-2 text-sm font-medium text-primary">
            <p className="whitespace-nowrap">{expiresIn}</p>
            <button
                onClick={refreshToken}
                className="btn px-1 py-1 border-none">
                로그인 연장
            </button>
        </div>
    );
};

export default TokenStatus;
