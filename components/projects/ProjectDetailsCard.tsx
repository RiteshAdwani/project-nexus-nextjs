"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getUserById } from "@/actions/user";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ProjectDetails, User } from "@/types";
import ActionButton from "@/components/shared/ActionButton";
import { toggleProjectLike } from "@/actions/project";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HeartIcon, GlobeIcon, EditIcon, TrashIcon } from "lucide-react";

interface ProjectDetailsCardProps {
  projectDetails: ProjectDetails;
}

const ProjectDetailsCard = ({ projectDetails }: ProjectDetailsCardProps) => {
  // Destructure project details
  const {
    id,
    title,
    description,
    posterImage,
    githubUrl,
    websiteUrl,
    category,
    authorId,
    likes,
    likedBy,
  } = projectDetails;

  const [author, setAuthor] = useState<User | null>(null);

  // Fetch author details on component mount
  useEffect(() => {
    const fetchAuthor = async () => {
      const author = await getUserById(authorId);
      setAuthor(author);
    };
    fetchAuthor();
  }, [authorId]);

  // Get current user ID and check if they're the project creator
  const userId = useCurrentUser()?.id;
  const isCreator = userId === authorId;

  // State for like functionality
  const [isLiked, setIsLiked] = useState(likedBy.includes(userId!));
  const [likeCount, setLikeCount] = useState(likes || 0);

  // Handle like button click
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleProjectLike(id, userId!);
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

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-xl rounded-lg">
      {/* Project cover image and title section */}
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full">
        <Image
          src={posterImage}
          alt="Project Cover"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            {title}
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
      <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm bg-purple-100 text-purple-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full font-medium">
            {category}
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {description}
        </p>

        {/* Action buttons section */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* GitHub and Website links */}
            <Link href={githubUrl}>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-700 text-xs sm:text-sm px-1 md:px-4"
              >
                <FaGithub className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                GitHub
              </Button>
            </Link>
            <Link href={websiteUrl}>
              <Button
                variant="outline"
                className="border-indigo-500 text-indigo-700 text-xs sm:text-sm px-1 md:px-4"
              >
                <GlobeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Website
              </Button>
            </Link>

            {/* Edit and Delete buttons for project creator */}
            {isCreator && (
              <>
                <Link href={`/edit-project/${id}`}>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-700 text-xs sm:text-sm px-1 md:px-4"
                    onClick={() => {}}
                  >
                    <EditIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Edit
                  </Button>
                </Link>
                <ActionButton
                  variant="outline"
                  className="border-red-500 text-red-700 text-xs sm:text-sm px-1 md:px-4"
                  projectId={id}
                  action="Delete"
                >
                  <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                </ActionButton>
              </>
            )}
          </div>

          {/* Like button */}
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
      </CardContent>
    </Card>
  );
};

export default ProjectDetailsCard;
