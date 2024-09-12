const {Review} = require("../../../models");

const getReviews = async (req, res) => {
    try {
        const { approved } = req.body;
        let filter = {};
        
        if (approved === "true") {
            filter.isApproved = true;   
        }
    
        const reviews = await Review.find(filter).populate({
            path: 'user',
            select: 'name email profile_image' // Replace field1 and field2 with the actual fields you want to populate
        });

        const message = approved === "true" ? "Showing approved reviews" : "Showing all reviews";

        return res.status(200).json({
            success: true,
            message: message,
            data: {
                reviews
            }
        });
    } catch (error) {
        throw error;
    }
};

module.exports = getReviews;
