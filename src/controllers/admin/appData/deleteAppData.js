const {AppData} = require('../../../models');
const { isValidObjectId } = require('mongoose');
const {ApiError} = require('../../../errorHandler');

const deleteAppData = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) throw new ApiError("Invalid Id", 400);
  
      const deletedData = await AppData.findByIdAndDelete(id);
      if (!deletedData) throw new ApiError("Invalid Id", 404);
  
      return res.status(200).json({ success: true, message: 'Deleted', data: null });
    } catch (error) {
      next(error);
    }
  };

  module.exports = deleteAppData