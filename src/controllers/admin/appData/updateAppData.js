const {AppData} = require('../../../models');
const { isValidObjectId } = require('mongoose');
const {ApiError} = require('../../../errorHandler');

const updateAppData = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) throw new ApiError("Invalid Id", 400);
  
      const { key, value } = req.body;

      if (!key && !value) {
        throw new ApiError("Key or value is required for update", 400);
      }
  
      const updateFields = {};
      if (key) updateFields.key = key;
      if (value) updateFields.value = value;
  
      const updatedData = await AppData.findByIdAndUpdate(id, updateFields, { new: true });
      if (!updatedData) throw new ApiError("Invalid Id", 404);
  
      return res.status(200).json({
        success: true,
        message: "App Data updated",
        data: {
          updatedData,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  module.exports = updateAppData
  