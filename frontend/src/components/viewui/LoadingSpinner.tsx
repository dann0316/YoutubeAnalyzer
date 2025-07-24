const LoadingSpinner = ({className}:{className?: string}) => {
    return (
        <div className={`border-8 border-[#7dffd8] border-t-transparent w-16 h-16 rounded-full animate-spin ${className}`}>

        </div>
    )
}

export default LoadingSpinner;