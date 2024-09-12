const { Book } = require('../../../models');
const { getMultipleFilesUploader } = require('../../../middlewares/multipleFileUpload');
const { deleteOldFile } = require('../../../utils');

// Upload middleware for both cover image and PDF file
const uploadFiles = getMultipleFilesUploader(
  ['coverImage', 'pdfUrl'], // Field names for the files
  'uploads/books/', // Base directory for storing files
  ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'] // Accepted MIME types
);

const updateBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw new ApiError('Book not found', 404);

    // Backup the old file paths before uploading new files
    const oldCoverImage = book.coverImage;
    const oldPdfUrl = book.pdfUrl;

    // Upload the cover image and PDF if new ones are provided
    uploadFiles(req, res, async function (err) {
      if (err) return next(err);

      // Extract data from the request body
      const { bookName, bookDescription, isActive, priority } = req.body;

      const isActiveBool = isActive === 'true';

      // Check if the bookName already exists in another document
      if (bookName) {
        const existingBookName = await Book.findOne({
          bookName,
          _id: { $ne: req.params.id }, // Exclude the current book
        });
        if (existingBookName) {
          return res.status(400).json({
            success: false,
            message: `The book name '${bookName}' already exists in another document.`,
          });
        }
      }

      // Check if the priority already exists in another document
      if (priority) {
        const existingPriority = await Book.findOne({
          priority,
          _id: { $ne: req.params.id }, // Exclude the current book
        });
        if (existingPriority) {
          return res.status(400).json({
            success: false,
            message: `The priority '${priority}' already exists in another book named '${existingPriority.bookName}'.`,
          });
        }
      }

      // Update the book fields
      book.bookName = bookName || book.bookName;
      book.bookDescription = bookDescription || book.bookDescription;
      book.priority = priority || book.priority;
      book.isActive = isActive !== undefined ? isActiveBool : book.isActive;

      if (req.files.coverImage) {
        book.coverImage = req.files.coverImage[0].path;
        await deleteOldFile(oldCoverImage); // Delete the old cover image
      }
      if (req.files.pdfUrl) {
        book.pdfUrl = req.files.pdfUrl[0].path;
        await deleteOldFile(oldPdfUrl); // Delete the old PDF file
      }


      await book.save();

      return res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        data: { book },
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateBookById;
