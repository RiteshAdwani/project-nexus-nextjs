import { getUserProjects } from "@/actions/project";
import UserProjectsCard from "@/components/projects/UserProjectsCard";
import { currentUser } from "@/lib/auth";
import Image from "next/image";
import { ProjectDetails } from "@/types";
import LoadMoreProjects from "@/components/projects/LoadMoreProjects";

const ProfilePage = async () => {
  // Fetch the current user's information
  const user = await currentUser();

  // Initialize page number and fetch user projects
  const page = 1;
  const { projects, projectsCount } = await getUserProjects(user?.id!, page);

  // Check if there are more projects to load
  const hasMoreProjects = projects.length < projectsCount;

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 md:pt-36">
      <div className="flex flex-col justify-between h-full w-full max-w-5xl mx-auto px-4">
        {/* User profile section */}
        <div className="flex w-full justify-center items-center gap-5 bg-white p-5 rounded-lg shadow-lg">
          <div className="w-[70px] h-[70px] lg:w-[140px] lg:h-[140px] relative">

          <Image
            src={user?.image || "/default-user.png"}
            alt="user image"
            fill={true}
            className="rounded-full shadow-md object-cover"
          />
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800">{user?.name}</h1>
            <h3 className="text-md lg:text-lg text-gray-600">{user?.email}</h3>
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
            authorId={user.id}
            parentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
