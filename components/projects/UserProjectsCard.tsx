import Link from "next/link";
import Image from "next/image";
import { ProjectDetails } from "@/types";

interface UserProjectsCardProps {
  project: ProjectDetails;
}

const UserProjectsCard = ({ project }: UserProjectsCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Link to the project details page */}
      <Link
        href={`/projects/${project.id}`}
        className="group relative h-40 mb-4 block"
      >
        {/* Project poster image */}
        <Image
          src={project.posterImage}
          layout="fill"
          className="object-cover rounded-lg group-hover:opacity-75 transition duration-300"
          alt="project image"
        />
      </Link>
      {/* Project title */}
      <div className="flex justify-between items-center">
        <p className="text-md font-medium">{project.title}</p>
      </div>
    </div>
  );
};

export default UserProjectsCard;
