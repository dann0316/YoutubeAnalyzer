import Buttons from "../components/Buttons";
import Card from "../components/Card";
import type { HomePropsType } from "../types/youtube.type";


const Home: React.FC<HomePropsType> = ({
    error,
    videos,
    getPerformanceLabel,
    fetchVideos,
    nextPageToken,
    setVideos
}) => {


    return (
        <div className="w-full p-24 ">
            {error && <p> 오류: {error ? error.message : null}</p>}

            <div className="flex flex-col justify-center items-center gap-5 border border-[#3aad6c] rounded-3xl p-5">

                <Buttons videos={videos} setVideos={setVideos}/>

                {videos.length > 0 ? (
                    videos.map((video, index) => (
                        <Card key={index} video={video} getPerformanceLabel={getPerformanceLabel}/>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
                {nextPageToken && (
                <button
                    onClick={() => fetchVideos(true)}
                    className="btn"
                >
                    load more
                </button>
            )}
            </div>
        </div>
    );
};

export default Home;
