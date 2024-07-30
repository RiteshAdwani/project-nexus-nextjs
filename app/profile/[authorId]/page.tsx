import { getUserProjects } from "@/actions/project";
import UserProjectsCard from "@/components/projects/UserProjectsCard";
import Image from "next/image";
import { ProjectDetails } from "@/types";
import LoadMoreProjects from "@/components/projects/LoadMoreProjects";
import { getUserById } from "@/actions/user";

interface UserDetailsPageProps {
  params: {
    authorId: string;
  };
}

const AuthorProfilePage = async ({ params }: UserDetailsPageProps) => {
  // Fetch author details using the provided authorId
  const authorDetails = await getUserById(params.authorId);

  // Initialize page number and fetch user projects
  const page = 1;
  const { projects, projectsCount } = await getUserProjects(
    params.authorId,
    page
  );

  // Check if there are more projects to load
  const hasMoreProjects = projects.length < projectsCount;

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 md:pt-36">
      <div className="flex flex-col justify-between h-full w-full max-w-5xl mx-auto px-4">
        {/* Author profile section */}
        <div className="flex w-full justify-center items-center gap-5 bg-white p-5 rounded-lg shadow-lg">
          <Image
            src={authorDetails?.image || "/default-user.png"}
            alt="user image"
            width={140}
            height={140}
            className="rounded-full shadow-md"
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-4xl font-bold text-gray-800">
              {authorDetails?.name}
            </h1>
            <h3 className="text-lg text-gray-600">{authorDetails?.email}</h3>
          </div>
        </div>

        {/* Separator */}
        <hr className="mt-10 border-gray-300 w-full" />

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {projects?.map((project: ProjectDetails) => (
            <UserProjectsCard key={project.id} project={project} />
          ))}
        </div>

        {/* Load more projects if they exist */}
        {hasMoreProjects && (
          <LoadMoreProjects
            authorId={authorDetails.id}
            parentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          />
        )}
      </div>
    </div>
  );
};

export default AuthorProfilePage;
