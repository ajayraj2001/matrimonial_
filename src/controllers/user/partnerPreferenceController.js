const { isValidObjectId } = require("mongoose");
const { ApiError } = require("../../errorHandler");
const PartnerPreferences = require("../../models/partnerPreference");
const User = require("../../models/user");
const calculateAge = require("../../utils/calculateAge");
const parseDate = require("../../utils/parseDate");
const haversineDistance = require("../../utils/haversineDistance");

const partnerPreferences = async (req, res, next) => {
  try {
    const {
      min_age,
      max_age,
      min_height,
      max_height,
      gender,
      marital_status,
      religion,
      caste,
      mother_tongue,
      country,
      residential_status,
      manglik,
      highest_education,
      college_name,
      company_name,
      employed_in,
      occupation,
      annual_income,
    } = req.body;

    const user_id = req.user._id;

    // Check if a document already exists for the user
    const existingPreferences = await PartnerPreferences.findOne({ user_id });

    if (existingPreferences) {
      // Update only the provided fields
      const [min_salary, max_salary] = annual_income.split("-");
      existingPreferences.set({
        min_age: min_age !== undefined ? min_age : existingPreferences.min_age,
        max_age: max_age !== undefined ? max_age : existingPreferences.max_age,
        min_salary:
          min_salary !== undefined
            ? min_salary
            : existingPreferences.min_salary,
        max_salary:
          max_salary !== undefined
            ? max_salary
            : existingPreferences.max_salary,
        min_height:
          min_height !== undefined
            ? min_height
            : existingPreferences.min_height,
        max_height:
          max_height !== undefined
            ? max_height
            : existingPreferences.max_height,
        gender: gender !== undefined ? gender : existingPreferences.gender,
        marital_status:
          marital_status !== undefined
            ? marital_status
            : existingPreferences.marital_status,
        religion:
          religion !== undefined ? religion : existingPreferences.religion,
        caste: caste !== undefined ? caste : existingPreferences.caste,
        mother_tongue:
          mother_tongue !== undefined
            ? mother_tongue
            : existingPreferences.mother_tongue,
        country: country !== undefined ? country : existingPreferences.country,
        residential_status:
          residential_status !== undefined
            ? residential_status
            : existingPreferences.residential_status,
        manglik: manglik !== undefined ? manglik : existingPreferences.manglik,
        highest_education:
          highest_education !== undefined
            ? highest_education
            : existingPreferences.highest_education,
        college_name:
          college_name !== undefined
            ? college_name
            : existingPreferences.college_name,
        company_name:
          company_name !== undefined
            ? company_name
            : existingPreferences.company_name,
        employed_in:
          employed_in !== undefined
            ? employed_in
            : existingPreferences.employed_in,
        occupation:
          occupation !== undefined
            ? occupation
            : existingPreferences.occupation,
        annual_income:
          annual_income !== undefined
            ? annual_income
            : existingPreferences.annual_income,
      });

      if (min_height) {
        const minHeightInCm = Math.round(parseFloat(min_height.split(" ")[1]));
        existingPreferences.min_height_in_cm = minHeightInCm;
      }

      if (max_height) {
        const maxHeightInCm = Math.round(parseFloat(max_height.split(" ")[1]));
        existingPreferences.max_height_in_cm = maxHeightInCm;
      }

      // Save the updated document
      await existingPreferences.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        message: "Partner preferences updated successfully",
        data: existingPreferences,
      });
    } else {
      // Create a new document
      if (
        !min_age ||
        !max_age ||
        !min_height ||
        !max_height ||
        !gender ||
        !marital_status ||
        !religion ||
        !caste ||
        !mother_tongue ||
        !country ||
        !residential_status ||
        !manglik ||
        !highest_education ||
        !college_name ||
        !company_name ||
        !employed_in ||
        !occupation ||
        !annual_income
      ) {
        throw new ApiError("All fields are required", 400);
      }

      const [min_salary, max_salary] = annual_income.split("-");

      const newPreferences = new PartnerPreferences({
        user_id,
        min_age,
        max_age,
        min_height,
        max_height,
        gender,
        marital_status,
        religion,
        caste,
        mother_tongue,
        country,
        residential_status,
        manglik,
        highest_education,
        college_name,
        company_name,
        employed_in,
        occupation,
        annual_income,
        min_salary,
        max_salary,
      });

      if (min_height) {
        const minHeightInCm = Math.round(parseFloat(min_height.split(" ")[1]));
        newPreferences.min_height_in_cm = minHeightInCm;
      }

      if (max_height) {
        const maxHeightInCm = Math.round(parseFloat(max_height.split(" ")[1]));
        newPreferences.max_height_in_cm = maxHeightInCm;
      }

      // Save the new document
      const savedPreferences = await newPreferences.save();

      return res.status(201).json({
        success: true,
        message: "Partner preferences created successfully",
        data: savedPreferences,
      });
    }
  } catch (error) {
    console.log("Error handling partner preferences:", error);
    return res.status(500).json({ success: true, message: error.message });
  }
};

