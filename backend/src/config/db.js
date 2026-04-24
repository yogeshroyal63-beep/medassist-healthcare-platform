const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const connectDb = async () => {
  await mongoose.connect(mongoUri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
};

module.exports = connectDb;
