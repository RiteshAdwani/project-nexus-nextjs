"use server";

import { db } from "@/lib/db";
import { User } from "@/types";

/**
 * Fetches a user by their email address.
 *
 * @param {string} email - The email address of the user to fetch.
 * @returns {Promise<User>} The user object if found.
 * @throws {Error} If the user cannot be fetched.
 */
export const getUserByEmail = async (email: string) => {
  try {
    // Query the database for a user with the given email
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch {
    // If an error occurs during the fetch, throw a custom error
    throw new Error("Couldn't fetch user!");
  }
};

/**
 * Fetches a user by their unique ID.
 *
 * @param {string} id - The unique identifier of the user to fetch.
 * @returns {Promise<User>} The user object if found.
 * @throws {Error} If the user cannot be fetched.
 */
export const getUserById = async (id: string): Promise<User> => {
  try {
    // Query the database for a user with the given ID
    const user = await db.user.findUnique({ where: { id } });
    return user as User;
  } catch (error) {
    // If an error occurs during the fetch, throw a custom error
    throw new Error("Couldn't fetch user!");
  }
};
