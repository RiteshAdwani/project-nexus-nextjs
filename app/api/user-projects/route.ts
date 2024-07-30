import { PROJECTS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to fetch user-specific projects with pagination.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} JSON response with projects and total count, or an error message.
 */
export const GET = async (req: NextRequest) => {
  // Extract query parameters
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit") || PROJECTS_PER_PAGE;

  // Calculate skip value for pagination
  const skip = (Number(page) - 1) * Number(limit);

  try {
    // Count total projects for the user
    const projectsCount = await db.project.count({
      where: { authorId: userId ?? undefined },
    });

    // Fetch paginated projects for the user
    const projects = await db.project.findMany({
      where: { authorId: userId ?? undefined },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    });

    // Return projects and total count
    return NextResponse.json({ projects, projectsCount });
  } catch (error) {
    // Handle errors and return a 500 status code
    return NextResponse.json(
      { error: "Failed to fetch user projects!" },
      { status: 500 }
    );
  }
};
