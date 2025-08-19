// src/components/form/ProfileImgUpload.tsx
import { useEffect, useState } from "react";
import type {
    FieldErrors,
    UseFormRegister,
    UseFormResetField,
    UseFormWatch,
} from "react-hook-form";
import { IoPersonAddOutline } from "react-icons/io5";
import type { FormType } from "@/types/youtube.type";

type Props = {
    register: UseFormRegister<FormType>;
    watch: UseFormWatch<FormType>;
    resetField: UseFormResetField<FormType>;
    errors: FieldErrors<FormType>;
    uploadProgress: number;
};

const DEFAULT_AVATARS = {
    male: "/default-m-img.png",
    female: "/default-w-img.png",
};

export default function ProfileImgUpload({
    register,
    watch,
    resetField,
    errors,
    uploadProgress,
}: Props) {
    const avatarChoice = watch("avatarChoice");
    const avatarFiles = watch("avatar");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (avatarChoice === "upload") {
            const file = avatarFiles?.[0];
            if (!file) {
                setPreviewUrl(null);
                return;
            }
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (avatarChoice === "male") {
            setPreviewUrl(DEFAULT_AVATARS.male);
        } else if (avatarChoice === "female") {
            setPreviewUrl(DEFAULT_AVATARS.female);
        }
    }, [avatarChoice, avatarFiles]);

    return (
        <div className="w-1/2 flex flex-col items-center gap-8">
            <label className="font-semibold text-lg">
                프로필 이미지 (선택)
            </label>

            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="미리보기"
                    className="w-40 h-40 rounded-full object-cover border"
                />
            ) : (
                <label
                    htmlFor="avatar"
                    className="w-40 h-40 rounded-full border border-gray-500 flex flex-col justify-center items-center gap-2 p-3  bg-white cursor-pointer transition duration-300 ease-in-out hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                    <IoPersonAddOutline className="w-10 h-10" />
                </label>
            )}

            <div className="flex items-center justify-center gap-5">
                <input
                    type="radio"
                    id="choice-upload"
                    value="upload"
                    className="sr-only peer/upload"
                    {...register("avatarChoice")}
                />
                <label
                    htmlFor="choice-upload"
                    className={`px-3 py-1 rounded-full border cursor-pointer select-none ${
                        avatarChoice === "upload"
                            ? "bg-black text-white border-black"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    업로드
                </label>

                <input
                    type="radio"
                    id="choice-male"
                    value="male"
                    className="sr-only peer/male"
                    {...register("avatarChoice")}
                />
                <label
                    htmlFor="choice-male"
                    className={`px-3 py-1 rounded-full border cursor-pointer select-none ${
                        avatarChoice === "male"
                            ? "bg-black text-white border-black"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    기본(남)
                </label>

                <input
                    type="radio"
                    id="choice-female"
                    value="female"
                    className="sr-only peer/female"
                    {...register("avatarChoice")}
                />
                <label
                    htmlFor="choice-female"
                    className={`px-3 py-1 rounded-full border cursor-pointer select-none ${
                        avatarChoice === "female"
                            ? "bg-black text-white border-black"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    기본(여)
                </label>
            </div>

            {/* 이미지 압축이 안맞으면 압축해주는 사이트로 이동버튼도 하나 만들기 */}
            {avatarChoice === "upload" && (
                <>
                    <input
                        className="sr-only"
                        type="file"
                        id="avatar"
                        accept="image/png, image/jpeg, image/webp"
                        {...register("avatar", {
                            validate: {
                                fileType: (files) =>
                                    avatarChoice !== "upload" ||
                                    !files?.[0] ||
                                    [
                                        "image/png",
                                        "image/jpeg",
                                        "image/webp",
                                    ].includes(files[0].type) ||
                                    "PNG/JPG/WEBP만 업로드 가능합니다.",
                                fileSize: (files) =>
                                    avatarChoice !== "upload" ||
                                    !files?.[0] ||
                                    files[0].size <= 2 * 1024 * 1024 ||
                                    "최대 2MB까지 업로드 가능",
                            },
                        })}
                    />

                    {avatarFiles?.[0] && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-700">
                                {avatarFiles[0].name}
                            </span>
                            <button
                                type="button"
                                className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                                onClick={() => resetField("avatar")}
                            >
                                지우기
                            </button>
                        </div>
                    )}

                    {errors.avatar && (
                        <p className="text-red-600 text-sm">
                            {String(errors.avatar.message)}
                        </p>
                    )}
                </>
            )}

            {uploadProgress > 0 &&
                uploadProgress < 100 &&
                avatarChoice === "upload" && (
                    <div className="w-full">
                        <div className="h-2 w-full bg-gray-200 rounded">
                            <div
                                className="h-2 rounded bg-black"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-[#7d7d7d] mt-1">
                            {uploadProgress}%
                        </p>
                    </div>
                )}
        </div>
    );
}
