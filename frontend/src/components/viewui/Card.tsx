import type { VideosType } from "@/types/youtube.type";

const Card = ({
    video,
    getPerformanceLabel,
    setModal,
    setSelectedVideo,
}: {
    video: VideosType;
    getPerformanceLabel: (score: number) => string;
    
}) => {
    return (
        <div
            className="border border-[#3aad6c] bg-white rounded-3xl w-full flex flex-row justify-between items-center gap-10 overflow-hidden p-3 cursor-pointer text-black transition-all duration-300 hover:text-white hover:bg-[#47d383]"
            onClick={() => {
                setModal(true);
                setSelectedVideo(video);
            }}
            title={video.title}
        >
            <div className="w-2/12 rounded-2xl overflow-hidden">
                <img
                    src={video.thumbnail}
                    loading="lazy"
                    alt="썸네일"
                    className="w-full"
                />
            </div>

            <div className="w-4/12 flex justify-center items-center">
                <h3 className="text-base font-bold">
                    {video.title.length > 20 ? video.title.slice(0,20)+"...": video.title}
                </h3>
            </div>

            <div className="w-2/12 flex justify-center items-center">{video.views}</div>

            <div className="w-2/12 flex justify-center items-center"></div>

            <div className="w-2/12 flex justify-center items-center">{getPerformanceLabel(video.performanceScore)}
            </div>

            <div className="w-2/12 flex justify-center items-center">{new Date(video.publishedAt).toLocaleDateString()}
            </div>
        </div>
    );
};

export default Card;
