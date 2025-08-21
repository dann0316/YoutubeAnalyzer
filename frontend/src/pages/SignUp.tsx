import { useForm } from "react-hook-form";
import type { FormType } from "@/types/youtube.type";
import { auth, storage } from "@/utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layoutui/MainLayout";
import LoadingSpinner from "@/components/viewui/LoadingSpinner";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import ProfileImgUpload from "@/components/authui/ProfileImgUpload";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        resetField,
        formState: { errors, isSubmitting },
    } = useForm<FormType>({
        mode: "onChange",
        defaultValues: { avatarChoice: "upload" }, // ⬅️ 기본값
    });

    const navigate = useNavigate();
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const onSignUpSubmit = async (data: FormType) => {
        const { email, password, nickname, avatar } = data;

        try {
            // 1) Auth 계정 생성
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // 2) 이미지가 있으면 업로드
            let photoURL: string | undefined;
            const file = avatar?.[0];
            if (file) {
                // 파일 타입/사이즈 기본 검증 (추가 안전장치)
                if (
                    !["image/png", "image/jpeg", "image/webp"].includes(
                        file.type
                    )
                ) {
                    setError("avatar", {
                        message: "PNG/JPG/WEBP만 업로드 가능합니다.",
                    });
                    throw new Error("Invalid image type");
                }
                if (file.size > 2 * 1024 * 1024) {
                    // 2MB
                    setError("avatar", {
                        message: "이미지 용량은 최대 2MB까지 허용합니다.",
                    });
                    throw new Error("Image too large");
                }

                const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
                const storageRef = ref(
                    storage,
                    `users/${user.uid}/avatar.${ext}`
                );
                const task = uploadBytesResumable(storageRef, file, {
                    contentType: file.type,
                });

                // 진행률 표시
                const url = await new Promise<string>((resolve, reject) => {
                    task.on(
                        "state_changed",
                        (snap) => {
                            const pct = Math.round(
                                (snap.bytesTransferred / snap.totalBytes) * 100
                            );
                            setUploadProgress(pct);
                        },
                        reject,
                        async () =>
                            resolve(await getDownloadURL(task.snapshot.ref))
                    );
                });
                photoURL = url;
            }

            // 3) Auth 프로필 업데이트
            await updateProfile(user, { displayName: nickname, photoURL });

            // 4) 백엔드 저장 (비밀번호는 절대 보내지 마세요)
            await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    email,
                    nickname,
                    photoURL,
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
        <MainLayout className="">
            <h3 className="text-2xl font-bold text-black">Sign Up</h3>

            <form
                className="w-2/3 flex flex-row justify-center items-center"
                onSubmit={handleSubmit(onSignUpSubmit)}
            >
                {/* 프로필 이미지(선택) section */}
                <ProfileImgUpload
                    register={register}
                    watch={watch}
                    resetField={resetField}
                    errors={errors}
                    uploadProgress={uploadProgress}
                />
                <div className="w-1/2 flex flex-col justify-center items-center gap-8">
                    {/* 이메일 section */}
                    <div className="w-full flex flex-col justify-center items-center gap-3">
                        <label className="font-semibold text-lg">이메일*</label>
                        <input
                            type="email"
                            className="w-full border border-line h-12 rounded-lg p-2"
                            placeholder="이메일은 필수입니다."
                            {...register("email", {
                                required: "이메일은 필수입니다",
                                pattern: {
                                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                    message: "올바른 이메일 형식을 입력하세요",
                                },
                            })}
                        />
                        {errors.email && <p className="text-sm text-[#7d7d7d]">{errors.email.message}</p>}
                    </div>

                    {/* 비밀번호 section */}
                    <div className="w-full flex flex-col justify-center items-center gap-3">
                        <label className="font-semibold text-lg">
                            비밀번호*
                        </label>
                        <input
                            className="w-full border border-line h-12 rounded-lg p-2"
                            placeholder="비밀번호는 필수입니다."
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
                        {errors.password && <p className="text-sm text-[#7d7d7d]">{errors.password.message}</p>}
                    </div>

                    {/* 닉네임 section */}
                    <div className="w-full flex flex-col justify-center items-center gap-3">
                        <label className="font-semibold text-lg">닉네임*</label>
                        <input
                            className="w-full border border-line h-12 rounded-lg p-2"
                            placeholder="닉네임은 필수입니다."
                            type="text"
                            {...register("nickname", {
                                required: "닉네임은 필수입니다",
                                minLength: {
                                    value: 2,
                                    message:
                                        "닉네임는 최소 2자 이상이어야 합니다",
                                },
                            })}
                        />
                        {errors.nickname && <p className="text-sm text-[#7d7d7d]">{errors.nickname.message}</p>}
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
                    */}

                    <button className="btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <LoadingSpinner /> : "SignUp"}
                </button>
                </div>

                
            </form>

            {/* 회원가입 설명 section */}
            <div className="text-sm text-[#7d7d7d]">
                * Youlytics 이용약관, 개인정보 수집 안내를 확인하고, 동의합니다.
            </div>
        </MainLayout>
    );
};

export default SignUp;
