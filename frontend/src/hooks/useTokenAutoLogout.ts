// hooks/useTokenAutoLogout.ts
import { useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, getIdTokenResult, signOut } from "firebase/auth";

export const useTokenAutoLogout = () => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // 유저 로그인 상태일 때만 작동
            if (user) {
                const tokenResult = await getIdTokenResult(user);
                const expirationTime = new Date(tokenResult.expirationTime).getTime();
                const now = Date.now();

                const msUntilExpiry = expirationTime - now;

                console.log("🔒 토큰 만료까지 남은 시간(ms):", msUntilExpiry);

                // 만료 시 로그아웃 예약
                if (msUntilExpiry > 0) {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);

                    timeoutRef.current = setTimeout(() => {
                        console.log("🔒 토큰 만료됨, 자동 로그아웃");
                        signOut(auth);
                        alert("⏰ 로그인 시간이 만료되어 자동으로 로그아웃되었습니다.");
                    }, msUntilExpiry);
                }
            } else {
                // 로그아웃 상태면 타이머 해제
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }
        });

        return () => {
            unsubscribe();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);
};
