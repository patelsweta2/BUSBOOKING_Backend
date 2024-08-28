const citiesData = require("./data/city.json");
const CityModel = require("./models/city");

CityModel.insertMany(citiesData)
  .then(() => console.log("Cities inserted successfully"))
  .catch((error) => console.error("Error inserting cities:", error));
