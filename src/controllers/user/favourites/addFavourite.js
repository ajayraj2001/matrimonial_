// controllers/addToFavorites.js
const { Favorite } = require('../../../models');

const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log('req.user', req.user)

    const { itemType, itemId } = req.body;

    if (!['Book', 'Dhyaan'].includes(itemType)) {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }

    const alreadyFavorite = await Favorite.findOne({ userId, itemType, itemId });

    if (alreadyFavorite) {
      return res.status(400).json({ success: false, message: 'Item already in favorites' });
    }

    const favorite = new Favorite({
      userId,
      itemType,
      itemId,
    });

    await favorite.save();

    return res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: { favorite },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addToFavorites;
