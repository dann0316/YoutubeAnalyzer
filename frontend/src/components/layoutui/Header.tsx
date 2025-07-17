import { useState, type ReactEventHandler } from "react";
import { FaSearch } from "react-icons/fa";
import Login from "../pageui/Login";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-[#3aad6c] flex justify-between items-center px-10 z-10">
            {/* 왼쪽 제목 */}
            <div className="w-1/3">
                <h3
                    className="text-3xl font-bold text-[#3aad6c] cursor-pointer uppercase"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Youtube Analyzer
                </h3>
            </div>

            {/* 가운데 로그인, 회원가입 */}
            <div className="w-1/3 flex flex-row justify-center items-center gap-5">
                <button
                    className="text-[#3aad6c] font-bold hover:underline transition-all duration-300 text-lg"
                    onClick={() => {
                        setLoginModal(true);
                    }}
                >
                    SignIn
                </button>
                <button className="text-[#3aad6c] font-bold hover:underline transition-all duration-300 text-lg" onClick={() => {
                    navigate('/signup')
                }}>
                    SingUp
                </button>
                {loginModal && <Login setLoginModal={setLoginModal} />}
            </div>

            {/* 오른쪽 검색창 */}
            <div className="w-1/3 relative flex flex-row justify-end items-center">
                <div className="w-1/2 flex flex-row justify-between items-center bg-[#3aad6c] rounded-lg p-2 gap-2">
                    <input
                        type="text"
                        placeholder="검색할 키워드"
                        value={keyword}
                        onChange={(e) => fetchSuggestions(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-lg h-8"
                    />

                    <button
                        onClick={() => fetchVideos()}
                        className="text-white"
                        aria-label="검색">
                        <FaSearch />
                    </button>

                    {/* 자동완성 목록 */}
                    <div className="absolute left-1/2 top-full w-1/2 bg-white z-20">
                        {suggestions.length > 0 && (
                            <ul className="border border-[#3aad6c] rounded-lg overflow-hidden">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onMouseEnter={() =>
                                            setSelectedIndex(index)
                                        }
                                        onClick={() => {
                                            setKeyword(suggestion);
                                            setSuggestions([]);
                                            fetchVideos();
                                        }}
                                        className="p-2 cursor-pointer border border-[#3aad6c]">
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
