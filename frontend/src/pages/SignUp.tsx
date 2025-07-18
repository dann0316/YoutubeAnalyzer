// import SignUpCard from "@/components/viewui/SignUpCard";
import { useForm } from "react-hook-form";
import type { FormType } from "@/types/youtube.type";
import { auth } from "@/utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
    const {
        register, // 폼에 등록
        handleSubmit, // 제출 함수
        formState: { errors, isSubmitting }, // 에러 정보
    } = useForm<FormType>();

    const onSignUpSubmit = async (data: FormType) => {
        const { email, password } = data;

        try {
            // 1. Firebase Auth에 유저 등록
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // 2. 백엔드로 UID 전달
            await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, id: user.email }),
            });

            alert("회원가입 성공!");
        } catch (error) {
            alert("회원가입 실패");
            if (error instanceof Error) {
                console.log("회원가입 에러내용: ", error.message);
            } else {
                console.error("알 수 없는 에러:", error);
            }
        }
    };

    return (
        <main className="w-full p-24">
            <div className="flex flex-col justify-center items-center border border-[#3aad6c] rounded-3xl p-5 gap-10">
                <h3 className="text-2xl font-bold text-black">Sign Up</h3>

                <div className="w-full flex justify-center items-center flex-col">
                    <div className="w-1/2 flex flex-col justify-center items-center gap-8">
                        <form onSubmit={handleSubmit(onSignUpSubmit)}>
                            <div>
                                <label>이메일</label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "이메일은 필수입니다",
                                        pattern: {
                                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                            message:
                                                "올바른 이메일 형식을 입력하세요",
                                        },
                                    })}
                                />
                                {errors.email && <p>{errors.email.message}</p>}
                            </div>

                            <div>
                                <label>비밀번호</label>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "비밀번호는 필수입니다",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "비밀번호는 최소 6자 이상이어야 합니다",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p>{errors.password.message}</p>
                                )}
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                회원가입
                            </button>
                        </form>

                        <div>
                            YouTube Analyzer 이용약관, 개인정보 수집 안내를
                            확인하고, 동의합니다.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignUp;
