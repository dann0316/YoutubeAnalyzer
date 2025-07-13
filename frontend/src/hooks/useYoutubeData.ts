import { useState } from "react";
import type { VideosType } from "../types/youtube.type";
// import { fetchYoutubeVideos } from "../utils/services";

export const useYoutubeData = (keyword: string) => {

    // 영상 정보 state
    const [videos, setVideos] = useState<VideosType[]>([]);
    // 데이터 더 보기 토큰 state
    const [nextPageToken, setNextPageToken] = useState<boolean | null>(null);
    // 에러 state
    const [error, setError] = useState<Error | null>(null);

    // 검색어 기반 영상 fetch 함수
    const fetchVideos = async (isNextPage = false) => {
        try {
            const url = `http://localhost:3000/api/videos?keyword=${keyword}${nextPageToken && isNextPage ? `&pageToken=${nextPageToken}` : ""
                }`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setVideos(
                    isNextPage ? [...videos, ...data.videos] : data.videos
                );
                setNextPageToken(data.nextPageToken || null);
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (err: unknown) {
            console.error(err);
        }
    };

    // const fetchVideos = async () => {
    //     const data = await fetchYoutubeVideos(keyword, nextPageToken)
    //     setVideos(data.videos)
    //     setNextPageToken(data.nextPageToken || null)
    // }

    return {
        fetchVideos,
        videos,
        setVideos,
        nextPageToken,
        error
    }
}