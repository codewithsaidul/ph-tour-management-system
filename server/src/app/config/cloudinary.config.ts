import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import { AppError } from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});


export const deleteImageFromCloudinary = async (url: string) => {
 try {
   const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i

  const match = url.match(regex);

  if (match && match[1]) {
    const public_id = match[1];
    await cloudinary.uploader.destroy(public_id);
  }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 } catch (error: any) {
  throw new AppError(401, "Cloudinary image deletion failed", error.message)
 }
}

export const cloudinaryUpload = cloudinary;

// import { v2 as cloudinary } from 'cloudinary';

// (async function() {

//     // Configuration
//     cloudinary.config({
//         cloud_name: 'dnrqe9nvc',
//         api_key: '748578963798511',
//         api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
//     });

//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);
// })();
