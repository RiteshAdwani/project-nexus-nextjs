import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExitIcon } from "@radix-ui/react-icons";
import { FaUser } from "react-icons/fa";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { currentUser } from "@/lib/auth";

export const UserButton = async () => {
  // Fetch the current user data
  const user = await currentUser();

  return (
    <DropdownMenu>
      {/* Dropdown trigger - User avatar */}
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.image || ""}
            className="rounded-full border-2 border-white"
          />
          {/* Fallback icon if no user image is available */}
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {/* Dropdown content */}
      <DropdownMenuContent className="mt-2" align="end">
        {/* Logout button wrapped in a dropdown menu item */}
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
