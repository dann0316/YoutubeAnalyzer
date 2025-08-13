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

export type AvatarChoice = "upload" | "male" | "female";

export interface FormType {
    id: string;
    email: string;
    password: string;
    nickname: string;
    point: string;
    avatar?: FileList;        // 업로드 파일
    avatarChoice: AvatarChoice; // 선택 모드
}

export interface NewsItemsType {
    title: string;
    link: string;
    description: string;
}

export interface UserStoreType {
    uid: string;
    token: string;
    email: string;
    nickname: string;
    point: number;
    role: "user" | "admin" | ""; // 권한 미확인시 ""
    setUser: (user: { 
        uid: string;
        token: string;
        email: string;
        nickname: string;
        point: number;
        role: "user" | "admin"; }) => void;
    clearUser: () => void;
    setPoint: (value: number) => void;
}