const { isValidObjectId } = require('mongoose');
const { AppData } = require('../../../models');
const { ApiError } = require('../../../errorHandler');

const getAppData = async (req, res, next) => {
    try {
        const key = req.params.key; 

        if (!key) throw new ApiError('Key is required', 400);

        const appData = await AppData.find({ key }).lean();
        
        if (!appData || appData.length === 0) throw new ApiError('No data found for the provided key', 404);
        
        return res.status(200).json({
            success: true,
            message: "App Data Details",
            data: {
                appData
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getAppData