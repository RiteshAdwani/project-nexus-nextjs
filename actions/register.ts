"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/actions/user";

/**
 * Registers a new user in the system.
 *
 * @param {z.infer<typeof RegisterSchema>} values - The registration form values.
 * @returns {Promise<{ error: string } | { success: string }>} The result of the registration attempt.
 */
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate the input fields against the RegisterSchema
  const validatedFields = RegisterSchema.safeParse(values);

  // If validation fails, return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  // Extract validated data
  const { email, password, name } = validatedFields.data;

  // Hash the password for security
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if a user with the given email already exists
  const existingUser = await getUserByEmail(email);

  // If user already exists, return an error
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // Create a new user in the database
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Return success message
  return { success: "User Created!" };
};