// controllers/removeFromFavorites.js
const { Favorite } = require('../../../models');

const removeFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { itemType, itemId } = req.body;

    if (!['Book', 'Dhyaan'].includes(itemType)) {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }

    const favorite = await Favorite.findOneAndDelete({ userId, itemType, itemId });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = removeFromFavorites;
