import ProjectDetailsCard from "@/components/projects/ProjectDetailsCard";
import RelatedProjects from "@/components/projects/RelatedProjects";
import ProjectDetailsCardSkeleton from "@/components/skeleton/ProjectDetailsCardSkeleton";
import { Suspense } from "react";

interface ProjectDetailsPageProps {
  params: {
    projectId: string;
  };
}

const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  // Get the app URL from environment variables
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { projectId } = params;

  // Fetch project details from the API
  const response = await fetch(`${appUrl}/api/projects/${projectId}`, {
    next: {
      tags: ["fetch-project-details"],
    },
  });
  const projectDetails = await response.json();

  return (
    <div className="min-h-screen flex flex-col items-center w-full px-6 md:px-14 py-20 md:py-28">
      {/* Wrap components in Suspense for loading fallback */}
      <Suspense fallback={<ProjectDetailsCardSkeleton />}>
        {/* Display project details */}
        <ProjectDetailsCard projectDetails={projectDetails.project} />
        
        {/* Display related projects */}
        <RelatedProjects
          userId={projectDetails.project.authorId}
          projectId={projectDetails.project.id}
        />
      </Suspense>
    </div>
  );
};

export default ProjectDetailsPage;
