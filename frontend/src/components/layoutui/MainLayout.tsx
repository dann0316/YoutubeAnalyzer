const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="w-full min-h-screen px-24 py-28 bg-gray-50">
            <div className="flex flex-col justify-center items-center gap-5 border border-primary rounded-3xl p-5">
                {children}
            </div>
        </main>
    );
};

export default MainLayout;
