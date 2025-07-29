import MainLayout from "@/components/layoutui/MainLayout";
import { useState } from "react";
import type { NewsItemsType } from "@/types/youtube.type";

const Home = () => {
    const [news, setNews] = useState<NewsItemsType[]>([]);
    const [newsQuery, setNewsQuery] = useState<string>("");

    // const [trendKeyword, setTrendKeyword] = useState<string>("");

    const fetchTrend = async (input: string) => {
        if (!input.trim()) return;

        try {
            const response = await fetch(
                `http://localhost:3000/api/news?query=${input}`
            );
            const data = await response.json();
            // .json()가 뭐지 response를 json으로 만들어주는 건가
            // 외부 api에 보낼 때 뭘 어떻게 보낼지를 잘 봐야되고 header랑 body
            // 거기서 온 응답도 뭘 어떻게 받고 잘 봐야함  header랑 body
            setNews(data.items);
        } catch (err) {
            console.error(err);
        }
    };

    // useEffect(() => {
    //     fetchTrend(newsQuery);
    // }, [newsQuery]);

    return (
        <MainLayout>
            <div className="w-full flex flex-col justify-center items-start gap-2">
                <h3 className="text-2xl font-semibold text-black">
                    안녕하세요! 👋
                </h3>
                <p className="text-base font-normal text-gray-500">
                    오늘은 어떤 영상을 분석해볼까요?
                </p>
            </div>

            <div className="w-full flex flex-row justify-center items-start gap-5 border border-[#44cfa587] rounded-2xl p-5">
                <div className="w-1/2 flex flex-col justify-center items-start gap-2 border border-[#44cfa54b] rounded-2xl p-5">
                    <h3 className="text-xl font-semibold">
                        현재 인기 키워드 🚀
                    </h3>
                    <div>
                        {/* {trendKeyword} */}
                    </div>
                </div>

                <div className="w-1/2 flex flex-col justify-center items-start gap-2 border border-[#44cfa54b] rounded-2xl p-5">
                    <h3 className="text-xl font-semibold">현재 뉴스 📰</h3>
                    <input
                        type="text"
                        value={newsQuery}
                        onChange={(e) => setNewsQuery(e.target.value)}
                    />
                    <button onClick={() => fetchTrend(newsQuery)}>검색</button>
                    <ul className="flex flex-col gap-3 border border-secondary p-5 rounded-xl w-full">
                        {news.map((item, idx) => (
                            <li key={idx} className="border border-secondary rounded-md p-2 bg-white text-black hover:bg-secondary hover:text-white trnasition duration-300 cursor-pointer" title={`${item.title.replace(/<[^>]+>/g, "")}`}>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.title.replace(/<[^>]+>/g, "").length > 30 ? item.title.replace(/<[^>]+>/g, "").slice(0,30) + '...' : item.title.replace(/<[^>]+>/g, "")}
                                </a>
                                {/* <p
                                    dangerouslySetInnerHTML={{
                                        __html: item.description,
                                    }}
                                /> */}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="w-full flex flex-row justify-start items-center gap-5 border border-[#44cfa587] rounded-2xl p-5">
                <h3 className="text-xl font-semibold">최근 본 영상 ⌛</h3>
            </div>
        </MainLayout>
    );
};

export default Home;
