// create an express app
const express = require("express");
const app = express();
const GSheetReader = require("g-sheets-api");
const helperFuncs = require("./helperFuncs");

// use the express-static middleware
app.use(express.static("public"));

// define the first route
app.get("/calendar", function (req, res) {
  const options = {
    sheetId: "1ehQTOwEVI3-g8UNx6oJ34nHJzp8wL2g1PLfTKJ7sKAA",
    sheetNumber: 1,
    returnAllResults: true,
  };
  GSheetReader(
    options,
    (results) => {
      res.json(results);

      // do something with the results here
    },
    (error) => {
      // OPTIONAL: handle errors here
    }
  );
});
app.get("/clubs", function (req, res) {
  const options = {
    sheetId: "1i1BEQL3iehSZiMcL11Xz6g90xz3O7XU7lplrFTiDDH4",
    sheetNumber: 1,
    returnAllResults: true,
  };
  GSheetReader(
    options,
    (results) => {
      res.json(results);

      // do something with the results here
    },
    (error) => {
      // OPTIONAL: handle errors here
    }
  );
});
app.get("/fbcover", async function (req, res) {
  var link = req.query.link;
  let begin = link.indexOf("com");
  let pageName = link.substring(begin + 4);

  try {
    const photoLink = await helperFuncs.getCoverPhoto(pageName);
    res.json({ coverPhotoLink: photoLink });
  } catch (error) {
    console.log(error);
    // if there is an error send a blank link
    res.json({ coverPhotoLink: "" });
  }
});
// start the server listening for requests
app.listen(process.env.PORT || 4000, () => console.log("Server is running..."));
