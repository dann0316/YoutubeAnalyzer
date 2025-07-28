import { useState } from "react";
import Card from "@/components/viewui/Card";
import type { ListPropsType, VideosType } from "../types/youtube.type";
import Detail from "../components/pageui/Detail";
import MainLayout from "@/components/layoutui/MainLayout";

const List: React.FC<ListPropsType> = ({
    error,
    videos,
    getPerformanceLabel,
    fetchVideos,
    nextPageToken,
    setVideos,
}) => {
    const [modal, setModal] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState<VideosType | null>(null);

    const titleArr = [
        "썸네일",
        "영상 제목",
        "조회수",
        "기여도",
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
        <MainLayout>
            {error && <p> 오류: {error ? error.message : null}</p>}
            <div className="w-full flex flex-row justify-start items-center gap-2">
                <button className="btn" onClick={() => sortByViews()}>
                    조회수 정렬
                </button>
                <button className="btn" onClick={() => sortByViewsReverse()}>
                    조회수 역정렬
                </button>
            </div>

            <div className="w-full flex flex-row justify-between items-center gap-1">
                {titleArr.map((a, i) => {
                    let widthClass = "w-2/12";

                    if (i === 1) widthClass = "w-4/12";

                    const des =
                        "채널의 성장에 극적으로 기여한 정보를 수치화 한것으로 기여도가 높은 영상일수록 채널을 성장 시킬 잠재력이 있는 주제를 다룬 영상입니다.";

                    const des2 =
                        "채널에 있는 영상이 알림과 같은 구독자 기반의 노출과 관계 없이 자체성과를 올릴 경우 성과도가 높게 나타납니다.";

                    return (
                        <div
                            key={i}
                            className={`${widthClass} flex justify-center items-center border border-[#3aad6c] p-3 rounded-lg`}
                            title={i === 3 ? des : i === 4 ? des2 : ""}
                        >
                            {a}
                        </div>
                    );
                })}
            </div>

            {videos.length > 0 ? (
                videos.map((video, index) => (
                    <Card
                        key={index}
                        video={video}
                        getPerformanceLabel={getPerformanceLabel}
                        setModal={setModal}
                        setSelectedVideo={setSelectedVideo}
                    />
                ))
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}

            <Detail
                modal={modal}
                setModal={setModal}
                selectedVideo={selectedVideo}
                getPerformanceLabel={getPerformanceLabel}
            />

            {nextPageToken && (
                <button onClick={() => fetchVideos(true)} className="btn">
                    Load More
                </button>
            )}
        </MainLayout>
    );
};

export default List;
