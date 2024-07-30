"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import crossIcon from "@/public/cross.png";
import menuIcon from "@/public/menu.png";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

const HamburgerMenu = () => {
  // State to manage menu visibility
  const [hamburgerMenu, setHamburgerMenu] = useState(true);

  return (
    <div className="md:hidden flex items-center">
      {/* Toggle button for the hamburger menu */}
      <Button
        onClick={() => setHamburgerMenu((prevState) => !prevState)}
        variant="outline"
        size="xs"
      >
        <Image
          src={hamburgerMenu ? menuIcon : crossIcon}
          alt="button icon"
          width={30}
          height={30}
        />
      </Button>

      {/* Menu content */}
      {!hamburgerMenu && (
        <div className="absolute top-[70px] left-0 right-0 font-medium shadow-md flex flex-col w-full items-center justify-center bg-[#ffffff] text-[#6F38C5] py-3">
          <Link href="/projects" onClick={() => setHamburgerMenu((prevState) => !prevState)}>Projects</Link>
          <Link href="/profile" onClick={() => setHamburgerMenu((prevState) => !prevState)}>Profile</Link>
          <Link href="/share-work" onClick={() => setHamburgerMenu((prevState) => !prevState)}>Share Work</Link>
          <LogoutButton>Logout</LogoutButton>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
