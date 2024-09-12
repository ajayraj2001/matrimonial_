const { Dhyaan, DhyaanRating } = require('../../../models');

// Rate a book
const rateDhyaan = async (req, res, next) => {
  try {
    const { id } = req.params; // Book ID
    const { rating } = req.body; // User's rating
    const userId = req.user._id; // Assuming user ID is stored in req.user


    if (!rating) {
        return res.status(400).json({
          success: false,
          message: 'Rating is required',
        });
      }

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new ApiError('Rating must be between 1 and 5', 400);
    }

    // Find or create a rating entry
    const ratingEntry = await DhyaanRating.findOneAndUpdate(
      { dhyaan: id, user: userId },
      { rating },
      { new: true, upsert: true }
    );

    // Recalculate the average rating for the book
    const ratings = await DhyaanRating.find({ dhyaan: id });
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    // Update the book's average rating
    const dhyaan = await Dhyaan.findByIdAndUpdate(
      id,
      { rating: averageRating },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: { dhyaan }
    });
  } catch (error) {
    next(error);
  }
};

module.exports =  rateDhyaan ;
