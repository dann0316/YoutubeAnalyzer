import SignUpCard from "@/components/viewui/SignUpCard";

const SignUp = () => {
    return (
        <main className="w-full p-24">
            <div className="flex flex-col justify-center items-center border border-[#3aad6c] rounded-3xl p-5 gap-10">
                <h3 className="text-2xl font-bold text-black">Sign Up</h3>

                <div className="w-full flex justify-center items-center flex-col">
                    <div className="w-1/2 flex flex-col justify-center items-center gap-8">

                        <SignUpCard SignUpCardTitle="ID" SignUpCardContent="* 아이디 6 ~ 20자"/>

                        <SignUpCard SignUpCardTitle="Password" SignUpCardContent="* 비밀번호 영문, 숫자 포함 8 ~ 20자"/>

                        <SignUpCard SignUpCardTitle="Password Check" SignUpCardContent=""/>

                        <SignUpCard SignUpCardTitle="닉네임" SignUpCardContent="* 닉네임 6 ~ 20자"/>

                        <button className="border-2 border-black w-full p-2 font-semibold rounded-xl bg-black text-white transition-all duration-300 hover:bg-white hover:text-black">
                            Sign Up
                        </button>

                        <div>
                            YouTube Analyzer 이용약관, 개인정보 수집 안내를 확인하고, 동의합니다.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignUp;
