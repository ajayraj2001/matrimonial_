const { ApiError } = require("../../../errorHandler");
const { Recent } = require("../../../models");
const { isValidObjectId } = require("mongoose");

const addRecent = async (req, res) => {
    const userId = req.user._id;
    const { songId } = req.params;
    const newTimeStamp = req.body.timeStamp || Date.now(); 
    try {
        if (!isValidObjectId(userId)) {
            throw new ApiError("Invalid User Id", 400);
        }
        if (!isValidObjectId(songId)) {
            throw new ApiError("Invalid Song Id", 400);
        }
        let recent = await Recent.findOne({ userId });
        if (!recent) {
            const newRecent = new Recent({ userId, songs: [{ songId, timeStamp: newTimeStamp }] });
            await newRecent.save();
            return res.status(201).json({
                success: true,
                message: "Data added to recent",
                data: {
                    recent: newRecent,
                },
            });
        } else {
            const existingSongIndex = recent.songs.findIndex(song => song.songId.toString() === songId);
            if (existingSongIndex !== -1) {
                recent.songs.splice(existingSongIndex, 1);
            }
           
            recent.songs.unshift({ songId, timeStamp: newTimeStamp });
            await recent.save();
            return res.status(201).json({
                success: true,
                message: "Data added to recent",
                data: {
                    recent,
                },
            });
        }
    } catch (error) {
        throw error;
    }
};

module.exports = addRecent;


module.exports = addRecent;

