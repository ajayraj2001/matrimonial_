// controllers/checkFavoriteStatus.js
const { Favorite } = require('../../../models');

const checkFavoriteStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { itemType, itemId } = req.query;

    if (!['Book', 'Dhyaan'].includes(itemType)) {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }

    const favorite = await Favorite.findOne({ userId, itemType, itemId });

    return res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = checkFavoriteStatus;
