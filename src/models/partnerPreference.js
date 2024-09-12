const partnerPreferencesSchema = new mongoose.Schema(
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      min_age: { type: Number, required: true },
      max_age: { type: Number, required: true },
      min_height: { type: Number, required: true }, // in cm
      max_height: { type: Number, required: true }, // in cm
      gender: {type: String, required: true},
      marital_status: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
      religion: { type: String, required: true },
      caste: { type: String, required: true },
      mother_tongue: { type: String, required: true },
      country: { type: String, required: true },
      residential_status: { type: String, required: true }, // e.g., 'Citizen', 'Permanent Resident', etc.
      manglik: { type: String, enum: ['Yes', 'No', 'Don\'t Know'], required: true },
      highest_education: { type: String, required: true },
      college_name: { type: String, required: true },
      company_name: { type: String, required: true },
      employed_in: { type: String, required: true },
      occupation: { type: String, required: true },
      annual_income: { type: String, required: true }, // Could be a range or exact value
    },
    {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      collection: 'partner_preferences',
    }
  );
  
  const PartnerPreferences = mongoose.model('PartnerPreferences', partnerPreferencesSchema);
  module.exports = PartnerPreferences;
  