const { Book, User, Dhyaan } = require('../../../models');

const adminDashboard = async (req, res, next) => {
    try {
        const users = await User.countDocuments()
        const booksCount = await Book.countDocuments();
        const dhyaansCount = await Dhyaan.countDocuments()


        const books = await Book.find().sort({ _id: -1 }).limit(8);
        const dhyaans = await Dhyaan.find().sort({ _id: -1 }).limit(8);

        const cardCounts = {
            userCount: users,
            bookCount: booksCount,
            dhyaanCount: dhyaansCount
        }

        return res.status(200).json({
            success: true,
            message: 'Admin Dashboard',
            data: { cardCounts, books, dhyaans },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = adminDashboard