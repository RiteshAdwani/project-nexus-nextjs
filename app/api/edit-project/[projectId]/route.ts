import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to fetch project details by projectId.
 *
 * @param {Request} req - The incoming request object.
 * @param {Object} params - The route parameters.
 * @param {string} params.projectId - The ID of the project to fetch.
 * @returns {Promise<NextResponse>} The response object containing project details or an error message.
 */
export const GET = async (
  req: Request,
  { params }: { params: { projectId: string } }
) => {
  const { projectId } = params;

  try {
    // Attempt to fetch the project from the database
    const project = await db.project.findUnique({ where: { id: projectId } });

    // Return the project details in the response
    return NextResponse.json({ project });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    return NextResponse.json(
      { error: "Failed to fetch project details!" },
      { status: 500 }
    );
  }
};
