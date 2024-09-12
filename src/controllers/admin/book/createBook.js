// const { Book } = require('../../../models');
// const { getMultipleFilesUploader } = require('../../../middlewares/multipleFileUpload');
// const {deleteOldFile} = require('../../../utils');

// // Upload middleware for both cover image and PDF file
// const uploadFiles = getMultipleFilesUploader(
//   ['coverImage', 'pdfUrl'], // Field names for the files
//   'uploads/books/', // Base directory for storing files
//   ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'] // Accepted MIME types
// );

// const createBook = async (req, res, next) => {
//   try {
//     // Upload the cover image and PDF in one go
//     uploadFiles(req, res, async function (err) {
//       if (err) return next(err);

//       // Create a new book with the uploaded files
//       const { bookName, bookDescription, isActive, addedToHome } = req.body;

//       const isAddedToHome = addedToHome === 'true';

//       const book = new Book({
//         bookName,
//         bookDescription,
//         coverImage: req.files.coverImage ? req.files.coverImage[0].path : null,
//         pdfUrl: req.files.pdfUrl ? req.files.pdfUrl[0].path : null,
//         isActive,
//         addedToHome: isAddedToHome,
//       });

//       await book.save();
//       return res.status(201).json({
//         success: true,
//         message: 'Book created successfully',
//         data: { book },
//       });
//     });
//   } catch (error) {
//     // In case of an error during book creation, delete any uploaded files
//     if (req.files.coverImage) {
//       await deleteOldFile(req.files.coverImage[0].path);
//     }
//     if (req.files.pdfUrl) {
//       await deleteOldFile(req.files.pdfUrl[0].path);
//     }
//     next(error);
//   }
// };

// module.exports = createBook;




const { Book } = require('../../../models');
const { getMultipleFilesUploader } = require('../../../middlewares/multipleFileUpload');
const { deleteOldFile } = require('../../../utils');

// Upload middleware for both cover image and PDF file
const uploadFiles = getMultipleFilesUploader(
  ['coverImage', 'pdfUrl'], // Field names for the files
  'uploads/books/', // Base directory for storing files
  ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'] // Accepted MIME types
);

const createBook = async (req, res, next) => {
  try {
    // Upload the cover image and PDF in one go
    uploadFiles(req, res, async function (err) {
      if (err) return next(err);

      const { bookName, bookDescription, isActive, priority } = req.body;

      // Check if the book name already exists
      const existingBook = await Book.findOne({ bookName: bookName.trim() });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          message: `The book name "${bookName}" already exists.`,
        });
      }

      // Validate priority if it is provided
      if (priority) {
        const priorityNumber = parseInt(priority, 10);
        
        if (isNaN(priorityNumber) || priorityNumber < 1 || priorityNumber > 10) {
          return res.status(400).json({
            success: false,
            message: "Priority must be a number between 1 and 10.",
          });
        }

        // Check if the priority is already assigned to another book
        const existingPriority = await Book.findOne({ priority: priorityNumber });
        if (existingPriority) {
          return res.status(400).json({
            success: false,
            message: `The priority "${priorityNumber}" is already assigned to the book "${existingPriority.bookName}".`,
          });
        }
      }

      const book = new Book({
        bookName,
        bookDescription,
        coverImage: req.files.coverImage ? req.files.coverImage[0].path : null,
        pdfUrl: req.files.pdfUrl ? req.files.pdfUrl[0].path : null,
        isActive,
        priority: priority ? parseInt(priority, 10) : null,
      });

      await book.save();
      return res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: { book },
      });
    });
  } catch (error) {
    // In case of an error during book creation, delete any uploaded files
    if (req.files.coverImage) {
      await deleteOldFile(req.files.coverImage[0].path);
    }
    if (req.files.pdfUrl) {
      await deleteOldFile(req.files.pdfUrl[0].path);
    }
    next(error);
  }
};

module.exports = createBook;
