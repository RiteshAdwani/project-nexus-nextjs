import { ProjectForm } from "@/components/projects/ProjectForm";

interface EditProjectPageProps {
  params: {
    projectId: string;
  };
}

const EditProjectPage = async ({ params }: EditProjectPageProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { projectId } = params;

  // Fetch project details from the API
  const response = await fetch(`${appUrl}/api/edit-project/${projectId}`, {
    next: {
      tags: ["fetch-project-details"],
    },
  });
  const projectDetails = await response.json();

  return (
    <div className="flex justify-center items-center overflow-y-hidden relative top-20 md:top-28 ">
      {/* Render the ProjectForm component in edit mode with project details */}
      <ProjectForm type="edit" project={projectDetails.project} />
    </div>
  );
};

export default EditProjectPage;
