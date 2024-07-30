"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "@/components/shared/Spinner";
import { getAllProjects, getUserProjects } from "@/actions/project";
import { ProjectWithAuthor, ProjectDetails, User } from "@/types";
import ProjectOverviewCard from "@/components/projects/ProjectOverviewCard";
import UserProjectsCard from "@/components/projects/UserProjectsCard";
import { getUserById } from "@/actions/user";

interface LoadMoreProjectsProps {
  authorId?: string;
  parentClassName?: string;
}

const LoadMoreProjects = ({
  authorId,
  parentClassName,
}: LoadMoreProjectsProps) => {
  const [projects, setProjects] = useState<ProjectWithAuthor[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);

  // Set up intersection observer
  const { inView, ref } = useInView();

  // Function to load more projects
  const loadMoreProjects = async () => {
    if (!hasMoreProjects) return;

    const nextPage = pagesLoaded + 1;
    // Fetch projects based on whether it's for a specific user or all projects
    const result = authorId
      ? await getUserProjects(authorId, nextPage)
      : await getAllProjects(nextPage);

    if (result) {
      const { projects: newProjects, projectsCount } = result;

      if (newProjects.length === 0) {
        setHasMoreProjects(false);
        return;
      }

      let newProjectsWithAuthors: ProjectWithAuthor[];

      if (authorId) {
        // For user projects, we don't need to fetch author details
        newProjectsWithAuthors = newProjects as ProjectWithAuthor[];
      } else {
        // For all projects, fetch author details
        const authorPromises = newProjects.map(
          async (project: ProjectDetails) => {
            const author: User = await getUserById(project.authorId);
            return { ...project, author };
          }
        );
        newProjectsWithAuthors = await Promise.all(authorPromises);
      }

      // Update state with new projects
      setProjects((prevProjects) => [
        ...prevProjects,
        ...newProjectsWithAuthors,
      ]);
      setPagesLoaded(nextPage);

      // Check if we've loaded all projects
      if (projects.length + newProjects.length >= projectsCount) {
        setHasMoreProjects(false);
      }
    } else {
      setHasMoreProjects(false);
    }
  };

  // Effect to trigger loading more projects when in view
  useEffect(() => {
    if (inView && hasMoreProjects) {
      loadMoreProjects();
    }
  }, [inView, hasMoreProjects]);

  return (
    <>
      <div className={`${parentClassName}`}>
        {projects.map((project) =>
          authorId ? (
            <UserProjectsCard key={project.id} project={project} />
          ) : (
            <ProjectOverviewCard key={project.id} project={project} />
          )
        )}
      </div>
      <div ref={ref}>
        {hasMoreProjects ? (
          <Spinner />
        ) : (
          <p className="text-center text-lg text-gray-600">
            You&aposve reached the end of the list.
          </p>
        )}
      </div>
    </>
  );
};

export default LoadMoreProjects;
