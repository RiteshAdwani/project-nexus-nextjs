import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex flex-col space-y-16 h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#774fc6] to-[#b34cc7]">
      <p
        className={cn(
          "text-2xl md:text-4xl font-semibold text-white drop-shadow-md",
          font.className
        )}
      >
        Welcome to Project Nexus!
      </p>
      <Link href="/auth/login">
        <Button variant="secondary" size="lg">
          Proceed to Login
        </Button>
      </Link>
    </main>
  );
}
