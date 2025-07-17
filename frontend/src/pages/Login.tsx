import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Login = ({ setLoginModal }) => {
    const {
        register, // 폼에 등록
        handleSubmit, // 제출 함수
        formState: { errors }, // 에러 정보
    } = useForm();

    const onSubmit = (data: any) => {
        console.log("폼 제출됨:", data);
    };

    return (
        <main
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto`}
        >
            <Card
                className={`overflow-x-hidden overflow-y-auto w-1/3 h-7/12 max-h-7/12 border borde-white bg-[#eeeeee] rounded-3xl relative flex flex-col justify-center items-start gap-2`}
            >
                {/* 닫기 버튼 */}
                <button
                    onClick={() => {
                        setLoginModal(false);
                    }}
                    className="absolute top-2 right-2 text-xl font-light text-[#3aad6c]"
                >
                    <FaTimes />
                </button>

                <CardHeader className="w-full flex flex-row justify-between items-start gap-5">
                    <div className="w-2/3 text-left">
                        <CardTitle>
                            <h3 className="text-lg font-semibold text-black">
                                Login to your account
                            </h3>
                        </CardTitle>
                        <CardDescription className="text-base text-[#9CA2A0]">
                            Enter your email below to login to your account
                        </CardDescription>
                    </div>
                    <div className="w-1/3 text-right">
                        <button className="text-lg font-semibold text-black underline transition-all duration-300 hover:text-[#868686]">
                            Sign Up
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="w-full">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col justify-center items-start gap-2"
                    >
                        <h3 className="font-semibold">E-mail</h3>
                        <input
                            className="w-full h-8 rounded-lg border border-[#c9cecc] p-2"
                            type="email"
                            {...register("email", {
                                required: "이메일은 필수입니다",
                                pattern: {
                                    value: /^[^@]+@[^@]+\.[^@]+$/,
                                    message: "이메일 형식이 올바르지 않아요",
                                },
                            })}
                            placeholder="이메일"
                        />
                        {errors.email && (
                            <p>{errors.email.message as string}</p>
                        )}

                        <h3 className="font-semibold">Password</h3>
                        <input
                            className="w-full h-8 rounded-lg border border-[#c9cecc] p-2"
                            {...register("password", {
                                required: "비밀번호는 필수입니다",
                            })}
                            placeholder="비밀번호"
                        />
                        {errors.username && (
                            <p>{errors.username.message as string}</p>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="w-full flex flex-col gap-1">
                    <button className="w-full btn" type="submit">
                        Login
                    </button>
                    
                    <hr className="border border-gray-400 my-5 w-full"/>

                    <button
                        className="w-full text-base text-white bg-black font-bold border border-black rounded-2xl transition-all duration-300 hover:text-[#3aad6c] hover:bg-white p-2"
                        type="submit"
                    >
                        Login with Google
                    </button>
                    <button
                        className="w-full text-base text-white bg-[#3aad6c] font-bold border border-[#3aad6c] rounded-2xl transition-all duration-300 hover:text-[#3aad6c] hover:bg-white p-2"
                        type="submit"
                    >
                        Login with GitHub
                    </button>
                </CardFooter>
            </Card>
        </main>
    );
};

export default Login;
