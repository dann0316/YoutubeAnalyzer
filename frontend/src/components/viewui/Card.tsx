import type { VideosType } from "@/types/youtube.type";
import type { Dispatch, SetStateAction } from "react";

const Card = ({
    video,
    getPerformanceLabel,
    setModal,
    setSelectedVideo,
    toggleChecked,
    checked,
}: {
    video: VideosType;
    getPerformanceLabel: (score: number) => string;
    setModal: Dispatch<SetStateAction<boolean>>;
    setSelectedVideo: Dispatch<SetStateAction<VideosType | null>>;
    toggleChecked: (video: VideosType) => void;
    checked: boolean;
}) => {
    const infoItems = [
        {
            key: "checkbox",
            className: "w-1/12 flex justify-center items-center",
            render: () => (
                <input
                    type="checkbox"
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5"
                    checked={checked}
                    onChange={() => toggleChecked(video)}
                />
            ),
        },
        {
            key: "thumbnail",
            className:
                "w-2/12 rounded-2xl overflow-hidden flex justify-center items-center",
            render: () => (
                <img
                    src={video.thumbnail}
                    loading="lazy"
                    alt="썸네일"
                    className="w-full"
                />
            ),
        },
        {
            key: "title",
            className: "w-3/12 flex justify-center items-center",
            render: () => (
                <h3 className="text-base font-bold">
                    {video.title.length > 20
                        ? video.title.slice(0, 20) + "..."
                        : video.title}
                </h3>
            ),
        },
        {
            key: "views",
            className: "w-2/12 flex justify-center items-center",
            render: () => video.views,
        },
        {
            key: "performanceScore",
            className: "w-2/12 flex justify-center items-center",
            render: () => getPerformanceLabel(video.performanceScore),
        },
        {
            key: "publishedAt",
            className: "w-2/12 flex justify-center items-center",
            render: () => new Date(video.publishedAt).toLocaleDateString(),
        },
    ];
    return (
        <div
            className="border border-[#3aad6c] bg-white rounded-3xl w-full flex flex-row justify-between items-center overflow-hidden py-3 cursor-pointer text-black transition-all duration-300 hover:text-white hover:bg-[#47d383]"
            onClick={() => {
                setModal(true);
                setSelectedVideo(video);
            }}
            title={video.title}
        >
            {infoItems.map(({ key, className, render }) => (
                <div key={key} className={className}>
                    {render()}
                </div>
            ))}
        </div>
    );
};

export default Card;
