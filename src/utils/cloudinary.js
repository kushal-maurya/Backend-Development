import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
  });

const uploadOnCloudinary = async(localFilePath) => {
   try { 
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload
        (localFilePath, {
            resource_type: "auto" 
        })
        //file uploaded on cloudinary successfully
        console.log("File uploaded on cloudinary",
        response.url);
        console.log(response,"cloudinary response after uploading file")
        return response;
    } catch(error) {
        fs.unlink(localFilePath) //remove the locally saved temporary files as the upload operation got failed
        return null;
    }
}


export { uploadOnCloudinary }