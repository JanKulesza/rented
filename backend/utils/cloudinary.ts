import { v2 as cloudinary } from "cloudinary";

export const configCloudinary = () => {
  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } =
    process.env;

  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME)
    throw new Error(
      "FATAL ERROR: cloudinary environmental variables are not defined."
    );

  cloudinary.config({
    secure: true,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    cloud_name: CLOUDINARY_CLOUD_NAME,
  });
};

export const uploadImage = async (imagePath: string) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  // Upload the image
  const result = await cloudinary.uploader.upload(imagePath, options);

  return { id: result.public_id, url: optimizeImage(result.public_id) };
};

export const deleteImage = async (id: string) =>
  await cloudinary.uploader.destroy(id, {
    invalidate: true,
  });

export const optimizeImage = (id: string, width?: number, height?: number) =>
  cloudinary.url(id, {
    transformation: [
      {
        fetch_format: "auto",
      },
      {
        quality: "auto",
      },
      {
        width,
        height,
        crop: "fill",
        gravity: "auto",
      },
    ],
  });
