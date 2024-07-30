"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <Button onClick={onClick} className="cursor-pointer text-[#6F38C5] md:text-black text-md md:text-lg" variant="ghost">
      {children}
    </Button>
  );
};
