import ViewsByChart from "./viewsByChart";
import type { VideosType } from "../types/youtube.type";
import { useNavigate } from "react-router-dom";

const Card = ({video, getPerformanceLabel}: {video: VideosType, getPerformanceLabel: (score: number) => string}) => {

    const navigate = useNavigate();
    
    return (
        <div
            className="border border-[#3aad6c] rounded-3xl w-full flex flex-row justify-center items-center gap-3 overflow-hidden p-3 cursor-pointer"
            onClick={() => {
                navigate(`/detail/${video.videoId}`)
            }}
        >
            <div className="w-4/12">
                <img
                    src={video.thumbnail}
                    loading="lazy"
                    alt="썸네일"
                    className="w-full"
                />
            </div>

            <div className="w-4/12 flex flex-col justify-start items-start gap-5">
                <h3 className="text-lg font-bold">영상 제목: {video.title}</h3>
                {/* <p> {video.description}</p> */}
                <p>
                    업로드 날짜:{" "}
                    {new Date(video.publishedAt).toLocaleDateString()}
                </p>
                <p>채널명: {video.channelTitle}</p>
                <p>좋아요 수: {video.likes}</p>
                <p>댓글 수: {video.comments}</p>
                <p>조회수: {video.views}</p>
                <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    🔗 영상 보기
                </a>
            </div>

            <div className="w-3/12 flex flex-col justify-start items-center gap-5">
                <h3 className="text-lg font-bold">영상별 반응 비율</h3>
                <div className="h-60 w-60">
                    <ViewsByChart
                        views={video.views}
                        likes={video.likes}
                        comments={video.comments}
                    />
                </div>
            </div>

            <p className="">
                <strong>⭐ 성과도:</strong>{" "}
                {getPerformanceLabel(video.performanceScore)}
            </p>
        </div>
    );
};

export default Card;
