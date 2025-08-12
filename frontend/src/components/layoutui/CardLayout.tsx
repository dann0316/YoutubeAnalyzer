const CardLayout = ({ children}: { children: React.ReactNode,}) => {
    return (
        <main
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto`}
        >
            {children}
        </main>
    );
};

export default CardLayout;
