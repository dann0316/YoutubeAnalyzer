// hooks/useFakeProgress.ts
import { useEffect, useRef, useState } from "react";

type Options = {
    maxHold?: number;        // 완료 전 최대치 (기본 90)
    tickMs?: number;         // 진행률 증가 주기 (기본 120ms)
    showDelayMs?: number;    // 너무 빠른 응답에서 플리커 방지 (기본 200ms)
    doneHoldMs?: number;     // 100%에서 잠깐 유지 (기본 300ms)
};

export function useFakeProgress({
    maxHold = 90,
    tickMs = 120,
    showDelayMs = 200,
    doneHoldMs = 300,
}: Options = {}) {
    const [value, setValue] = useState(0);
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState(false);

    const timerRef = useRef<number | null>(null);
    const showTimerRef = useRef<number | null>(null);
    const doneTimerRef = useRef<number | null>(null);

    // 가짜 증가 로직: 초반 빠르게, 후반 느리게
    const step = (v: number) => {
        if (v < 20) return v + 12;
        if (v < 50) return v + 5;
        if (v < 80) return v + 2.5;
        if (v < maxHold) return v + 1;
        return v; // maxHold에서 정지
    };

    const clearAll = () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
        if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
        timerRef.current = showTimerRef.current = doneTimerRef.current = null;
    };

    const start = () => {
        clearAll();
        setActive(true);
        setValue(0);
        // 일정 시간 지나서만 보이게 (플리커 방지)
        showTimerRef.current = window.setTimeout(() => setVisible(true), showDelayMs);
        timerRef.current = window.setInterval(() => {
            setValue((prev) => Math.min(step(prev), maxHold));
        }, tickMs);
    };

    const finish = () => {
        // 즉시 100 → 잠깐 유지 → 숨김
        setValue(100);
        clearAll();
        doneTimerRef.current = window.setTimeout(() => {
            setVisible(false);
            setActive(false);
            setValue(0);
        }, doneHoldMs);
    };

    // 컴포넌트 언마운트 시 정리
    useEffect(() => clearAll, []);

    // 비동기 함수 감싸기 편의 메서드
    const runWithProgress = async <T,>(fn: () => Promise<T>) => {
        start();
        try {
            const res = await fn();
            return res;
        } finally {
            finish();
        }
    };

    return { value, visible, active, start, finish, runWithProgress };
}
