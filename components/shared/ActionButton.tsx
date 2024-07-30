"use client";

import { deleteProject } from "@/actions/project";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { toast } from "sonner";

interface ActionButtonProps {
  action: string;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  projectId: string;
  className?: string;
  children: React.ReactNode;
}

const ActionButton = ({
  action,
  variant,
  projectId,
  children,
  className,
}: ActionButtonProps) => {
  const router = useRouter();

  // Handle project deletion
  const handleDelete = async () => {
    if (action === "Delete") {
      try {
        await deleteProject(projectId);
        toast.success("Project deleted!");
        router.push(DEFAULT_LOGIN_REDIRECT);
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <AlertDialog>
      {/* Trigger for the alert dialog */}
      <AlertDialogTrigger asChild>
        <Button variant={variant} className={className}>
          {children}
          {action}
        </Button>
      </AlertDialogTrigger>
      {/* Alert dialog content */}
      <AlertDialogContent className="w-[280px] md:w-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this project?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionButton;
