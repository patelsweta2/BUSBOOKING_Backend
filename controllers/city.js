const cityModal = require("../models/city");

const cityController = async (req, res) => {
  try {
    // Get the query parameter 'name' from the request
    const { name } = req.query;

    // Build the query object
    let query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Fetch cities based on the query
    const cities = await cityModal.find(query).limit(5);
    // Format the response
    const response = {
      cities: cities.map((city) => ({
        cityId: city._id.toString(),
        name: city.name,
        state: city.state,
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

module.exports = {
  cityController,
};
