const { ApiError } = require("../../../errorHandler");
const { Review } = require("../../../models");

const createReview = async (req, res) => {
    const { review, rating } = req.body;
    try {
        const userId = req.user._id;
        
        if (!review || !rating) {
            throw new ApiError("Missing required fields", 400);
        }

        // Check if review already exists for the user
        let existingReview = await Review.findOne({ user:userId });

        if (existingReview) {
            existingReview.review = review;
            existingReview.rating = rating;
            existingReview.createdAt = new Date(); 
            await existingReview.save();

            return res.status(200).json({
                success: true,
                message: "Review submitted successfully",
                data: {
                    review: existingReview
                }
            });
        }

        const newReview = new Review({
            review,
            rating,
            user: userId
        });

        await newReview.save();

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: {
                review: newReview
            }
        });
    } catch (error) {
        throw error;
    }
};

module.exports = createReview;
