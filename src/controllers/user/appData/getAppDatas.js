const {AppData} = require('../../../models');
const {ApiError} = require('../../../errorHandler');

const getAllAppData = async (req, res, next) => {
    try {
      const appData = await AppData.find().lean();
    
      return res.status(200).json({
        success: true,
        message: "App Data List",
        data: {
          appData
        },
      });
    } catch (error) {
      next(error);
    }
  };

  module.exports = getAllAppData