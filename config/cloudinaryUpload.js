import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (buffer) => {
  console.log('buffer', buffer);

  const url = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(buffer);
  });

  return url;
};
