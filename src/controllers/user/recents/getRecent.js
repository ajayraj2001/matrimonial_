const { ApiError } = require("../../../errorHandler");
const { Recent } = require("../../../models");
const { isValidObjectId } = require("mongoose");

const getRecent = async (req,res) => {
    const userId = req.user._id;
        try {
            if (!isValidObjectId(userId)) {
                throw new ApiError("Invalid User Id", 400);
            }
            const recent = await Recent.findOne({ userId }).populate({
                path: 'songs.songId',
                select: 'titleEnglish titleHindi thumbnail url'
              });
            if (recent) {
                recent.songs.sort((a, b) => b.timeStamp - a.timeStamp);
                    return res.status(200).json({
                        success: true,
                        message: "recent songs list",
                        data: {
                            songs: recent.songs
                        }
                    });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "recent songs list",
                    data: {
                        songs:[]
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    }

 module.exports = getRecent