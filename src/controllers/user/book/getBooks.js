const { Book } = require('../../../models');

// Get a single book by ID
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw new ApiError('Book not found', 404);

    book.clicks += 1

    await book.save()
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
// const getAllBooks = async (req, res, next) => {
//   try {
//     const { page, limit, search } = req.query;

//     // Convert page and limit to integers and set default values
//     const pageNumber = parseInt(page, 10) || 1;
//     const pageSize = parseInt(limit, 10) || 10;

//     // Create a search query object
//     let searchQuery = {};
//     if (search) {
//       // Perform a case-insensitive search for bookName
//       searchQuery.bookName = new RegExp(search, 'i');
//     }

//     // Count the total number of documents based on the search query
//     const total_data = await Book.countDocuments(searchQuery);

//     // Calculate the total number of pages
//     const total_pages = Math.ceil(total_data / pageSize);

//     // Apply pagination and search query
//     const books = await Book.find(searchQuery)
//       .sort({ _id: -1 })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize);

//     return res.status(200).json({
//       success: true,
//       message: 'Books retrieved successfully',
//       books,
//       pagination: {
//         total_data,
//         total_pages,
//         current_page: pageNumber,
//         page_size: pageSize,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };



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

    const books = await Book.aggregate([
      {
        $match: searchQuery // Filter documents based on search query
      },
      {
          $addFields: {
              // Set 'priority' to a high value if it's null (for correct sorting)
              priority_sort: { 
                  $cond: { 
                      if: { $eq: ["$priority", null] }, 
                      then: Infinity, 
                      else: "$priority" 
                  }
              }
          }
      },
      {
          $sort: {
              priority_sort: 1,  // Sort by the adjusted 'priority' (nulls last)
              _id: -1            // Sort by '_id' in descending order within the same priority
          }
      },
      {
          $skip: (pageNumber - 1) * pageSize
      },
      {
          $limit: pageSize
      },
      {
          $project: {
              priority_sort: 0  // Remove the temporary 'priority_sort' field
              // Include other fields as needed, or exclude them by not listing them here
          }
      }
  ]);
  
  console.log('books', books)
  

    // Fetch books with a single query, prioritizing those with a `priority` field
  //   let books = await Book.find(searchQuery)
  //  // Sort by priority ascending, then by created_at descending
  //     .skip((pageNumber - 1) * pageSize)
  //     .limit(pageSize).select('priority')
  //     .exec();

  //     console.log('books', books)

  //     books = books.sort((a, b) => {
  //       if (a.priority === null && b.priority === null) return 0;
  //       if (a.priority === null) return 1;
  //       if (b.priority === null) return -1;
  //       return a.priority - b.priority;
  //   });

      // console.log('books', books)

    // Count the total number of documents based on the search query
    const total_data = await Book.countDocuments(searchQuery);

    // Calculate the total number of pages
    const total_pages = Math.ceil(total_data / pageSize);

    return res.status(200).json({
      success: true,
      message: 'Booksss retrieved successfully',
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
