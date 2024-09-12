const { Book } = require('../../../models');

// Get a single book by ID
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw new ApiError('Book not found', 404);

    return res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: { book },
    });
  } catch (error) {
    next(error);
  }
};

// Get all books
const getAllBooks = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    // Convert page and limit to integers and set default values
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    // Create a search query object
    let searchQuery = {};
    if (search) {
      // Perform a case-insensitive search for bookName
      searchQuery.bookName = new RegExp(search, 'i');
    }

    // Count the total number of documents based on the search query
    const total_data = await Book.countDocuments(searchQuery);

    // Calculate the total number of pages
    const total_pages = Math.ceil(total_data / pageSize);

    // Apply pagination and search query
    const books = await Book.find(searchQuery)
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      books,
      pagination: {
        total_data,
        total_pages,
        current_page: pageNumber,
        page_size: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};




module.exports = { getBookById, getAllBooks };
