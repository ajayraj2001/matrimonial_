const { ApiError } = require("../../../errorHandler");
const {Review} = require("../../../models");

const getReviews = async (req, res) => {
    try {

        // const reviews = await Review.find();

        const reviews = await Review.find().populate({
            path: 'user',
            select: 'name email profile_image' // Replace field1 and field2 with the actual fields you want to populate
        });

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: {
                reviews
            }
        });
    } catch (error) {
        throw error;
    }
};

module.exports = getReviews;
