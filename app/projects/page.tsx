import CategoriesBar from "@/components/CategoriesBar";
import ProjectOverviewCard from "@/components/projects/ProjectOverviewCard";
import { getUserById } from "@/actions/user";
import { ProjectDetails, ProjectWithAuthor } from "@/types";
import { getAllProjects } from "@/actions/project";
import LoadMoreProjects from "@/components/projects/LoadMoreProjects";

interface ProjectsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    page: string;
  };
}

const ProjectsPage = async ({ searchParams }: ProjectsPageProps) => {
  // Extract search parameters
  const category = searchParams?.category;
  const search = searchParams?.search?.toLowerCase();
  const page = 1;

  // Fetch projects based on search parameters
  const { projects, projectsCount } = (await getAllProjects(
    page,
    category,
    search
  )) ?? { projects: [], projectsCount: 0 };

  // Check if there are more projects to load
  const hasMoreProjects = projects.length < projectsCount;

  // Fetch user data for each project's author concurrently
  const authorPromises = projects.map(async (project: ProjectDetails) => {
    const author = await getUserById(project.authorId);
    return { ...project, author };
  });

  // Resolve all author promises
  const projectsWithAuthors: ProjectWithAuthor[] = await Promise.all(
    authorPromises
  );

  return (
    <div className="flex flex-col justify-center items-center gap-6 lg:gap-9 overflow-y-hidden relative top-20 lg:top-28 pb-24">
      {/* Categories bar component */}
      <CategoriesBar />

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center md:max-w-4xl lg:max-w-7xl mx-auto gap-5 xl:gap-14">
        {projectsWithAuthors.map((project) => (
          <ProjectOverviewCard key={project.id} project={project} />
        ))}
      </div>

      {/* Load more projects  */}
      {hasMoreProjects && (
        <LoadMoreProjects parentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center md:max-w-4xl lg:max-w-7xl mx-auto gap-5 xl:gap-14" />
      )}
    </div>
  );
};

export default ProjectsPage;
