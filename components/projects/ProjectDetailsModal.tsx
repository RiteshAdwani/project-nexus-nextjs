"use client";

import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";
import { ProjectDetails, User } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HeartIcon, GlobeIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import { toggleProjectLike } from "@/actions/project";
import { toast } from "sonner";
import ActionButton from "../shared/ActionButton";

const ProjectDetailsModal = ({
  project,
  author,
}: {
  project: ProjectDetails;
  author: User;
}) => {
  const router = useRouter();
  const userId = useCurrentUser()?.id;

  // State for like functionality
  const [isLiked, setIsLiked] = useState(project.likedBy.includes(userId!));
  const [likeCount, setLikeCount] = useState(project.likes || 0);

  const isCreator = userId === author.id;

  // Handle like button click
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleProjectLike(project.id, userId!);
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsLiked(result.isLiked ?? false);
        setLikeCount(result.likeCount ?? 0);
      }
    } catch (error) {
      toast("Something went wrong!");
    }
  };

  // Handle modal close
  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className="max-w-[300px] sm:max-w-[700px] p-0 overflow-hidden">
          {/* Project cover image and title section */}
          <div className="relative h-48 sm:h-64 md:h-80 w-full">
            <Image
              src={project.posterImage}
              alt="Project Cover"
              fill={true}
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                {project.title}
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Image
                  src={author?.image || ""}
                  alt={author?.name || "unknown"}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white sm:w-12 sm:h-12"
                />
                <span className="font-semibold text-sm sm:text-base md:text-lg">
                  {author?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Project details section */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm bg-purple-100 text-purple-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full font-medium">
                {project.category}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {project.description}
            </p>

            {/* Action buttons section */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={project.githubUrl}>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-700 text-xs sm:text-sm px-1 md:px-4"
                  >
                    <FaGithub className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    GitHub
                  </Button>
                </Link>

                <Link href={project.websiteUrl}>
                  <Button
                    variant="outline"
                    className="border-indigo-500 text-indigo-700 text-xs sm:text-sm px-1 md:px-4"
                  >
                    <GlobeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Website
                  </Button>
                </Link>

                {isCreator && (
                  <>
                    <Link href={`/edit-project/${project.id}`}>
                      <Button
                        variant="outline"
                        className="border-green-500 text-green-700 text-xs sm:text-sm px-1 md:px-4"
                      >
                        <EditIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <ActionButton
                      variant="outline"
                      className="border-red-500 text-red-700 text-xs sm:text-sm px-1 md:px-4"
                      projectId={project.id}
                      action="Delete"
                    >
                      <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    </ActionButton>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                className={`flex items-center px-0 space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                  isLiked ? "text-red-600" : "text-gray-600"
                }`}
                onClick={handleLike}
              >
                <HeartIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${
                    isLiked ? "fill-current text-red-500" : "text-gray-600"
                  }`}
                />
                <span className="font-semibold">{likeCount} likes</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default ProjectDetailsModal;
