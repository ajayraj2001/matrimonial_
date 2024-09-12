const { ApiError } = require('../../../errorHandler');
const { User } = require('../../../models');

const updateUser = async (req, res, next) => {
    try {

     const {id , active} = req.body

     const user = await User.findByIdAndUpdate(id, { active }, { new: true });
           
     if (!user) {
        return res.status(404).json({success: false, message: 'User not found' });
    }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.log("error", error);
        next(error);
    }
};

module.exports = updateUser;
