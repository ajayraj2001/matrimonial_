const { ApiError } = require("../../../errorHandler");
const {Tag} = require("../../../models")

const getTags = async (req, res, next) => {
    try {
      const tags = await Tag.find();
      return res.status(200).json({
        success: true,
        message: "Tags list",
        data: {
          tags
        }
      });
    } catch (error) {5
      next(error);
    }
  };

  module.exports = getTags



