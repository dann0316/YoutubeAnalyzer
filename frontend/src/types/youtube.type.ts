export interface VideosType {
    videoId: string;
    thumbnail: string;
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    views: number;
    performanceScore: number;
    likes: number;
    comments: number;
}

export interface HomePropsType {
    error: Error | null;
    videos: VideosType[];
    setVideos: React.Dispatch<React.SetStateAction<VideosType[]>>;
    getPerformanceLabel: (score: number) => string;
    fetchVideos: (isNextPage?: boolean) => void;
    nextPageToken: boolean | null;
}