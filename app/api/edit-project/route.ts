import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectSchema } from "@/schemas";

/**
 * Handles PUT requests to update a project.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export const PUT = async (req: Request) => {
  // Extract project data and ID from the request body
  const { projectData, projectId } = await req.json();

  // Validate the project data against the ProjectSchema
  const validatedFields = ProjectSchema.safeParse(projectData);

  // If validation fails, return a 400 Bad Request response
  if (!validatedFields.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 400 });
  }

  // If projectId is missing, return a 401 Unauthorized response
  if (!projectId) {
    return NextResponse.json({ message: "Author Not found" }, { status: 401 });
  }

  try {
    // Extract necessary fields from validated data
    const { category, title, description, githubUrl, websiteUrl, posterImage } =
      validatedFields.data;

    // Check if the project exists
    const existingProject = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    // If project doesn't exist, return a 404 Not Found response
    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Update project data in the database
    await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        title,
        description,
        posterImage,
        category,
        githubUrl,
        websiteUrl,
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "Project updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    // If an error occurs during the update, return a 500 Internal Server Error response
    return NextResponse.json(
      { error: "Failed to update project!" },
      { status: 500 }
    );
  }
};
