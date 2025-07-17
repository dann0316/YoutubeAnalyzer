import type { HomePropsType } from "../types/youtube.type";

const Buttons = ({videos, setVideos}: HomePropsType) => {

    const sortByViews = () => {
        const copy = [...videos];
        copy.sort((a,b) => b.views-a.views);
        setVideos(copy);
    }

    const sortByViewsReverse = () => {
        const copy = [...videos];
        copy.sort((a,b) => a.views-b.views);
        setVideos(copy);
    }

    return (
        <div className="w-1/3 flex flex-row justify-center items-center gap-5">
                    <button className="btn" onClick={() => sortByViews()}>
                        조회수 정렬
                    </button>
                    <button className="btn" onClick={() => sortByViewsReverse()}>
                        조회수 역정렬
                    </button>
                </div>
    )
}

export default Buttons;