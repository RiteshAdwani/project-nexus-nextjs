"use server";

import { signOut } from "@/auth";

/**
 * Logs out the current user and redirects to the home page.
 * @async
 * @function logout
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await signOut({redirectTo:"/"});
};

