import { useState } from "react";

type Video = {
    videoId: string;
    thumbnail: string;
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    views: number;
    performanceScore: number;
};

const Home = () => {
    // 영상 정보 state
    const [videos, setVideos] = useState<Video[]>([]);
    //
    const [nextPageToken, setNextPageToken] = useState<boolean | null>(null);
    // 에러 state
    const [error, setError] = useState<string>("");

    // 유튜브 영상 검색
    const fetchVideos = async (isNextPage = false) => {
        try {
            const url = `http://43.203.72.105:80/api/videos?keyword=${keyword}${
                nextPageToken && isNextPage ? `&pageToken=${nextPageToken}` : ""
            }`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setVideos(
                    isNextPage ? [...videos, ...data.videos] : data.videos
                );
                setNextPageToken(data.nextPageToken || null);
                setError("");
            } else {
                setError(data.error);
            }
        } catch (err: unknown) {
            setError("서버 요청 실패");
        }
    };


    // ✅ 성과도 점수를 5단계로 변환하는 함수
    const getPerformanceLabel = (score: number) => {
        if (score >= 90) return `Great 🚀 (${score})`;
        if (score >= 70) return `Good 👍 (${score})`;
        if (score >= 50) return `Normal 😐 (${score})`;
        if (score >= 41) return `Bad 👎 (${score})`;
        return `Worst ❌ (${score})`;
    };

    return (
        <div className="container">

            {error && <p style={{ color: "red" }}> 오류: {error}</p>}

            <div className="">
                {videos.length > 0 ? (
                    videos.map((video, index) => (
                        <div
                            key={index}
                            className="border border-[#3aad6c] rounded-3xl w-full flex flex-row"
                            >
                            <img
                                src={video.thumbnail}
                                alt="썸네일"
                                width="300"
                                style={{ borderRadius: "10px" }}
                            />
                            <h3>📺 {video.title}</h3>
                            <p>📢 {video.description}</p>
                            <p>
                                📅{" "}
                                {new Date(
                                    video.publishedAt
                                ).toLocaleDateString()}
                            </p>
                            <p>🎬 채널명: {video.channelTitle}</p>
                            <p>조회수: {video.views}</p>
                            <p>
                                <strong>⭐ 성과도:</strong>{" "}
                                {getPerformanceLabel(video.performanceScore)}
                            </p>
                            <a
                                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                🔗 영상 보기
                            </a>
                        </div>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>

            {nextPageToken && (
                <button
                    onClick={() => fetchVideos(true)}
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        fontSize: "16px",
                    }}
                >
                    🔄 더보기
                </button>
            )}
        </div>
    );
};

export default Home;
