const CandidateModel = require("../models/CandidateModel");
const excelToJson = require("convert-excel-to-json");

const controller = async (req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const file = req.files.file;
    const filename = file.name;
    const sourcePath = __basedir + "/public/uploads/" + filename;

    //Moves the uploaded file to the preferred location
    await file.mv(sourcePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Could not upload the file" });
      }
    });

    const sheets = await excelToJson({
      sourceFile: sourcePath,

      // Header Row -> be skipped and will not be present at our result object.
      header: {
        rows: 1,
      },
      // Mapping columns to keys
      columnToKey: {
        A: "name",
        B: "email",
        C: "mobile",
        D: "dob",
        E: "experience",
        F: "resumeTitle",
        G: "currLocation",
        H: "postalAdd",
        I: "currEmployer",
        J: "currDesignation",
      },
    });
    //console.log(sheets);

    for (const sheet in sheets) {
      //mongoose query to filter candidates by finding duplicates against the
      //database and uploading them one-by-one to mongoDB
      /*sheets[sheet].forEach((candidate) => {
        let duplicate = CandidateModel.aggregate([
          { $match: { email: candidate.email } },
        ]);
        console.log(duplicate);
        if (duplicate.length == 0) {
          CandidateModel.create(candidate);
        }
      });*/

      let candArray = sheets[sheet];
      let emails = [];
      let nonDupArr = [];
      //filters out duplicate rows based on email attribute
      for (let i = 0; i < candArray.length; i++) {
        if (!emails.includes(candArray[i]["email"])) {
          nonDupArr.push(candArray[i]);
          emails.push(candArray[i]["email"]);
        }
      }

      //inserts into mongoDB
      await CandidateModel.insertMany(nonDupArr, { ordered: false }, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    console.log("File uploaded and Data imported to mongoDB successfully");
    return res.status(200).json({
      msg: "File is uploaded and processed data is imported into mongoDB successfully ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg:
        error.msg ||
        "There is a problem with the server, please again click the upload button ",
    });
  }
};

//GET request for api/excel/candidates end-point
const getCandidates = (req, res) => {
  CandidateModel.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

module.exports = {
  controller,
  getCandidates,
};
