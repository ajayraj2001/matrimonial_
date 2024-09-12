const { Dhyaan } = require('../../../models');

const getDhyaanById = async (req, res, next) => {
  try {
    const dhyaan = await Dhyaan.findById(req.params.id);
    if (!dhyaan) return res.status(404).json({ success: false, message: 'Dhyaan not found' });

    dhyaan.clicks += 1

    await dhyaan.save()
    return res.status(200).json({
      success: true,
      message: 'Dhyaan retrieved successfully',
      data: { dhyaan },
    });
  } catch (error) {
    next(error);
  }
};

const getAllDhyaans = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    // Convert page and limit to integers and set default values
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    // Create a search query object
    let searchQuery = {};
    if (search) {
      // Perform a case-insensitive search for dhyanName
      searchQuery.dhyanName = new RegExp(search, 'i');
    }

    // Fetch dhyaans with a single query, prioritizing those with a `priority` field
    const dhyaans = await Dhyaan.aggregate([
      {
        $match: searchQuery // Filter documents based on search query
      },
      {
          $addFields: {
              // Set 'priority' to a high value if it's null (for correct sorting)
              priority_sort: {
                $ifNull: [
                    "$priority",    // Field to check
                    Infinity        // Value to use if field is null or does not exist
                ]
            }
          }
      },
      {
          $sort: {
              priority_sort: 1,  // Sort by the adjusted 'priority' (nulls last)
              _id: -1            // Sort by '_id' in descending order within the same priority
          }
      },
      {
          $skip: (pageNumber - 1) * pageSize
      },
      {
          $limit: pageSize
      },
      {
          $project: {
              priority_sort: 0  // Remove the temporary 'priority_sort' field
              // Include other fields as needed, or exclude them by not listing them here
          }
      }
  ]);


  console.log('dhyaan', dhyaans)
    // Count the total number of documents based on the search query
    const total_data = await Dhyaan.countDocuments(searchQuery);

    // Calculate the total number of pages
    const total_pages = Math.ceil(total_data / pageSize);

    return res.status(200).json({
      success: true,
      message: 'Dhyaans retrieved successfully',
      dhyaans,
      pagination: {
        total_data,
        total_pages,
        current_page: pageNumber,
        page_size: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};



 
module.exports = { getDhyaanById, getAllDhyaans};
