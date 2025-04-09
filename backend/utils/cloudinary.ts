import { v2 as cloudinary } from "cloudinary";

export const configCloudinary = () =>
  cloudinary.config({
    secure: true,
    api_key: "682548542715548",
    api_secret: "ooY52lYy-mQJlcUIwymyK-Kh9Rg",
    cloud_name: "duydunnlr",
  });

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