const getPreference = async (req, res, next) => {
  try {
    const user_id = req.user._id;
  
      // Check if a document already exists for the user
      const preference = await PartnerPreferences.findOne({ user_id });
  
      if (!preference)
        return next(new ApiError("No preferences found for this user.", 404));
  
      return res.status(201).json({
        success: true,
        message: "Preference found successfully",
        data: preference,
      });
  } catch (error) {
    next(error);
  }
};

const matchedUsers = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const user_id = req.user._id;
    const preferences = await PartnerPreferences.findOne({ user_id });

    if (!preferences)
      return next(new ApiError("No preferences found for this user.", 404));

    let start, end;
    if (startDate && endDate) {
      start = parseDate(startDate);
      start.setHours(0, 0, 0, 0);  // Set start date to the beginning of the day

      end = parseDate(endDate);
      end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
    }

    const {
      min_age,
      max_age,
      min_height_in_cm,
      max_height_in_cm,
      min_salary,
      max_salary,
      gender,
      marital_status,
      religion,
      caste,
      mother_tongue,
      country,
      residential_status,
      manglik,
      highest_education,
      annual_income,
    } = preferences;

    // Get the current date for age calculation
    const currentDate = new Date();

    const query = {
      _id: { $ne: user_id },
      dob: {
        $gte: new Date(
          currentDate.getFullYear() - max_age,
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        $lte: new Date(
          currentDate.getFullYear() - min_age,
          currentDate.getMonth(),
          currentDate.getDate()
        ),
      },
      heightInCm: { $gte: min_height_in_cm, $lte: max_height_in_cm },
      annual_income: { $gte: min_salary, $lte: max_salary },
      gender: gender,
      //manglik: manglik
    };

    // Add religion filter if it's not "Any"
    if (religion && religion !== "Any") {
      query.religion = religion;
    }

    // if (marital_status && marital_status !== "Any") {
    //   query.marital_status = marital_status;
    // }

    if (manglik && manglik !== "Any") { 
      query.manglik = manglik;
    }

    if(start && end) {
      query.created_at = {
        $gte: start,
        $lte: end,
      };
    }

    // Find users matching the preferences
    const matchedUsers = await User.find(query);

    if (!matchedUsers || matchedUsers.length === 0)
      return next(new ApiError("No match found for this user.", 404));

    const usersWithDistances = matchedUsers.map((user) => {
      const currentUserLocation = req.user?.location?.coordinates;
      const matchedUserLocation = user?.location?.coordinates;

      const distance =
        currentUserLocation && matchedUserLocation
          ? haversineDistance(currentUserLocation, matchedUserLocation)?.toFixed(2)
          : null;

      const age = calculateAge(user.dob);

      return {
        _id: user._id,
        profile_for: user.profile_for,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        profile_image: user.profile_image,
        height: user.height,
        state: user.state,
        city: user.city,
        highest_education: user.highest_education,
        annual_income: user.annual_income,
        marital_status: user.marital_status,
        caste: user.caste,
        occupation: user.occupation,
        distance: distance,
        age: age,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Matching users found.",
      data: usersWithDistances,
    });
  } catch (error) {
    next(error);
  }
};

const singleMatchedUser = async (req, res, next) => {
  try {
    const matchedUserId = req.params.id;

    if (!isValidObjectId(matchedUserId)) {
      return next(new ApiError("Invalid userId", 400));
    }

    const matchedUser = await User.findOne({ _id: matchedUserId }).exec();

    if (!matchedUser) {
      return next(new ApiError("User not found", 400));
    }

    const currentUserLocation = req.user?.location?.coordinates;
    const matchedUserLocation = matchedUser?.location?.coordinates;

    const distance =
      currentUserLocation && matchedUserLocation
        ? haversineDistance(currentUserLocation, matchedUserLocation)?.toFixed(2)
        : null;

    const age = calculateAge(matchedUser.dob);  

    // Convert to plain object if needed
    const responseUser = matchedUser.toObject ? matchedUser.toObject() : matchedUser;

    // Include distance and age in the response
    responseUser.distance = distance;
    responseUser.age = age;

    delete responseUser.location;
    delete responseUser.otp_expiry;
    delete responseUser.heightInCm;

    return res.status(200).json({
      success: true,
      message: "Matched user found.",
      data: responseUser,
    });

  } catch (error) {
    console.log("error", error);
    next(error);
  }
};


module.exports = { 
  partnerPreferences, 
  getPreference,
  matchedUsers, 
  singleMatchedUser 
};
