const appUser = require ("../models/appUserModel");
const spreadsheet = require ("../models/spreadsheetModel");

// Save Spreadsheet Data
exports.saveSpreadsheet = [ 
async (req, res) => {
  const { userId, arrayData } = req.body;
  // Validate the user exists
  const user = await appUser.findById({_id: userId});
  if (!user) {
    throw new Error('User not found');
  }
  try {
    const spreadsheetData = new spreadsheet({      
      arrayData,
      user: userId,
    });
    await spreadsheetData.save();
    res.status(201).json(spreadsheetData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving data" });
  }
}
];