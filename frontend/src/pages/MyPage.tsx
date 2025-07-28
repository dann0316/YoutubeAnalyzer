import MainLayout from "@/components/layoutui/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/stores/store";

const MyPage = () => {

    const { nickname, point, role, email} = useUserStore();

    return (
        <MainLayout gap={"gap-14"}>
            <h3 className="text-2xl font-bold text-black">My Page</h3>
            <Tabs
                defaultValue="account"
                className="border border-line w-full rounded-3xl flex flex-row justify-center items-center overflow-hidden"
            >
                <TabsList className="flex flex-col w-1/6 h-[40em] bg-white m-0 p-0 border-r border-line rounded-none">

                    <div className="w-full h-3/5 flex flex-col justify-center items-center border-b border-line">
                        <div className="flex flex-col justify-center items-center gap-5">

                            {/* empty section */}
                            <div>

                            </div>

                            {/* user information section */}
                            <div className="text-black flex flex-col justify-center items-center gap-5">
                                <div className="border border-black w-28 h-28 rounded-full ">
                                    {/* <img src="" alt="" className="w-full h-full" /> */}
                                </div>
                                <div className="flex flex-col  justify-center items-center ">
                                    <h3 className="text-xl font-semibold">
                                        {nickname} ({role})
                                    </h3>
                                    <p>{email}</p>
                                    <p>point: {point}</p>
                                </div>
                            </div>

                            {/* trigger section */}
                            <TabsTrigger
                                value="account"
                                className="border border-gray-600 bg-gray-600 text-white text-sm rounded-3xl hover:text-gray-600 hover:bg-white transition duration-300 ease-in-out data-[state=active]:bg-black data-[state=active]:text-white"
                            >
                                프로필 수정
                            </TabsTrigger>
                            
                        </div>
                    </div>

                    <div className="w-full h-2/5 flex flex-col justify-center items-center">
                        <div className="flex flex-col justify-center items-start gap-3">
                            <TabsTrigger value="videoManageMent" className="TabsTrigger">
                                영상 관리
                            </TabsTrigger>
                            <TabsTrigger value="something" className="TabsTrigger">
                                뭐 관리
                            </TabsTrigger>
                        </div>
                    </div>

                </TabsList>

                <div className="w-5/6">
                    <TabsContent value="account" className="flex flex-col justify-center items-center">
                        <div>
                            현재 포인트: {point}
                        </div>
                        <button className="btn">포인트 충전</button>

                    </TabsContent>
                    <TabsContent value="videoManageMent">
                        videoManageMent
                    </TabsContent>
                    <TabsContent value="something">
                        something
                    </TabsContent>
                </div>
            </Tabs>
        </MainLayout>
    );
};

export default MyPage;
