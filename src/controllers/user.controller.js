import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
    //get User details from frontend
    //validation - not empty
    //check if user already exists: userName, email
    //check for image, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create user in db
    //remove password abd refreshToken field from response
    //check for user creation 
    //return response

    const { userName, fullName, email, password } = req.body;

    if( [userName, fullName, email, password].some( (fields) =>
    fields?.trim() === ""
    )) {
        throw new ApiError(400, "All Fields are mandetory");
    }

    const existedUser = User.findOne({
        $or: [{userName}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User Already Present");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError( 400, "Avatar file is Required" );
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is Required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url,
        email,
        password,
        userName: userName.toLowerCase
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Somthing went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})


export { registerUser };