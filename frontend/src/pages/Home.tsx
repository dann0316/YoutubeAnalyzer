import type { VideosType } from "../types/youtube.type";

type HomePropsType = {
    error: Error | null;
    videos: VideosType[];
    getPerformanceLabel: (score: number) => string;
    fetchVideos: (isNextPage?: boolean) => void;
    nextPageToken: boolean | null;
}

const Home: React.FC<HomePropsType> = ({ error, videos, getPerformanceLabel, fetchVideos, nextPageToken}) => {

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
