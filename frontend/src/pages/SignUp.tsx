import { useForm } from "react-hook-form";
import type { FormType } from "@/types/youtube.type";
import { auth } from "@/utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layoutui/MainLayout";

const SignUp = () => {
    const {
        register, // 폼에 등록
        handleSubmit, // 제출 함수
        formState: { errors, isSubmitting }, // 에러 정보
    } = useForm<FormType>();

    const navigate = useNavigate();

    const onSignUpSubmit = async (data: FormType) => {
        const { email, password, nickname } = data;

        try {
            // 1. Firebase Auth에 유저 등록
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // 2. 백엔드로 UID 전달 -> 백엔드에서는 Authentication에서 Firestore DB로 저장
            await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    password: password,
                    nickname: nickname,
                }),
            });
            alert("회원가입 성공!");
            navigate("/");
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
        <MainLayout>
            
            <h3 className="text-2xl font-bold text-black">
                Sign Up
            </h3>

            <form
                className="w-1/3 flex flex-col justify-center items-center gap-7"
                onSubmit={handleSubmit(onSignUpSubmit)}
            >
                {/* 이메일 section */}
                <div className="w-full flex flex-col justify-center items-center gap-1">
                    <label className="font-semibold text-lg">이메일</label>
                    <input
                        type="email"
                        className="w-full border border-black h-12 rounded-lg p-2"
                        placeholder="이메일은 필수입니다."
                        {...register("email", {
                            required: "이메일은 필수입니다",
                            pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "올바른 이메일 형식을 입력하세요",
                            },
                        })}
                    />
                    <p className="text-sm text-[#7d7d7d]">
                        이메일을 작성해주세요
                    </p>
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                {/* 비밀번호 section */}
                <div className="w-full flex flex-col justify-center items-center gap-1">
                    <label className="font-semibold text-lg">비밀번호</label>
                    <input
                        className="w-full border border-black h-12 rounded-lg p-2"
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
                    <p className="text-sm text-[#7d7d7d]">
                        비밀번호는 최소 6자 이상이어야 합니다
                    </p>
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <div className="w-full flex flex-col justify-center items-center gap-1">
                    <label className="font-semibold text-lg">닉네임</label>
                    <input
                        className="w-full border border-black h-12 rounded-lg p-2"
                        type="text"
                        {...register("nickname", {
                            minLength: {
                                value: 6,
                                message:
                                    "비밀번호는 최소 6자 이상이어야 합니다",
                            },
                        })}
                    />
                    <p className="text-sm text-[#7d7d7d]">
                        닉네임을 작성해주세요
                    </p>
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                {/* <div className="w-full flex flex-col justify-center items-center gap-1">
                        <label className="font-semibold text-lg">
                            비밀번호 확인
                        </label>
                        <input
                            className="w-full border border-black h-12 rounded-lg p-2"
                            type="password"
                            {...register("password", {
                                minLength: {
                                    value: 6,
                                    message:
                                        "비밀번호는 최소 6자 이상이어야 합니다",
                                },
                            })}
                        />
                        <p className="text-sm text-[#7d7d7d]">
                            비밀번호가 일치해야 합니다
                        </p>
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>

                    <div className="w-full flex flex-col justify-center items-center gap-1">
                        <label className="font-semibold text-lg">
                            닉네임
                        </label>
                        <input
                            className="w-full border border-black h-12 rounded-lg p-2"
                            type="password"
                            {...register("password", {
                                minLength: {
                                    value: 6,
                                    message:
                                        "비밀번호는 최소 6자 이상이어야 합니다",
                                },
                            })}
                        />
                        <p className="text-sm text-[#7d7d7d]">
                            닉네임을 작성해주세요
                        </p>
                        {errors.password && <p>{errors.password.message}</p>}
                    </div> */}

                <button className="btn" type="submit" disabled={isSubmitting}>
                    SignUp
                </button>
            </form>

            {/* 회원가입 설명 section */}
            <div className="text-sm text-[#7d7d7d]">
                * Youlytics 이용약관, 개인정보 수집 안내를 확인하고, 동의합니다.
            </div>
        </MainLayout>
    );
};

export default SignUp;
