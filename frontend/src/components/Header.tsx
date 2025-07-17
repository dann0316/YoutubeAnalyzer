import { useState, type ReactEventHandler } from "react";
import { FaSearch } from "react-icons/fa";
import Login from "../pages/Login";

type HeaderPropsType = {
    keyword: string;
    fetchSuggestions: (input: string) => void;
    handleKeyDown: ReactEventHandler;
    fetchVideos: (isNextPage?: boolean) => void;
    suggestions: string[];
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
};

const Header: React.FC<HeaderPropsType> = ({
    keyword,
    fetchSuggestions,
    handleKeyDown,
    fetchVideos,
    suggestions,
    setSelectedIndex,
    selectedIndex,
    setKeyword,
    setSuggestions,
}) => {

    const [loginModal, setLoginModal] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-[#3aad6c] flex justify-between items-center px-6 z-10">
            {/* 왼쪽 제목 */}
            <h3 className="text-3xl font-bold text-[#3aad6c]">
                Youtube Analyzer
            </h3>

            {/* 가운데 로그인, 회원가입 */}
            <div className="flex flex-row justify-center items-center gap-10">
                <button className="text-[#3aad6c] font-bold hover:underline transition-all duration-300" onClick={() => {
                    setLoginModal(true);
                }}>
                    로그인
                </button>
                {
                    loginModal && <Login setLoginModal = {setLoginModal}/>
                }
            </div>

            {/* 오른쪽 검색창 */}
            <div className="relative">
                <div className="flex flex-row justify-between items-center bg-[#3aad6c] rounded-xl">
                    <input
                        type="text"
                        placeholder="검색할 키워드"
                        value={keyword}
                        onChange={(e) => fetchSuggestions(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border-2 border-[#3aad6c] h-10 rounded-xl"
                    />

                    <button
                        onClick={() => fetchVideos()}
                        className="text-white"
                        aria-label="검색"
                    >
                        <FaSearch />
                    </button>
                </div>

                {/* ✅ 자동완성 목록 */}
                <div className="absolute left-0 top-full mt-1 w-full bg-white z-20">
                    {suggestions.length > 0 && (
                        <ul className="border-2 border-[#3aad6c]">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    onClick={() => {
                                        setKeyword(suggestion);
                                        setSuggestions([]);
                                        fetchVideos();
                                    }}
                                    style={{
                                        padding: "8px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee",
                                        background:
                                            selectedIndex === index
                                                ? "#f0f0f0"
                                                : "transparent", // ✅ 선택된 항목 강조
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

        </header>
    );
};

export default Header;
