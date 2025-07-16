const infoCard = ({cardTitle, cardContent, className}: {
    cardTitle: string,
    cardContent: string | number,
    className?: string,
}) => {
    return (
        <div className={`rounded-lg bg-[#fefefe] border border-[#ddd] w-1/2 p-5 flex flex-col justify-between items-start gap-2 ${className}`}>
            <h3 className="text-base">
                {cardTitle}
            </h3>
            <p className="text-sm">
                {cardContent}
            </p>
        </div>
    );
};

export default infoCard;
