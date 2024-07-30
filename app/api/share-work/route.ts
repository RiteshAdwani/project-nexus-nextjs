import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProjectSchema } from "@/schemas";

/**
 * Handles POST requests to create a new project.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} JSON response indicating success or failure.
 */
export const POST = async (req: Request) => {
  // Extract project data and author ID from the request body
  const { projectData, authorId } = await req.json();

  // Validate the project data against the ProjectSchema
  const validatedFields = ProjectSchema.safeParse(projectData);

  // If validation fails, return a 400 Bad Request response
  if (!validatedFields.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 400 });
  }

  // If authorId is missing, return an error response
  if (!authorId) {
    return NextResponse.json({ message: "Author Not found" });
  }

  try {
    // Extract necessary fields from validated data
    const { category, title, description, githubUrl, websiteUrl, posterImage } =
      validatedFields.data;

    // Create a new project in the database
    await db.project.create({
      data: {
        title,
        description,
        posterImage,
        category,
        githubUrl,
        websiteUrl,
        authorId,
      },
    });

    // Return success response
    return NextResponse.json({ message: "Project added successfully!" });
  } catch (error) {
    // If an error occurs during creation, return a 500 Internal Server Error response
    return NextResponse.json(
      { error: "Failed to create project!" },
      { status: 500 }
    );
  }
};
