import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { FormType } from "@/types/youtube.type";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import CardLayout from "../layoutui/CardLayout";

const LogIn = ({
    setLoginModal,
}: {
    setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormType>();

    const onSignInSubmit = async ({ email, password }: FormType) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);

            alert("로그인 성공");
            setLoginModal(false);

            // // 이건 선언한건지 실행한건 아니지않나? 변수형 함수, 익명함수 그거여서 바로실행인가?
            // const userCredential = await signInWithEmailAndPassword(
            //     auth,
            //     email,
            //     password
            // );
            // const user = userCredential.user;

            // const token = await user.getIdToken();
            // // 우선 알림 띄우고
            // alert("로그인 성공");

            // // 토근 전달
            // const response = await fetch("api/user-data", {
            //     method: "POST",
            //     headers : {
            //         "token": `${token}`,
            //         "Content-Type" : "application/json",
            //     }
            // });

            // // 응답 받기
            // // fetch의 결과는 Response 객체
            // // 응답의 body를 json 형식으로 파싱
            // const data = await response.json();
        } catch (err) {
            alert("로그인 정보를 다시 확인해주세요!");
            console.error(err);
        }
    };

    const navigate = useNavigate();

    return (
        <CardLayout>
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
                            Signin to your account
                        </h3>
                    </CardTitle>
                    <CardDescription className="text-base text-[#9CA2A0]">
                        Enter your email below to signin to your account
                    </CardDescription>
                </div>
                <div className="w-1/3 text-right">
                    <button
                        className="text-lg font-semibold text-black underline transition-all duration-300 hover:text-[#868686]"
                        onClick={() => {
                            setLoginModal(false);
                            navigate("/signup");
                        }}
                    >
                        SignUp
                    </button>
                </div>
            </CardHeader>

            <CardContent className="w-full">
                <form
                    onSubmit={handleSubmit(onSignInSubmit)}
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
                        placeholder="E-mail"
                    />
                    {errors.email && <p>{errors.email.message as string}</p>}

                    <div className="w-full flex flex-row justify-between items-center">
                        <h3 className="font-semibold">Password</h3>

                        <h3
                            className="font-normal text-black transition-all duration-300 hover:text-[#868686] cursor-pointer"
                            onClick={() => {}}
                        >
                            Forgot Password?
                        </h3>
                    </div>
                    <input
                        className="w-full h-8 rounded-lg border border-[#c9cecc] p-2"
                        {...register("password", {
                            required: "비밀번호는 필수입니다",
                        })}
                        placeholder="Password"
                    />
                    {errors.nickname && <p>{errors.nickname.message}</p>}

                    <button
                        className="w-full btn"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        SignIn
                    </button>
                </form>
            </CardContent>

            <CardFooter className="w-full flex flex-col gap-1">
                <hr className="border border-gray-400 my-5 w-full" />
                <button
                    className="w-full text-base text-white bg-black font-bold border border-black rounded-2xl transition-all duration-300 hover:text-black hover:bg-white p-2"
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
        </CardLayout>
    );
};

export default LogIn;
