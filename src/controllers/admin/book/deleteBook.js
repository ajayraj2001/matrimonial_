const { Book } = require('../../../models');
const { deleteOldFile } = require('../../../utils');

// Delete a book by ID
const deleteBookById = async (req, res, next) => {
  try {
    // Find the book by ID and delete it in one step
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) throw new ApiError('Book not found', 404);

    // Delete the associated files (cover image and PDF)
    await deleteOldFile(book.coverImage);
    await deleteOldFile(book.pdfUrl);

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteBookById;
