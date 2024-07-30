import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailsCardSkeleton = () => {
  return (
    <section className="flex flex-col items-center mt-8 space-y-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <Skeleton className="h-[200px] w-[350px] md:h-[300px] md:w-[900px] rounded-t-lg" />
        <div className="p-6">
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-7 w-full max-w-xl mb-4" />
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <div className="flex justify-between items-center p-6 bg-[#e2e8f5]">
          <Skeleton className="h-8 w-48 bg-white" />
          <Skeleton className="h-8 w-8 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailsCardSkeleton;


