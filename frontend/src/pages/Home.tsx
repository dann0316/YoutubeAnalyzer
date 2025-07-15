import { useEffect, useState } from "react";
import Buttons from "../components/Buttons";
import Card from "../components/Card";
import type { HomePropsType, VideosType } from "../types/youtube.type";
import Detail from "./Detail";

const Home: React.FC<HomePropsType> = ({
  error,
  videos,
  getPerformanceLabel,
  fetchVideos,
  nextPageToken,
  setVideos,
}) => {
  const [modal, setModal] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState<VideosType | null>(null);

  return (
    <main className="w-full p-24 ">
      {error && <p> 오류: {error ? error.message : null}</p>}

      <div className="flex flex-col justify-center items-center gap-5 border border-[#3aad6c] rounded-3xl p-5">
        <Buttons videos={videos} setVideos={setVideos} />

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

        <Detail modal={modal} setModal={setModal} selectedVideo={selectedVideo}/>

        {nextPageToken && (
          <button onClick={() => fetchVideos(true)} className="btn">
            load more
          </button>
        )}
      </div>
    </main>
  );
};

export default Home;
