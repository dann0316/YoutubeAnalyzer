const MainLayout = ({ children, gap}: { children: React.ReactNode, gap?:string }) => {
    return (
        <main className="w-full min-h-screen px-24 py-28 bg-gray-50">
            <div className={`flex flex-col justify-center items-center border border-primary rounded-3xl p-5 gap-5 ${gap}`}>
                {children}
            </div>
        </main>
    );
};

export default MainLayout;
