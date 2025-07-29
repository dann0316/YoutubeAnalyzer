import { useEffect, useState, type ReactEventHandler } from "react";
import { FaSearch } from "react-icons/fa";
import LogIn from "../pageui/LogIn";
import { useNavigate } from "react-router-dom";
import logo from "@/imgs/logo.png";
import { getAuth, onAuthStateChanged, type User, signOut } from "firebase/auth";
import { useUserStore } from "@/stores/store";

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

    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, []);

    const { nickname, point, setPoint } = useUserStore();

    return (
        <header className="fixed top-0 left-0 w-full h-28 bg-gray-50 border-b border-primary flex justify-between items-center px-10 z-10 shadow-md">
            {/* 왼쪽 제목 */}
            <div className="w-1/3 flex flex-row justify-start items-center">
                <div
                    className="w-auto h-12 cursor-pointer"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <img src={logo} alt="logo" className="w-auto h-full" />
                </div>
            </div>

            {/* 가운데 검색창 */}
            <div className="w-1/3 relative flex flex-row justify-center items-center">
                <div className="group w-2/3 flex flex-row justify-between items-center bg-primary rounded-lg p-4 gap-2 group-focus-within:bg-blue-500 transition-all duration-300">
                    <input
                        type="text"
                        placeholder="검색할 키워드"
                        value={keyword}
                        onChange={(e) => fetchSuggestions(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={(e) => {
                            if (!user) {
                                alert("로그인 후 이용해주세요!");
                                e.target.blur();
                            }
                        }}
                        className="w-full rounded-lg h-10 px-2 text-base font-medium"
                    />

                    <button
                        onClick={() => {
                            if (point > 0) {
                                alert("포인트가 1 차감됩니다!");
                                setPoint(point - 1);
                                fetchVideos();
                                navigate("/list");
                            } else {
                                alert("포인트가 부족합니다!");
                            }
                        }}
                        className="text-white"
                        aria-label="검색"
                    >
                        <FaSearch />
                    </button>

                    {/* 자동완성 목록 */}
                    <div className="absolute top-full left-28 w-[58%] bg-white z-20">
                        {suggestions.length > 0 && (
                            <ul className="border-4 border-primary rounded-lg overflow-hidden">
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
                                        className="p-2 cursor-pointer border border-primary transition duration-300 bg-white hover:bg-primary text-black hover:text-white"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* 오른쪽 로그인, 회원가입 */}

            <div className="w-1/3 flex flex-row justify-end items-center gap-2">
                {user ? (
                    <>
                        <h3 className="text-primary font-medium text-lg">
                            Hello! {nickname}
                        </h3>
                        <h3 className="text-primary">|</h3>
                        <button
                            className="text-primary font-bold transition-all duration-300 ease-in-out text-lg bg-white px-1 rounded-lg border-2 border-white hover:bg-[#dadadabe] hover:border-[#dadadabe]"
                            onClick={() => {
                                signOut(auth)
                                    .then(() => {
                                        alert("로그아웃 완료");
                                        console.log("로그아웃 완료");
                                    })
                                    .catch((error) => {
                                        console.error("로그아웃 실패", error);
                                    });
                            }}
                        >
                            SignOut
                        </button>
                        <button
                            className="text-primary font-bold transition-all duration-300 ease-in-out text-lg bg-white px-1 rounded-lg border-2 border-white hover:bg-[#dadadabe] hover:border-[#dadadabe]"
                            onClick={() => {
                                navigate("/mypage");
                            }}
                        >
                            MyPage
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="text-primary font-bold transition-all duration-300 ease-in-out text-lg bg-white px-1 rounded-lg border-2 border-white hover:bg-[#dadadabe] hover:border-[#dadadabe]"
                            onClick={() => {
                                setLoginModal(true);
                            }}
                        >
                            SignIn
                        </button>
                        <button
                            className="text-white font-bold transition-all duration-300 text-lg border-2 border-primary bg-primary px-1 rounded-lg hover:bg-white hover:text-primary"
                            onClick={() => {
                                navigate("/signup");
                            }}
                        >
                            SingUp
                        </button>
                        {loginModal && <LogIn setLoginModal={setLoginModal} />}
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
