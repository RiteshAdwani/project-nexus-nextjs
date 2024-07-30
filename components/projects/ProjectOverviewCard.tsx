"use client";

import { Card, CardFooter, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { ProjectWithAuthor } from "@/types";
import { useState } from "react";
import { toggleProjectLike } from "@/actions/project";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

interface ProjectOverviewCardProps {
  project: ProjectWithAuthor;
}

const ProjectOverviewCard = ({ project }: ProjectOverviewCardProps) => {
  // Get current user's ID
  const userId = useCurrentUser()?.id;

  // State for like status and count
  const [isLiked, setIsLiked] = useState(project.likedBy.includes(userId!));
  const [likeCount, setLikeCount] = useState(project.likes || 0);

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

  return (
    <Link href={`projects/${project.id}`}>
      <Card className="h-auto w-[320px] rounded-2xl text-center flex-col justify-between items-center cursor-pointer overflow-hidden">
        {/* Project poster image */}
        <CardContent className="p-0 h-[240px] w-full relative">
          <Image
            src={project.posterImage}
            alt="Poster Image"
            fill={true}
            className="rounded-t-2xl object-cover"
          />
        </CardContent>
        {/* Project details and like button */}
        <CardFooter className="w-full text-gray-800 py-2 px-4">
          <div className="flex items-center justify-between w-full">
            {/* Author info */}
            <div className="flex items-center">
              <Image
                src={project.author.image}
                alt="user"
                height={30}
                width={30}
                className="rounded-full mr-2"
              />
              <div className="text-left">
                <p className="font-semibold">{project.title}</p>
                <p className="text-sm">{project.author.name}</p>
              </div>
            </div>
            {/* Like count and button */}
            <div className="flex items-center">
              <span className="mr-1">{likeCount}</span>
              <HeartIcon
                className={`cursor-pointer ${
                  isLiked ? "fill-current text-red-500" : "text-gray-600"
                }`}
                onClick={handleLike}
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectOverviewCard;
