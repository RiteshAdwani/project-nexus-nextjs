import ProjectDetailsModal from "@/components/projects/ProjectDetailsModal";
import { getUserById } from "@/actions/user";

interface ProjectDetailsProps {
  params: {
    projectId: string;
  };
}

const ProjectDetails = async ({ params }: ProjectDetailsProps) => {
  // Get the app URL from environment variables
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { projectId } = params;

  // Fetch project details from the API
  const response = await fetch(`${appUrl}/api/projects/${projectId}`, {
    next: { tags: ["fetch-project-details"] },
  });
  const { project } = await response.json();

  // Fetch author details
  const author = await getUserById(project.authorId);

  // Render the ProjectDetailsModal with project and author data
  return <ProjectDetailsModal project={project} author={author} />;
};

export default ProjectDetails;
