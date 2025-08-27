import MainLayout from "@/components/layoutui/MainLayout";
import AddPoint from "@/components/viewui/AddPoint";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/viewui/LoadingSpinner";
import { useUserStore } from "@/stores/store";
import type { VideosType } from "@/types/youtube.type";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

const MyPage = () => {
    const { nickname, point, role, email } = useUserStore();

    const { token } = useUserStore();

    const [myVideos, setMyVideos] = useState<VideosType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    const fetchMyVideos = async () => {
        setLoading(true);
        setError(null);

        if (!token) {
            setError("토큰이 없습니다.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:3001/api/videosinfo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("서버 응답 실패");
            }

            const data = await response.json();
            setMyVideos(data.videos || []);
        } catch (err) {
            console.error(err);
            setError("서버와 연결할 수 없습니다.");
            setMyVideos([]); // 명시적으로 빈 상태로
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyVideos();
    }, []);

    const [addPointModal, setAddPointModal] = useState<boolean>(false);

    const handleDeleteVideo = async (videoId: string) => {
        try {
            const response = await fetch(
                "http://localhost:3001/api/delete-video",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                    body: JSON.stringify({ videoId }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                // 프론트 상태에서도 삭제
                setMyVideos((prev) =>
                    prev.filter((v) => v.videoId !== videoId)
                );
                alert(data.message);
            } else {
                alert(data.error || "삭제 실패");
            }
        } catch (err) {
            console.error("삭제 에러:", err);
        }
    };

    // Gemini API 관련 상태
    // const [geminiPromptInput, setGeminiPromptInput] = useState<string>(""); // 일반 텍스트 입력용
    const [geminiResponseText, setGeminiResponseText] = useState<string>("");
    const [isGeneratingSummary, setIsGeneratingSummary] =
        useState<boolean>(false); // 요약 생성 중 로딩 상태
    const [geminiError, setGeminiError] = useState<string | null>(null);

    // Gemini API 호출 함수 (프롬프트를 인자로 받음)
    const callGeminiApi = async (prompt: string) => {
        setIsGeneratingSummary(true);
        setGeminiError(null);
        setGeminiResponseText(""); // 이전 응답 초기화

        try {
            const response = await fetch(
                "http://localhost:3000/api/generate-text",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Gemini API 호출 중 오류 발생."
                );
            }

            const data = await response.json();
            setGeminiResponseText(data.text);
        } catch (err) {
            console.error("Gemini API 호출 에러:", err);
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    // "요약보기" 버튼 클릭 핸들러
    const handleSummarizeVideo = (videoId: string) => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(videoId);
        console.log(videoUrl);
        const prompt = `${videoUrl} 이 영상을 요약해줘`;
        console.log(prompt);
        callGeminiApi(prompt);
    };

    // 일반 Gemini 텍스트 생성 버튼 클릭 핸들러 (기존 textarea용)
    // const handleGeneralTextGeneration = () => {
    //     if (geminiPromptInput.trim()) {
    //         callGeminiApi(geminiPromptInput);
    //     } else {
    //         setGeminiError("프롬프트를 입력해주세요.");
    //     }
    // };

    return (
        <MainLayout className={"gap-14"}>
            <h3 className="text-2xl font-bold text-black">My Page</h3>
            <Tabs
                defaultValue="account"
                className="border border-primary/70 w-full rounded-3xl flex flex-row justify-center items-center overflow-hidden"
            >
                <TabsList className="flex flex-col w-1/6 h-[40em] bg-white m-0 p-0 border-r border-primary/70 rounded-none">
                    <div className="w-full h-3/5 flex flex-col justify-center items-center border-b border-primary/70">
                        <div className="flex flex-col justify-center items-center gap-5">
                            {/* empty section */}
                            <div></div>

                            {/* user information section */}
                            <div className="text-black flex flex-col justify-center items-center gap-5">
                                <div className="border border-black w-28 h-28 rounded-full ">
                                    {/* <img src="" alt="" className="w-full h-full" /> */}
                                </div>
                                <div className="flex flex-col  justify-center items-center ">
                                    <h3 className="text-xl font-semibold">
                                        {nickname} ({role})
                                    </h3>
                                    <p>{email}</p>
                                    <p>point: {point}</p>
                                </div>
                            </div>

                            {/* trigger section */}
                            <TabsTrigger
                                value="account"
                                className="border border-gray-600 bg-gray-600 text-white text-sm rounded-3xl hover:text-gray-600 hover:bg-white transition duration-300 ease-in-out data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:cursor-not-allowed"
                            >
                                프로필 수정
                            </TabsTrigger>
                        </div>
                    </div>

                    <div className="w-full h-2/5 flex flex-col justify-center items-center">
                        <div className="flex flex-col justify-center items-start gap-3">
                            <TabsTrigger
                                value="videoManageMent"
                                className="TabsTrigger data-[state=active]:cursor-not-allowed"
                            >
                                영상 관리
                            </TabsTrigger>
                        </div>
                    </div>
                </TabsList>

                <div className="w-5/6">
                    <TabsContent
                        value="account"
                        className="flex flex-col justify-center items-center gap-3"
                    >
                        {/* 프로필 사진 변경 section */}
                        <div className="w-1/3 flex flex-col justify-center items-start gap-2">
                            <h3 className="text-[16px] font-semibold">
                                프로필
                            </h3>
                            <div className="w-full flex flex-row justify-between items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={nickname}
                                    className="w-full border border-line h-12 rounded-lg p-2"
                                />
                                <button className="btn">프로필 사진 변경</button>
                            </div>
                        </div>

                        {/* 닉네임 변경 section */}
                        <div className="w-1/3 flex flex-col justify-center items-start gap-2">
                            <h3 className="text-[16px] font-semibold">
                                닉네임
                            </h3>
                            <div className="w-full flex flex-row justify-between items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={nickname}
                                    className="w-full border border-line h-12 rounded-lg p-2"
                                />
                                <button className="btn">닉네임 변경</button>
                            </div>
                        </div>

                        {/* 비밀번호 변경 section */}
                        <div className="w-1/3 flex flex-col justify-center items-start gap-2">
                            <h3 className="text-[16px] font-semibold">
                                비밀번호
                            </h3>
                            <div className="w-full flex flex-row justify-between items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={nickname}
                                    className="w-full border border-line h-12 rounded-lg p-2"
                                />
                                <button className="btn">비밀번호 변경</button>
                            </div>
                        </div>

                        {/* 포인트 충전 section */}
                        <div className="w-1/3 flex flex-col justify-center items-start gap-2">
                            <h3 className="text-[16px] font-semibold">
                                포인트 충전
                            </h3>
                            <div className="w-full flex flex-row justify-between items-center gap-2">
                                <h3>현재 포인트: {point}</h3>
                                <button
                                    className="btn"
                                    onClick={() => {
                                        setAddPointModal(true);
                                    }}
                                >
                                    포인트 충전
                                </button>
                            </div>
                        </div>

                        {addPointModal && (
                            <AddPoint setAddPointModal={setAddPointModal} />
                        )}
                    </TabsContent>
                    <TabsContent
                        value="videoManageMent"
                        className="w-full h-auto flex flex-col justify-start items-center p-5 gap-5"
                    >
                        <div className="w-full h-[425px] overflow-y-auto p-1 border-2 border-primary rounded-lg mypage-tab-content">
                            <div
                                className={`w-full
                                ${
                                    myVideos
                                        ? "grid grid-cols-4 p-2 gap-2"
                                        : "flex justify-center items-center"
                                }
                                `}
                            >
                                {loading ? (
                                    <div>
                                        <LoadingSpinner />
                                    </div>
                                ) : error ? (
                                    <h3 className="text-lg text-red-500 font-medium">
                                        {error}
                                    </h3>
                                ) : myVideos.length === 0 ? (
                                    <h3 className="text-xl text-black font-medium">
                                        수집된 영상이 없습니다!
                                    </h3>
                                ) : (
                                    myVideos.map((video, i) => (
                                        <div
                                            key={i}
                                            className="shadow-lg w-full flex flex-col border border-primary justify-center items-center gap-3 rounded-xl relative min-h-80 bg-gray-100"
                                            title={video.title}
                                        >
                                            <button
                                                className="absolute top-2 right-2 text-xl font-light text-[#3aad6c]"
                                                onClick={() => {
                                                    handleDeleteVideo(
                                                        video.videoId
                                                    );
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
                                            <div className="w-60 rounded-2xl overflow-hidden flex justify-center items-center">
                                                <img
                                                    src={video.thumbnail}
                                                    loading="lazy"
                                                    alt="썸네일"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="w-full flex flex-col justify-center items-center gap-2 p-3">
                                                <h3 className="text-base font-bold">
                                                    {video.title.length > 15
                                                        ? video.title.slice(
                                                              0,
                                                              15
                                                          ) + "..."
                                                        : video.title}
                                                </h3>
                                                <div className="w-full flex flex-row justify-center items-center gap-2">
                                                    <a
                                                        className="w-1/2 btn text-center"
                                                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        영상보기
                                                    </a>
                                                    <button
                                                        className="btn w-1/2"
                                                        onClick={() =>
                                                            handleSummarizeVideo(
                                                                video.videoId
                                                            )
                                                        }
                                                        disabled={
                                                            isGeneratingSummary
                                                        } // 요약 생성 중일 때 비활성화
                                                    >
                                                        {isGeneratingSummary
                                                            ? "요약 중..."
                                                            : "요약보기"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* 요약 결과 표시 (videoManageMent 탭에 포함) */}
                        <div className="w-full h-[150px] overflow-x-hidden overflow-y-auto p-3 border-2 border-primary rounded-lg space-y-2">
                            <h3 className="text-base font-medium">
                                클릭한 영상 요약
                            </h3>
                            {isGeneratingSummary && (
                                <div className="flex flex-col justify-center items-start gap-2">
                                    <Skeleton className="h-5 w-1/3 rounded-md" />
                                    <Skeleton className="h-8 w-1/4 rounded-md" />
                                    <Skeleton className="h-5 w-1/3 rounded-md" />
                                </div>
                            )}
                            {geminiResponseText && (
                                <div className="">
                                    <p className="whitespace-pre-wrap text-base text-[#636262]">
                                        {geminiResponseText}
                                    </p>
                                </div>
                            )}
                            {geminiError && (
                                <div
                                    style={{ color: "red", marginTop: "10px" }}
                                >
                                    오류: {geminiError}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </MainLayout>
    );
};

export default MyPage;
