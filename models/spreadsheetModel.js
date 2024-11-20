const mongoose = require("mongoose");

const { Schema } = mongoose;

const spreadsheetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appUser",
    required: true,
  },
  arrayData: {
    type: [String],
    required: true,
  }, // Save your array here
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const spreadsheet = mongoose.model("spreadsheet", spreadsheetSchema);
module.exports = spreadsheet;
