const mongoose = require("mongoose");
const { isValidObjectId } = mongoose;
const { ApiError } = require("../../errorHandler");
const asyncHandler = require("../../utils/asyncHandler");
const RequestedUser = require("../../models/requestedUser");

const sendOrUpdateRequest = asyncHandler(async (req, res, next) => {

    const { userRequestedTo, status } = req.body;
    const user = req.user._id;

    if(!isValidObjectId(userRequestedTo))
        return next(new ApiError("Not a valid id", 400));

    if(!userRequestedTo) return next(new ApiError("Requested user id is required", 400));

    // Check if the current user is the one making the request
    if (user.toString() === userRequestedTo.toString()) {
        return res.status(400).json({ message: "Users cannot request themselves." });
    }

    // Find an existing document for the users
    const existingRequest = await RequestedUser.findOne({
        $or: [
            { user, userRequestedTo },
            { user: userRequestedTo, userRequestedTo: user }
        ]
    });


    if (existingRequest) {
        // If the document exists, update the status
        if (existingRequest.user.toString() === user.toString()) {
            return next(new ApiError("You cannot modify this request.", 403));
        } 

        existingRequest.status = status;
        await existingRequest.save({ validateBeforeSave : false });
        return res.status(200).json({ 
            success: true,
            message: "Status updated successfully."
        });
        
    } else {
        // If the document does not exist, create a new one
        const newRequest = new RequestedUser({ user, userRequestedTo });
        await newRequest.save();
        return res.status(201).json({ 
            success: true,
            message: "Request created successfully."
        });
    }

});


const sentRequestTo = asyncHandler(async (req, res, next) => {

    const user = req.user._id;

    const requestedTo = await RequestedUser.find({ user }).populate({
        path : "userRequestedTo",
        select : "fullName height city profile_image"
    });

    if(!requestedTo) return next(new ApiError("Data not found", 404));

    return res.status(200).json({ 
        success: true,
        message: "Data fetched successfully.",
        data: requestedTo
    });

});


const gotRequestFrom = asyncHandler(async (req, res, next) => {

    const user = req.user._id;

    const requestedBy = await RequestedUser.find({ userRequestedTo : user, status : { $ne : "Ignore" } })
    .sort({ createdAt: -1 })
    .populate({
        path : "user",
        select : "fullName height city profile_image"
    });

    if(!requestedBy) return next(new ApiError("Data not found", 404));

    return res.status(200).json({ 
        success: true,
        message: "Data fetched successfully.",
        data: requestedBy
    });

});


module.exports = { 
    sendOrUpdateRequest, 
    sentRequestTo, 
    gotRequestFrom 
};
