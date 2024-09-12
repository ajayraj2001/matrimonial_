const { ApiError } = require('../../../errorHandler');
const { User } = require('../../../models');

const getUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const searchQuery = {
            ...(req.query.search && { email: { $regex: req.query.search, $options: 'i' } })
        };

        // Check if page and limit are provided
        let activeUsers;
        let total_data;
        let totalPages;

        if (!page || !limit) {
            // If page and limit are not provided, retrieve all users
            activeUsers = await User.find(searchQuery, 'name email phone created_at')
                .lean()
                .sort({created_at:-1})
                .exec();
            total_data = activeUsers.length;
            totalPages = 1; // Since all users are retrieved, there's only one page
        } else {
            // If page and limit are provided, apply pagination
            const skip = (page - 1) * limit;
            total_data = await User.countDocuments(searchQuery);
            totalPages = Math.ceil(total_data / limit);

            activeUsers = await User.find(searchQuery, 'name email phone created_at')
                .skip(skip)
                .limit(limit)
                .sort({created_at:-1})
                .lean()
                .exec();
        }

        if (!activeUsers.length) {
            return res.status(404).json({
                success: false,
                message: "No active users found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users: activeUsers,
            page: page || 1,
            limit: limit || total_data, // If limit is not provided, all users are returned
            totalPages,
            total_data,
        });
    } catch (error) {
        console.log("error", error);
        next(error);
    }
};


module.exports = getUsers;
