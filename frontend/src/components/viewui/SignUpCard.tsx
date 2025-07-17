const SignUpCard = ({SignUpCardTitle,  SignUpCardContent } :{SignUpCardTitle: string, SignUpCardContent: string}) => {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-1">
            <h3 className="font-semibold text-lg">{SignUpCardTitle}</h3>
            <input
                type="text"
                className="w-full border border-black h-12 rounded-lg p-2"
                placeholder={`${SignUpCardTitle} (required)`}
            />
            <p className="text-sm text-[#7d7d7d]">{SignUpCardContent}</p>
        </div>
    );
};

export default SignUpCard;
