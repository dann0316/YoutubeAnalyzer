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

    const sortByViewsBtn = () => {
        const copy = [...videos];
        copy.sort((a,b) => b.views-a.views);
        setVideos(copy);
    }

    return (
        <div className="w-full p-24 ">
            {error && <p> 오류: {error ? error.message : null}</p>}

            <div className="flex flex-col justify-center items-center gap-5 border border-[#3aad6c] rounded-3xl p-5">

                <div className="w-1/3 flex flex-row justify-center items-center gap-5">
                    <button className="btn" onClick={() => sortByViewsBtn()}>
                        조회수 정렬
                    </button>
                </div>

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
