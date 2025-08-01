const MainLayout = ({ children, gap}: { children: React.ReactNode, gap?:string }) => {
    return (
        <main className="w-full h-[100vh] px-24 pt-36 pb-20 bg-gray-50 flex-1">
            <div className={`shadow-md w-full h-full flex flex-col justify-start items-center border border-primary rounded-3xl p-5 gap-5 ${gap}`}>
                {children}
            </div>
        </main>
    );
};

export default MainLayout;
