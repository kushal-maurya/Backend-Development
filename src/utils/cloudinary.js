import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const uploadOnCloudinary = async(localFilePath) => {
   try { 
        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file uploaded on cloudinary successfully
        // console.log("File uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch(error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary files as the upload operation got failed
        return null;
    }
}

const deleteOnCloudinary = async(oldImageUrl) => {
    try {
        if(!oldImageUrl){
            throw new ApiError(404, "old image url required")
        }
    
        const response = await cloudinary.uploader.destroy(
            { resource_type: `${oldImageUrl.include("image")}`}
        )
        console.log(response,"image deleted from cloudinary");
    } catch (error) {
        throw new ApiError(500, "server error while deleting image from cloudinary");
    }

}


export { uploadOnCloudinary, deleteOnCloudinary }