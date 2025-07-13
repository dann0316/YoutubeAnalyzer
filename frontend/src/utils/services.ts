// 검색어 기반 영상 fetch 함수
    export const fetchYoutubeVideos = async (isNextPage = false,keyword: string, nextPageToken:boolean) => {
        try {
            const url = `http://localhost:3000/api/videos?keyword=${keyword}${nextPageToken && isNextPage ? `&pageToken=${nextPageToken}` : ""
                }`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                return data;
            }
        } catch (err: unknown) {
            console.error(err);
        }
    };