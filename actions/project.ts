"use server";

import { currentUser } from "@/lib/auth";
import { PROJECTS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { ProjectDetails } from "@/types";
import imageType from "image-type";
import { revalidateTag } from "next/cache";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

/**
 * Uploads an image to the server.
 * @param {string} imagePath - The base64 encoded image data.
 * @returns {Promise<Object>} The server response containing the uploaded image URL.
 */
export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${appUrl}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw new Error("Failed to upload image!");
  }
};

/**
 * Converts a File object to a base64 encoded string.
 * @param {File} image - The image file to convert.
 * @returns {Promise<string>} The base64 encoded image data.
 */
const convertImageToBase64 = async (image: File) => {
  try {
    const imageReader = image.stream().getReader();
    const imageDataU8: number[] = [];

    while (true) {
      const { done, value } = await imageReader.read();
      if (done) break;

      imageDataU8.push(...value);
    }

    const uint8Array = new Uint8Array(imageDataU8);
    const imageBinary = Buffer.from(uint8Array.buffer);
    const mimetype = await imageType(imageBinary);

    const base64Img = imageBinary.toString("base64");
    const base64File = `data:${mimetype?.mime};base64,` + base64Img;
    return base64File;
  } catch (error) {
    throw new Error("Couldn't convert image to base64!");
  }
};

/**
 * Creates a new project.
 * @param {object} prevState - The previous state object.
 * @param {FormData} formData - The form data containing project details.
 * @returns {Promise<Object>} The result of the project creation operation.
 */
export const createNewProject = async (
  prevState: { message: string; success: boolean; data?: undefined },
  formData: FormData
) => {
  try {
    const user = await currentUser();
    const authorId = user?.id;

    if (authorId) {
      // Extract project details from form data
      const { category, title, description, githubUrl, websiteUrl } =
        Object.fromEntries(formData.entries());

      let posterImage = formData.get("posterImage");

      // Convert and upload poster image if provided
      if (posterImage instanceof File && posterImage.name !== "undefined") {
        const image = await convertImageToBase64(posterImage);
        const uploadedImage = await uploadImage(image);
        posterImage = uploadedImage.url;
      }

      if (posterImage) {
        // Send project data to API for creation
        await fetch(`${appUrl}/api/share-work`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectData: {
              category,
              title,
              description,
              githubUrl,
              websiteUrl,
              posterImage,
            },
            authorId,
          }),
        });
        revalidateTag("fetch-projects");
        return { message: "Project added successfully!", success: true };
      }
      return { message: "Please provide a poster image!", success: false };
    }
    return { message: "Please sign in to create a project!", success: false };
  } catch (error) {
    return { message: "Failed to create project!", success: false };
  }
};

/**
 * Updates an existing project.
 * @param {string} projectId - The ID of the project to update.
 * @param {object} prevState - The previous state object.
 * @param {FormData} formData - The form data containing updated project details.
 * @returns {Promise<Object>} The result of the project update operation.
 */
export const updateProject = async (
  projectId: string | undefined,
  prevState: { message: string; success: boolean; data?: ProjectDetails },
  formData: FormData
) => {
  try {
    // Fetch existing project details if projectId is provided
    let projectDetails: ProjectDetails | null = null;
    if (projectId)
      projectDetails = await getProjectDetailsByProjectId(projectId);

    // Extract updated project details from form data
    const {
      category,
      title,
      description,
      githubUrl,
      websiteUrl,
      posterImage: image,
    } = Object.fromEntries(formData.entries());

    let posterImage = projectDetails?.posterImage;

    // Convert and upload new poster image if provided
    if (image instanceof File && image.name !== "undefined") {
      const convertedImage = await convertImageToBase64(image);
      const uploadedImage = await uploadImage(convertedImage);
      posterImage = uploadedImage.url;
    }

    // Send updated project data to API
    const response = await fetch(`${appUrl}/api/edit-project`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectData: {
          category,
          title,
          description,
          githubUrl,
          websiteUrl,
          posterImage,
        },
        projectId,
      }),
    });
    revalidateTag("fetch-projects");
    revalidateTag("fetch-project-details");
    const data = await response.json();
    return { message: "Project updated successfully!", success: true, data };
  } catch (error) {
    return { message: "Couldn't update project!", success: false };
  }
};

