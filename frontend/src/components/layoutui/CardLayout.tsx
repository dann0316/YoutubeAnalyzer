import { Card } from "@/components/ui/card";

const CardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto`}
        >
            <Card className="overflow-x-hidden overflow-y-auto w-1/4 h-7/12 max-h-7/12 border borde-white bg-[#eeeeee] rounded-3xl relative flex flex-col justify-center items-start gap-2">
                {children}
            </Card>
        </main>
    );
};

export default CardLayout;
