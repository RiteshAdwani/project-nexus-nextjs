import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to fetch projects with pagination, category filtering, and search functionality.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} JSON response with projects and total count, or an error message.
 */
export const GET = async (req: NextRequest) => {
  // Extract query parameters
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  // Calculate skip value for pagination
  const skip = (Number(page) - 1) * Number(limit);

  try {
    // Initialize where clause for database query
    let whereClause: Record<string, unknown> = {};

    // Construct where clause based on category or search parameters
    switch (true) {
      case !!category:
        whereClause.category = category;
        break;
      case !!search:
        whereClause.title = {
          contains: search,
          mode: "insensitive",
        };
        break;
      default:
        break;
    }

    // Count total projects matching the where clause
    const projectsCount = await db.project.count({
      where: whereClause,
    });

    // Fetch paginated projects
    const projects = await db.project.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    });

    // Return projects and total count
    return NextResponse.json({ projects, projectsCount });
  } catch (error) {
    // Handle errors and return a 500 status code
    return NextResponse.json(
      { error: "Failed to fetch projects!" },
      { status: 500 }
    );
  }
};
