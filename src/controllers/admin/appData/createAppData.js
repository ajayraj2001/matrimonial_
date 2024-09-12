const {AppData} = require('../../../models');
const {ApiError} = require('../../../errorHandler');

const createAppData = async (req, res, next) => {
    try {
      const { key, value } = req.body;

      if (!key || !value) {
        throw new ApiError("Key and value are required", 400);
      }
  
      const newData = await AppData.create({ key, value });

      return res.status(201).json({
        success: true,
        message: "app data added",
        data: {
          newData,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  

module.exports = createAppData