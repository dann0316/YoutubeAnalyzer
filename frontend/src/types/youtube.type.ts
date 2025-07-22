export interface VideosType {
    videoId: string;
    thumbnail: string;
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    channelId: string;
    views: number;
    performanceScore: number;
    likes: number;
    comments: number;

    // setModal:
}

export interface ListPropsType {
    error: Error | null;
    videos: VideosType[];
    setVideos: React.Dispatch<React.SetStateAction<VideosType[]>>;
    getPerformanceLabel: (score: number) => string;
    fetchVideos: (isNextPage?: boolean) => void;
    nextPageToken: boolean | null;
}

export interface storeType {
    videos: VideosType[]
    nextPageToken: string | null
    setVideos: (videos: VideosType[]) => void
    setNextPageToken: (token: string | null) => void
    keyword: string
    setKeyword: React.Dispatch<React.SetStateAction<string>>
}

export interface FormType {
    id:string;
    email: string;
    password: string;
    nickname: string;
}