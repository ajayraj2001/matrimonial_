// controllers/getFavorites.js
const { Favorite } = require('../../../models');

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ userId })
      .sort({ addedAt: -1 })
      .populate({
        path: 'itemId',
        select: 'bookName dhyanName coverImage dhyanPoster',
      });

    return res.status(200).json({
      success: true,
      data: favorites.map((fav) => ({
        type: fav.itemType,
        addedAt: fav.addedAt,
        item: fav.itemId,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getFavorites;
