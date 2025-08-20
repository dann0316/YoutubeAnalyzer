import { useState } from "react";
import Card from "@/components/viewui/Card";
import type { VideosType } from "../types/youtube.type";
import Detail from "../components/pageui/Detail";
import MainLayout from "@/components/layoutui/MainLayout";
import { useAppStore, useUserStore } from "@/stores/store";
import ListSkeleton from "@/components/viewui/ListSkeleton";

interface ListProps {
    getPerformanceLabel: (score: number) => string;
}

const List: React.FC<ListProps> = ({ getPerformanceLabel }) => {
    const [modal, setModal] = useState<boolean>(false);
    const [selectedVideo, setSelectedVideo] = useState<VideosType | null>(null);
    const [checkedVideos, setCheckedVideos] = useState<VideosType[]>([]);

    // Zustand store에서 상태 및 함수 가져오기
    const { videos, error, fetchVideos, nextPageToken, setVideos, isLoading, } =
        useAppStore();

    const { token } = useUserStore();

    const toggleChecked = (video: VideosType) => {
        setCheckedVideos((prev) => {
            const exists = prev.find((v) => v.videoId === video.videoId);
            if (exists) {
                return prev.filter((v) => v.videoId !== video.videoId);
            } else {
                return [...prev, video];
            }
        });
    };

    const filteredVideos = checkedVideos.map((video) => ({
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        title: video.title,
    }));

    const sendCheckedVideos = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/videos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: token, // 헤더에 토큰 추가
                },
                body: JSON.stringify(filteredVideos),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "실패");
            alert(data.message);
        } catch (err) {
            console.error(err);
            alert("전송 중 오류 발생");
        }
    };

    const titleArr = [
        "선택",
        "썸네일",
        "영상 제목",
        "조회수",
        "성과도",
        "게시일",
    ];

    const sortByViews = () => {
        const copy = [...videos];
        copy.sort((a, b) => b.views - a.views);
        setVideos(copy);
    };

    const sortByViewsReverse = () => {
        const copy = [...videos];
        copy.sort((a, b) => a.views - b.views);
        setVideos(copy);
    };

    return (
        <MainLayout className="max-h-[740px] min-h-[740px] scroll-auto">
            {error && <p> 오류: {error ? error.message : null}</p>}
            <div className="w-full flex flex-row justify-between items-center">
                <div className="w-fit flex flex-row justify-start items-center gap-2">
                    <button className="btn" onClick={() => sortByViews()}>
                        조회수 정렬
                    </button>
                    <button
                        className="btn"
                        onClick={() => sortByViewsReverse()}
                    >
                        조회수 역정렬
                    </button>
                </div>

                <button className="btn" onClick={sendCheckedVideos}>
                    영상 수집
                </button>
            </div>

            <div className="w-full flex flex-row justify-between items-center gap-1">
                {titleArr.map((a, i) => {
                    let widthClass = "w-2/12";

                    if (i === 0) widthClass = "w-1/12";
                    else if (i === 2) widthClass = "w-3/12";

                    const des2 =
                        "채널에 있는 영상이 알림과 같은 구독자 기반의 노출과 관계 없이 자체성과를 올릴 경우 성과도가 높게 나타납니다.";

                    return (
                        <div
                            key={i}
                            className={`${widthClass} flex justify-center items-center border border-[#3aad6c] p-3 rounded-lg`}
                            title={i === 4 ? des2 : ""}
                        >
                            {a}
                        </div>
                    );
                })}
            </div>
            {isLoading && videos.length === 0 && (
                <div className="flex flex-col justify-start items-center gap-1">
                    <ListSkeleton />
                    <ListSkeleton />
                    <ListSkeleton />
                </div>
            )}
            {videos.length > 0 ? (
                videos.map((video, index) => (
                    <Card
                        key={index}
                        video={video}
                        getPerformanceLabel={getPerformanceLabel}
                        setModal={setModal}
                        setSelectedVideo={setSelectedVideo}
                        toggleChecked={toggleChecked}
                        checked={checkedVideos.some(
                            (v) => v.videoId === video.videoId
                        )}
                    />
                ))
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}

            {selectedVideo && (
                <Detail
                    modal={modal}
                    setModal={setModal}
                    selectedVideo={selectedVideo}
                />
            )}

            {nextPageToken && (
                <button onClick={() => fetchVideos(true)} className="btn">
                    Load More
                </button>
            )}
        </MainLayout>
    );
};

export default List;
