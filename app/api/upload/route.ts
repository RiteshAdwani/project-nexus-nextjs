import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Handles POST requests to upload an image to Cloudinary.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} JSON response with upload result or error message.
 */
export const POST = async (req: Request) => {
  // Extract the image path from the request body
  const { path } = await req.json();

  // Check if the image path is provided
  if (!path) {
    return NextResponse.json(
      { message: "Image path is required!" },
      { status: 400 }
    );
  }

  try {
    // Set upload options for Cloudinary
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [{ width: 1000, height: 752, crop: "scale" }],
    };

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(path, options);

    // Return the upload result
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Handle upload errors
    return NextResponse.json(
      { error: "Failed to upload image!" },
      { status: 500 }
    );
  }
};
