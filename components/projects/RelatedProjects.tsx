import Link from "next/link";
import { getUserProjects } from "@/actions/project";
import { getUserById } from "@/actions/user";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import UserProjectsCard from "@/components/projects/UserProjectsCard";
import { ProjectDetails } from "@/types";

interface RelatedProjectsProps {
  userId: string;
  projectId: string;
}

const RelatedProjects = async ({ userId, projectId }: RelatedProjectsProps) => {
  // Fetch user projects and author details
  const userProjects = await getUserProjects(userId, 1);
  const author = await getUserById(userId);

  // Filter out the current project from the user's projects
  const filteredProjects = userProjects?.projects.filter(
    (project: ProjectDetails) => project.id !== projectId
  );

  // If no projects are left after filtering, return null
  if (!filteredProjects || filteredProjects.length === 0) return null;

  return (
    <section className="flex flex-col mt-8 w-full max-w-4xl">
      {/* Header with author name and link to view all projects */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-md md:text-lg font-semibold">More by {author?.name}</p>
        <Link href={`/profile/${author?.id}`} className="text-purple-600 text-sm md:text-lg">
          View All
        </Link>
      </div>

      {/* Carousel for displaying related projects */}
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-4xl"
      >
        <CarouselContent className="px-3">
          {filteredProjects.map((project: ProjectDetails) => (
            <CarouselItem
              key={project.id}
              className="md:basis-1/2 lg:basis-1/3 mr-1"
            >
              <UserProjectsCard project={project} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:block" />
        <CarouselNext className="hidden md:block" />
      </Carousel>
    </section>
  );
};

export default RelatedProjects;
