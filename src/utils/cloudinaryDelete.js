// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Deletes images from Cloudinary using their secure URLs.
 * @param {string[]} urls - Array of Cloudinary secure URLs
 * @returns {Promise<object[]>} - Array of results
 */
export default async function deleteFromCloudinary(urls = []) {
  if (!Array.isArray(urls) || urls.length === 0) return [];

  // Extract public_ids from URLs
  const publicIds = urls
    .map((url) => {
      const parts = url.split("/upload/");
      if (!parts[1]) return null;
      const withoutVersion = parts[1].replace(/^v\d+\//, "");
      return withoutVersion.replace(/\.[^/.]+$/, "");
    })
    .filter(Boolean);

  const results = [];
  for (const publicId of publicIds) {
    try {
      const res = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: "image",
      });
      results.push({ public_id: publicId, ...res });
    } catch (err) {
      console.error("Cloudinary deletion failed for:", publicId, err);
      results.push({ public_id: publicId, error: err.message });
    }
  }

  return results;
}
