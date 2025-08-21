import { Skeleton } from "../ui/skeleton";

const ListSkeleton = () => {
    return (
        <Skeleton className="w-full h-auto rounded-3xl bg-primary/20 flex flex-row justify-center items-center gap-2 py-3 px-2">
            <Skeleton className="w-1/12 h-12 bg-primary/40 rounded-2xl" />
            <Skeleton className="w-2/12 h-28 bg-primary/40 rounded-2xl" />
            <Skeleton className="w-3/12 h-12 bg-primary/40 rounded-2xl" />
            <Skeleton className="w-2/12 h-12 bg-primary/40 rounded-2xl" />
            <Skeleton className="w-2/12 h-12 bg-primary/40 rounded-2xl" />
            <Skeleton className="w-2/12 h-12 bg-primary/40 rounded-2xl" />
        </Skeleton>
    );
};

export default ListSkeleton;
