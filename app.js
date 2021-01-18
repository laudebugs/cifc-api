// create an express app
const express = require("express");
const app = express();
const GSheetReader = require("g-sheets-api");
const cheerio = require("cheerio");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const fbpage = require("fbpage");

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

  const myPage = await fbpage("cknyu");
  res.json({});
});
// start the server listening for requests
app.listen(process.env.PORT || 4000, () => console.log("Server is running..."));
