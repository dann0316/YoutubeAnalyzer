import { useEffect, useState } from "react";
import type { VideosType } from "../types/youtube.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoCard from "../components/InfoCard";
import ViewsByChart from "../components/viewsByChart";

const Detail = ({
    selectedVideo,
    modal,
    setModal,
}: {
    selectedVideo: VideosType;
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [bestComment, setBestComments] = useState<string>("");

    const fetchBestComment = async () => {
        try {
            if (!selectedVideo?.videoId) return;
            const url = `http://localhost:3000/api/comments?videoId=${selectedVideo?.videoId}`;
            const response = await fetch(url);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`API 오류: ${text}`);
            }
            const data = await response.json();
            setBestComments(data.text);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBestComment();
    }, [selectedVideo?.videoId]);

    const [channel, setChannel] = useState<string>("");
    const [channelImg, setChannelImg] = useState<string | undefined>(undefined);
    const [channelDes, setChannelDes] = useState<string>("");
    const [channelDate, setChannelDate] = useState<string>("");
    const [channelSub, setChannelSub] = useState<number>();

    const fetchChannelInfo = async () => {
        try {
            if (!selectedVideo?.channelId) {
                console.log("channelId 없음. 요청 안함");
                return;
            }

            const url = `http://localhost:3000/api/channel?id=${selectedVideo?.channelId}`;
            console.log("채널 정보 요청:", url);

            const response = await fetch(url);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`API 오류: ${text}`);
            }
            const data = await response.json();
            setChannel(data.title);
            setChannelImg(data.thumbnail);
            setChannelDes(data.description);
            setChannelDate(data.publishedAt);
            setChannelSub(data.subscriberCount);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedVideo?.channelId) {
            fetchChannelInfo();
        }
    }, [selectedVideo?.channelId ?? ""]);

    //   useEffect(() => {
    //     if (modal) {
    //       document.body.style.overflow = "hidden";
    //     } else {
    //       document.body.style.overflow = "auto";
    //     }

    //     return () => {
    //       document.body.style.overflow = "auto"; // cleanup
    //     };
    //   }, [modal]);

    const [shouldRender, setShouldRender] = useState(modal);

    useEffect(() => {
        if (modal) {
            setShouldRender(true);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            // 애니메이션 끝나고 제거
            const timeout = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [modal]);

    if (!shouldRender) return null;

    return (
        <main
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto`}
        >
            <div
                className={`overflow-x-hidden overflow-y-auto w-7/12 h-7/12 max-h-7/12 border borde-white bg-[#eeeeee] rounded-3xl p-5 relative transition-all duration-300
    ${
        modal
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
    }
    `}
            >
                <button
                    onClick={() => {
                        setModal(false);
                    }}
                    className="absolute top-1 right-5 text-3xl font-light text-white"
                >
                    x
                </button>
                <Tabs
                    defaultValue="video"
                    className="border border-[#3aad6c] p-5 rounded-3xl"
                >
                    <TabsList className="w-auto h-full">
                        <TabsTrigger value="video" className="">
                            영상 정보
                        </TabsTrigger>
                        <TabsTrigger value="channel">채널 정보</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="video"
                        className="w-full h-auto flex flex-col gap-5"
                    >
                        {/* first information section*/}
                        <div className="flex flex-row gap-5">
                            {/* img section */}
                            <div className="w-3/12 rounded-lg overflow-hidden">
                                <img
                                    src={selectedVideo?.thumbnail}
                                    loading="lazy"
                                    alt="썸네일"
                                    className="w-full"
                                />
                            </div>

                            {/* information section */}
                            <div className="w-9/12 flex flex-col justify-center items-start gap-3">
                                {/* title section */}
                                <h4 className="text-2xl">
                                    {selectedVideo?.title}
                                </h4>

                                {/* detail section */}
                                <div className="flex flex-row justify-start items-center gap-3 text-sm">
                                    <p>
                                        게시일:{" "}
                                        {new Date(
                                            selectedVideo?.publishedAt
                                        ).toLocaleDateString()}
                                    </p>
                                    |<p>좋아요: {selectedVideo?.likes}</p>|
                                    <p>댓글: {selectedVideo?.comments}</p>
                                </div>
                                <a
                                    href={`https://www.youtube.com/watch?v=${selectedVideo?.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-[#3aad6c] bg-white text-[#3aad6c] text-base hover:bg-[#3aad6c] hover:text-white transition-all duration-300 px-3 py-2 rounded-lg font-medium"
                                >
                                    유튜브에서 영상 보기
                                </a>
                            </div>
                        </div>

                        {/* section information section */}
                        <div className="w-full h-auto flex flex-row gap-5 mt-5">
                            <InfoCard
                                cardTitle="영상 상세 정보"
                                cardContent={selectedVideo?.description}
                            />
                            <InfoCard
                                cardTitle="베스트 댓글"
                                cardContent={bestComment}
                            />
                        </div>

                        {/* third information section */}
                        <div className="w-full h-auto flex flex-row gap-5">
                            <div className="w-1/2 h-auto flex flex-row gap-5">
                                <InfoCard
                                    cardTitle="조회수"
                                    cardContent={selectedVideo?.views}
                                />
                                <InfoCard
                                    cardTitle="좋아요"
                                    cardContent={selectedVideo?.likes}
                                />
                            </div>

                            <div className="w-1/2 h-auto flex flex-row gap-5">
                                <InfoCard
                                    cardTitle="댓글"
                                    cardContent={selectedVideo?.comments}
                                />
                                <InfoCard cardTitle="성과도" cardContent={""} />
                            </div>
                        </div>

                        <div className="w-full h-auto flex rounded-lg bg-[#fefefe] border border-[#ddd] p-5">
                            <h3 className="text-base">영상별 반응 비율</h3>
                            <div className="h-80 w-auto">
                                <ViewsByChart
                                    views={selectedVideo?.views}
                                    likes={selectedVideo?.likes}
                                    comments={selectedVideo?.comments}
                                />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent
                        value="channel"
                        className="w-full h-auto flex flex-col gap-5"
                    >
                        {/* first information section */}
                        <div className="flex flex-row gap-5">
                            {/* img section */}
                            <div className="w-2/12 rounded-full overflow-hidden">
                                <img
                                    src={channelImg}
                                    loading="lazy"
                                    alt="채널썸네일"
                                    className="w-full"
                                />
                            </div>

                            {/* detail section */}
                            <div className="w-6/12 flex flex-col justify-center items-start gap-3">
                                <h4 className="text-2xl">{channel}</h4>
                            </div>

                            {/* link section */}
                            <div className="w-4/12 flex justify-end items-center">
                                <a
                                    href={`https://www.youtube.com/channel/${selectedVideo?.channelId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-[#3aad6c] bg-white text-[#3aad6c] text-base hover:bg-[#3aad6c] hover:text-white transition-all duration-300 px-3 py-2 rounded-lg font-medium"
                                >
                                    유튜브에서 채널 보기
                                </a>
                            </div>
                        </div>

                        {/* second information section */}
                        <div className="w-full h-auto flex flex-row gap-5 mt-5">
                            <InfoCard
                                cardTitle="채널 설명"
                                cardContent={channelDes}
                            />
                            <InfoCard
                                cardTitle="구독자 수"
                                cardContent={channelSub}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
};

export default Detail;