/**
 * Fetches projects for a specific user.
 * @param {string} userId - The ID of the user.
 * @param {number} page - The page number for pagination.
 * @returns {Promise<Object>} The user's projects and total project count.
 */
export const getUserProjects = async (userId: string, page: number) => {
  const limit = PROJECTS_PER_PAGE;
  const queryParams = new URLSearchParams();
  queryParams.append("userId", userId);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  try {
    const result = await fetch(
      `http://localhost:3000/api/user-projects?${queryParams.toString()}`,
      {
        headers: { "Content-Type": "application/json" },
        next: {
          tags: ["fetch-user-projects"],
        },
      }
    );
    const data = await result.json();
    const { projects, projectsCount } = data;
    return { projects, projectsCount };
  } catch (error) {
    throw new Error("No projects found!");
  }
};

/**
 * Fetches details of a specific project.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<ProjectDetails | null>} The project details.
 */
export const getProjectDetailsByProjectId = async (
  projectId: string
): Promise<ProjectDetails | null> => {
  try {
    const projectDetails = await db.project.findUnique({
      where: { id: projectId },
    });
    revalidateTag("fetch-project-details");
    return projectDetails;
  } catch (error) {
    throw new Error("Couldn't fetch project details!");
  }
};

/**
 * Deletes a project.
 * @param {string} projectId - The ID of the project to delete.
 */
export const deleteProject = async (projectId: string) => {
  try {
    await db.project.delete({
      where: { id: projectId },
    });
    revalidateTag("fetch-projects");
    return;
  } catch (error) {
    throw new Error("Couldn't delete project!");
  }
};

/**
 * Fetches all projects with optional filtering and pagination.
 * @param {number} page - The page number for pagination.
 * @param {string} [category] - Optional category filter.
 * @param {string} [search] - Optional search term.
 * @returns {Promise<Object>} The projects and total project count.
 */
export const getAllProjects = async (
  page: number,
  category?: string,
  search?: string
) => {
  const limit = PROJECTS_PER_PAGE;
  const queryParams = new URLSearchParams();

  // Add optional filters to query parameters
  if (category) {
    queryParams.append("category", category);
  }
  if (search) {
    queryParams.append("search", search);
  }
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  try {
    // Fetch projects from the API with the given parameters
    const result = await fetch(
      `http://localhost:3000/api/projects?${queryParams.toString()}`,
      {
        headers: { "Content-Type": "application/json" },
        next: {
          tags: ["fetch-projects"],
        },
      }
    );
    const data = await result.json();
    const { projects, projectsCount } = data;
    return { projects, projectsCount };
  } catch (error) {
    throw new Error("Couldn't fetch projects!");
  }
};

/**
 * Toggles the like status of a project for a user.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} The updated like status and count.
 */
export const toggleProjectLike = async (projectId: string, userId: string) => {
  try {
    // Fetch project likes and liked users
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { likes: true, likedBy: true },
    });

    if (!project) {
      throw new Error("Project not found!");
    }

    const userLiked = project.likedBy.includes(userId);

    // Update project likes and liked users
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        likes: userLiked ? project.likes - 1 : project.likes + 1,
        likedBy: userLiked
          ? { set: project.likedBy.filter((id) => id !== userId) }
          : { push: userId },
      },
    });

    revalidateTag("fetch-projects");
    revalidateTag("fetch-project-details");
    return {
      isLiked: !userLiked,
      likeCount: updatedProject.likes,
    };
  } catch (error) {
    return { error: "Couldn't update project likes!" };
  }
};
