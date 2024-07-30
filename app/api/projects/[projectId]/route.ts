import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Fetches project details by projectId.
 *
 * @param {Request} req - The incoming request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.projectId - The ID of the project to fetch.
 * @returns {Promise<NextResponse>} JSON response with project details or error message.
 */
export const GET = async (
  req: Request,
  { params }: { params: { projectId: string } }
) => {
  const { projectId } = params;

  try {
    // Query the database for the project with the given ID
    const project = await db.project.findUnique({ where: { id: projectId } });

    // Return the project details as JSON
    return NextResponse.json({ project });
  } catch (error) {
    // If an error occurs, return a 500 status with an error message
    return NextResponse.json(
      { error: "Failed to fetch project details!" },
      { status: 500 }
    );
  }
};
