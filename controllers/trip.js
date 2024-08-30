const tripModal = require("../models/trip");
const cityModal = require("../models/city");

const tripController = async (req, res) => {
  try {
    const { sourceCityId, destinationCityId, travelDate } = req.body;
  } catch (error) {}
};

module.exports = { tripController };
