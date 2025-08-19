import MainLayout from "@/components/layoutui/MainLayout";
import { useUserStore } from "@/stores/store";
import type { VideosType } from "@/types/youtube.type";
import { useEffect, useRef, useState } from "react";
import { FaChartBar, FaPlay } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const Analyze = () => {
    const { token } = useUserStore();

    const [myVideos, setMyVideos] = useState<VideosType[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<VideosType[]>([]);
    const [response, setResponse] = useState<string>("");

    const [progress, setProgress] = useState<number>(0);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

    // 가짜 진행률 타이머 ref
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null
    );

    const fetchMyVideos = async () => {
        if (!token) {
            console.warn("토큰이 없습니다. 요청 중단.");
            return;
        }
        const res = await fetch("http://localhost:3001/api/videosinfo", {
            method: "POST",
            headers: { "Content-Type": "application/json", token },
        });
        const data = await res.json();
        setMyVideos(data.videos ?? []);
    };

    useEffect(() => {
        fetchMyVideos();
    }, []);

    const handleVideoClick = (video: VideosType) => {
        const alreadySelected = selectedVideos.find(
            (v) => v.videoId === video.videoId
        );
        if (alreadySelected) {
            setSelectedVideos(
                selectedVideos.filter((v) => v.videoId !== video.videoId)
            );
        } else {
            if (selectedVideos.length >= 5) {
                alert("최대 5개까지 선택 가능합니다.");
                return;
            }
            setSelectedVideos([...selectedVideos, video]);
        }
    };

    // --- 가짜 진행률 컨트롤러 ---
    const startFakeProgress = (expectedMs = 15000, plateau = 95) => {
        // 안전 정리
        if (progressIntervalRef.current)
            clearInterval(progressIntervalRef.current);

        setProgress(0);
        const startedAt = Date.now();

        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const ratio = Math.min(elapsed / expectedMs, 1);

            // easeOutCubic: 초반 빠르고 후반 느려짐
            const eased = 1 - Math.pow(1 - ratio, 3);
            const target = Math.floor(plateau * eased);

            setProgress((prev) => Math.max(prev, target)); // 되돌아가지 않게
        }, 100);
    };

    const finishFakeProgress = async () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        // 100%까지 짧게 마무리 애니메이션 느낌
        setProgress((prev) => (prev < 100 ? 100 : prev));
    };

    useEffect(() => {
        // 컴포넌트 unmount 시 타이머 정리
        return () => {
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);
        };
    }, []);

    // --- 분석 로직 ---
    const analyzeSelectedVideos = async () => {
        if (selectedVideos.length === 0) {
            alert("최소 1개 이상의 영상을 선택해주세요.");
            return;
        }

        setIsAnalyzing(true);
        startFakeProgress(15000, 95); // 15초 예상, 최대 95%에서 대기

        const videoInfos = selectedVideos
            .map((video, idx) => {
                return `${idx + 1}.
[제목] ${video.title}
[설명] ${video.description}
[썸네일] ${video.thumbnail}`;
            })
            .join("\n\n");

        const prompt = `
다음 유튜브 영상 정보들을 기반으로, 아래 내용을 포맷에 맞춰서 분석해줘.

[영상 정보]
${videoInfos}

1. 이런 영상류 들의 썸네일, 제목, 설명을 바탕으로 해당 영상류 들은 썸네일과 제목에 어떤 전략을 썼는지 간략하게 요약해줘.
2. 영상들에서 나온 주요 키워드들을 알려줘
`;

        try {
            const res = await fetch("http://localhost:3000/api/gpt-analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) throw new Error("GPT 분석 요청 실패");

            const result = await res.json();
            setResponse(result.result);
        } catch (err) {
            console.error("분석 중 오류 발생:", err);
            alert("분석 중 오류가 발생했습니다.");
        } finally {
            await finishFakeProgress(); // 100%로 마무리
            // 약간의 여유를 주고 상태 초기화(선택)
            setTimeout(() => {
                setIsAnalyzing(false);
                // 진행바를 유지하고 싶지 않으면 아래 줄로 0으로 내려 UX 깔끔히
                // setProgress(0);
            }, 300);
        }
    };
    return (
        <MainLayout>
            <div className="w-full flex flex-row justify-between items-start">
                <div className="w-fit flex flex-col justify-center items-start gap-2">
                    <h3 className="text-2xl font-bold text-black">Analyze</h3>
                    <p className="text-base font-normal text-gray-500">
                        수집된 영상을 선택하고 분석을 시작하세요
                    </p>
                </div>
                <h3 className="font-semibold">총 {myVideos.length}개 영상</h3>
            </div>

            <div className="w-full flex gap-2 h-[600px]">
                <div className="w-1/3 h-full flex flex-col justify-start items-start gap-5 border border-[#44cfa587] rounded-2xl p-5 shadow-md relative">
                    <div className="w-fit flex justify-center items-center gap-1 font-semibold">
                        <FaPlay /> 수집된 영상 h는 없고 min-h랑 max-h만 있어도
                        되나?
                    </div>

                    <div
                        className={`w-full max-h-[420px] min-h-[420px] border-4 border-[#44cfa587] rounded-2xl p-3 overflow-auto
                        ${
                            myVideos
                                ? "flex flex-col justify-start items-center gap-5"
                                : ""
                        }
                        `}
                    >
                        {myVideos ? (
                            myVideos.map((a, i) => {
                                return (
                                    <div
                                        key={i}
                                        title={a.title}
                                        onClick={() => handleVideoClick(a)}
                                        className={`cursor-pointer shadow-md w-full border border-primary rounded-md p-3 flex flex-row justify-center items-center gap-3
                                            ${
                                                selectedVideos.find(
                                                    (v) =>
                                                        v.videoId === a.videoId
                                                )
                                                    ? "border-blue-700 bg-blue-50"
                                                    : "border-primary bg-gray-50"
                                            }
                                            `}
                                    >
                                        <div className="w-1/3 rounded-md overflow-hidden">
                                            <img
                                                src={a.thumbnail}
                                                alt="thumbnail"
                                                onError={(e) =>
                                                    (e.currentTarget.src =
                                                        "/default-img.png")
                                                }
                                            />
                                        </div>
                                        <div className="w-2/3">
                                            {a.title.length > 30
                                                ? a.title
                                                      .replace(/<[^>]+>/g, "")
                                                      .slice(0, 30) + "..."
                                                : a.title}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div>수집된 영상이 없습니다.</div>
                        )}
                    </div>
                    <div className="w-full absolute bottom-6 flex flex-col justify-center items-start gap-3">
                        <button
                            className="w-1/2 btn flex flex-row justify-center items-center gap-2 disabled:opacity-60"
                            onClick={analyzeSelectedVideos}
                            disabled={
                                isAnalyzing || selectedVideos.length === 0
                            }
                        >
                            <FaChartBar />
                            {isAnalyzing
                                ? "분석 중..."
                                : "선택된 영상 분석하기"}{" "}
                            ({selectedVideos.length}/5)
                        </button>

                        {/* 진행바: 상태 연결 */}
                        <Progress value={progress} className="w-2/3 h-3" />
                        {isAnalyzing && (
                            <span className="text-xs text-muted-foreground">
                                {progress}%
                            </span>
                        )}
                    </div>
                </div>

                <div className="w-2/3 flex flex-col justify-start items-start gap-5 border border-[#44cfa587] rounded-2xl p-5 shadow-md">
                    <div className="w-full max-h-[300px] min-h-[300px] flex flex-col justify-start items-start gap-5 border-4 border-[#44cfa587] rounded-2xl overflow-y-auto text-base font-normal p-5">
                        <h3 className="font-semibold">분석 내용</h3>
                        {/* 분석 중이면 skeleton 느낌으로 자리 유지 */}
                        {isAnalyzing ? (
                            <div className="w-full flex flex-col justify-center items-start gap-2">
                                <Skeleton className="h-5 w-1/2 rounded-md"/>
                                <Skeleton className="h-20 w-1/3 rounded-md"/>
                                <Skeleton className="h-10 w-1/2 rounded-md"/>
                                <Skeleton className="h-10 w-1/4 rounded-md"/>
                            </div>
                        ) : (
                            <p>{response}</p>
                        )}
                    </div>
                    <div className="w-full flex gap-5">
                        <div className="w-1/2 max-h-[230px] min-h-[230px] flex flex-col justify-start items-start gap-5 border-4 border-[#44cfa587] rounded-2xl overflow-y-auto text-base font-normal p-5">
                            <h3 className="font-semibold">
                                댓글 감정 내용(긍정적/중립적/부정적)이거
                                chart.js로 만들어야겠다.
                            </h3>
                        </div>
                        <div className="w-1/2 max-h-[230px] min-h-[230px] flex flex-col justify-start items-start gap-5 border-4 border-[#44cfa587] rounded-2xl overflow-y-auto text-base font-normal p-5">
                            <h3 className="font-semibold">주요 키워드</h3>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Analyze;
