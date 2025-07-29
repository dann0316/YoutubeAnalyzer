import { FaTimes } from "react-icons/fa";
import CardLayout from "../layoutui/CardLayout";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/stores/store";
import { useForm } from "react-hook-form";
import type { FormType } from "@/types/youtube.type";

const AddPoint = ({
    setAddPointModal,
}: {
    setAddPointModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { point, setPoint } = useUserStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormType>();

    const onAddPointSubmit = async () => {
        try {
            setPoint(point + 5);
            alert('충전 성공!')
        } catch (err) {
            alert("충전 실패");
            console.error(err);
        }
    };

    return (
        <CardLayout>
            {/* 닫기 버튼 */}
            <button
                onClick={() => {
                    setAddPointModal(false);
                }}
                className="absolute top-2 right-2 text-xl font-light text-[#3aad6c]"
            >
                <FaTimes />
            </button>

            <CardHeader className="w-full flex flex-col justify-center items-start gap-5">
                <CardTitle className="w-full flex flex-row justify-between items-center">
                    <h3 className="text-lg font-semibold text-black">
                        5 Points ReCharge
                    </h3>
                    <h3 className="text-base font-medium text-[#555555]">
                        현재 포인트: {point}
                    </h3>
                </CardTitle>

                <CardDescription className="text-base text-[#838685]">
                    포인트를 충전하시려면 아래에 '포인트 충전합니다'라고
                    입력해주세요!
                </CardDescription>
            </CardHeader>

            <CardContent className="w-full">
                <form
                    onSubmit={handleSubmit(onAddPointSubmit)}
                    className="flex flex-col justify-center items-start gap-3"
                >
                    <input
                        type="text"
                        className="w-full h-8 rounded-lg border border-[#c9cecc] p-2 transition duration-300 ease-in-out focus:ring-2 focus:ring-offset-0 focus:ring-primary"
                        // ring offset 중간 메꾸려면?
                        {...register("point", {
                            required:
                                "충전하시려면 해당 텍스트를 작성해주세요!",
                            pattern: {
                                value: /^포인트 충전합니다$/,
                                message: "텍스트가 일치하지 않습니다!",
                            },
                        })}
                        placeholder="포인트 충전합니다"
                    />
                    {errors.point && <p>{errors.point.message as string}</p>}

                    <button
                        className="w-full btn"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        충전
                    </button>
                </form>
            </CardContent>
            <CardFooter>
                <p>* 재충전은 하루에 2번만 가능합니다!</p>
            </CardFooter>
        </CardLayout>
    );
};

export default AddPoint;
