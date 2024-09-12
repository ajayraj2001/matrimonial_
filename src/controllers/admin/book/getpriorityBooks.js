const { Book } = require('../../../models');

// Get books with priority (up to 10)
const getPriorityBooks = async (req, res, next) => {
  try {
    const {type} = req.body
let data
    if(type == "Dhyaan"){
      data = await Dhyaan.find({ priority: { $ne: null } })
      .sort({ priority: 1 }) // Sort by priority in ascending order (1-10)
      .limit(10); // Limit the result t
    }else{
      data = await Book.find({ priority: { $ne: null } })
      .sort({ priority: 1 }) // Sort by priority in ascending order (1-10)
      .limit(10); // Limit the result t
    }

    return res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports =  getPriorityBooks 
