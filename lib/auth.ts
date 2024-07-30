import { auth } from "@/auth";
import { User } from "@/types";

export const currentUser = async () => {
  const session = await auth();
  return session?.user as User;
};
