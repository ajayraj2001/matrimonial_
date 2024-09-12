const { ApiError } = require("../../errorHandler");
const { PartnerPreferences } = require("../../models");

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
      existingPreferences.set({
        min_age: min_age !== undefined ? min_age : existingPreferences.min_age,
        max_age: max_age !== undefined ? max_age : existingPreferences.max_age,
        min_height: min_height !== undefined ? min_height : existingPreferences.min_height,
        max_height: max_height !== undefined ? max_height : existingPreferences.max_height,
        gender: gender !== undefined ? gender : existingPreferences.gender,
        marital_status: marital_status !== undefined ? marital_status : existingPreferences.marital_status,
        religion: religion !== undefined ? religion : existingPreferences.religion,
        caste: caste !== undefined ? caste : existingPreferences.caste,
        mother_tongue: mother_tongue !== undefined ? mother_tongue : existingPreferences.mother_tongue,
        country: country !== undefined ? country : existingPreferences.country,
        residential_status: residential_status !== undefined ? residential_status : existingPreferences.residential_status,
        manglik: manglik !== undefined ? manglik : existingPreferences.manglik,
        highest_education: highest_education !== undefined ? highest_education : existingPreferences.highest_education,
        college_name: college_name !== undefined ? college_name : existingPreferences.college_name,
        company_name: company_name !== undefined ? company_name : existingPreferences.company_name,
        employed_in: employed_in !== undefined ? employed_in : existingPreferences.employed_in,
        occupation: occupation !== undefined ? occupation : existingPreferences.occupation,
        annual_income: annual_income !== undefined ? annual_income : existingPreferences.annual_income,
      });

      // Save the updated document
      await existingPreferences.save({ validateBeforeSave: false });

      return res
        .status(200)
        .json({
          success: true,
          message: "Partner preferences updated successfully",
          data: existingPreferences,
        });
    } else {
      // Create a new document

      // Validate input
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
      });

      // Save the new document
      const savedPreferences = await newPreferences.save();

      return res
        .status(201)
        .json({
          success: true,
          message: "Partner preferences created successfully",
          data: savedPreferences,
        });
    }
  } catch (error) {
    console.error("Error handling partner preferences:", error);
    return res.status(500).json({success: true, message: error.message });
  }
};

module.exports = { partnerPreferences };
