import { useEffect, useState, type ReactEventHandler } from "react";
import {
    FaSearch,
    FaHome,
    FaListUl,
    FaChartBar,
    FaRegFileAlt,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { getAuth, onAuthStateChanged, type User, signOut } from "firebase/auth";
import { useKeywordStore, useUserStore } from "@/stores/store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuUser, LuLogIn, LuLogOut, LuUserPlus } from "react-icons/lu";

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
    setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderPropsType> = ({
    fetchSuggestions,
    handleKeyDown,
    fetchVideos,
    suggestions,
    setSelectedIndex,
    // selectedIndex,
    setSuggestions,
    setLoginModal,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const auth = getAuth();

    const { keyword } = useKeywordStore();
    const setKeyword = useKeywordStore((state) => state.setKeyword);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                navigate("/");
            }
        });

        return () => unsubscribe();
    }, []);

    const { nickname, point, email, setPoint } = useUserStore();

    const location = useLocation(); // 현재 경로 가져오기

    return (
        <header className="fixed top-0 left-0 w-full h-28 bg-gray-50 border-b border-primary flex justify-between items-center px-10 z-10 shadow-md">
            {/* logo section */}
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

            {/* nav section */}
            <nav className="w-1/3 relative flex flex-row justify-center items-center gap-5 text-primary text-lg font-bold uppercase">
                <Link
                    to={"/"}
                    className={`flex flex-row justify-center items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary hover:text-gray-50 transition-all duration-300 ease-in-out
                        ${
                            location.pathname === "/"
                                ? "bg-primary text-white"
                                : "bg-gray-50 text-primary"
                        }
                        `}
                >
                    <FaHome />
                    home
                </Link>
                <Link
                    to={"/list"}
                    className={`flex flex-row justify-center items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary hover:text-gray-50 transition-all duration-300 ease-in-out
                        ${
                            location.pathname === "/list"
                                ? "bg-primary text-white"
                                : "bg-gray-50 text-primary"
                        }
                        `}
                >
                    <FaListUl />
                    list
                </Link>
                <Link
                    to={"/analyze"}
                    className={`flex flex-row justify-center items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary hover:text-gray-50 transition-all duration-300 ease-in-out
                        ${
                            location.pathname === "/analyze"
                                ? "bg-primary text-white"
                                : "bg-gray-50 text-primary"
                        }
                        `}
                >
                    <FaChartBar />
                    analyze
                </Link>
                <a
                    href="https://zesty-library-b94.notion.site/How-To-Use-Youlytics-2428158d0e208059a140dca7eb668b7f?pvs=143"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row justify-center items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 hover:bg-primary hover:text-white transition-all duration-300 ease-in-out"
                >
                    <FaRegFileAlt />
                    usage
                </a>
            </nav>

            {/* 검색창, auth section */}
            <div className="w-1/3 flex flex-row justify-end items-center gap-5 relative">
                {user ? (
                    <>
                        <div className="group w-2/3 flex flex-row justify-between items-center bg-primary rounded-lg p-4 gap-2 group-focus-within:bg-blue-500 transition-all duration-300">
                            <input
                                type="text"
                                placeholder="검색할 키워드"
                                value={keyword}
                                onChange={(e) =>
                                    fetchSuggestions(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                // onFocus={(e) => {
                                //     if (!user) {
                                //         alert("로그인 후 이용해주세요!");
                                //         e.target.blur();
                                //     }
                                // }}
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
                            <div className="absolute top-full left-40 w-[58%] bg-white z-20">
                                {suggestions.length > 0 && (
                                    <ul className="border-4 border-primary rounded-lg overflow-hidden">
                                        {suggestions.map(
                                            (suggestion, index) => (
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
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    Hello!
                                    <h3 className="text-lg">{nickname}</h3>
                                    <p className="text-sm text-[#adadad]">
                                        {email}
                                    </p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        className="text-primary font-bold transition-all duration-300 ease-in-out text-lg bg-white px-1 rounded-lg border-2 border-white hover:bg-[#dadadabe] hover:border-[#dadadabe] cursor-pointer"
                                        onClick={() => {
                                            signOut(auth)
                                                .then(() => {
                                                    alert("로그아웃 완료");
                                                    console.log(
                                                        "로그아웃 완료"
                                                    );
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        "로그아웃 실패",
                                                        error
                                                    );
                                                });
                                        }}
                                    >
                                        <LuLogOut />
                                        SignOut
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-primary font-bold transition-all duration-300 ease-in-out text-lg bg-white px-1 rounded-lg border-2 border-white hover:bg-[#dadadabe] hover:border-[#dadadabe] cursor-pointer"
                                        onClick={() => {
                                            navigate("/mypage");
                                        }}
                                    >
                                        <LuUser /> MyPage
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <>
                        <button
                            className="text-primary font-bold transition-all duration-300 ease-in-out text-lg bg-white px-1 rounded-lg border-2 border-white hover:bg-[#dadadabe] hover:border-[#dadadabe] flex flex-row justify-center items-center gap-2"
                            onClick={() => {
                                setLoginModal(true);
                            }}
                        >
                            <LuLogIn />
                            SignIn
                        </button>
                        <button
                            className="text-primary font-bold transition-all duration-300 ease-in-out text-lg bg-white px-1 rounded-lg border-2 border-white hover:bg-[#dadadabe] hover:border-[#dadadabe] flex flex-row justify-center items-center gap-2"
                            onClick={() => {
                                navigate("/signup");
                            }}
                        >
                            <LuUserPlus />
                            SingUp
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
