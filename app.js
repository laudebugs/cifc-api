require('dotenv').config()
// create an express app
const express = require("express");
const app = express();
const helperFuncs = require("./helperFuncs");
const cors = require("cors");
const { GoogleSpreadsheet } = require('google-spreadsheet');
var fs = require('fs');
const clubCovers = require('./clubs.json');

(async function() {
  const doc = new GoogleSpreadsheet(process.env.G_SHEETS_ID);
  await doc.useApiKey(process.env.CIFC_API_KEY);
  await doc.loadInfo()
  
  
  // use the express-static middleware
  app.use(express.static("public"));
  app.use(cors());

  app.all("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // define the first route
  app.get("/calendar", function (req, res) {
    res.send('work in progress')
  })

  app.get("/clubs", async function (req, res) {
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const defaultRows = rows.map(row => {
      const clubdata = row._rawData
      clubdata.push(clubCovers[clubdata[0]])
      return row._rawData
    })
    res.json({data: defaultRows});
  });
  
  async function getFbCover(link) {
    let begin = link.indexOf("com");
    let pageName = link.substring(begin + 4);
    if (pageName[pageName.length - 1] === "/") {
      console.log("remove backslash");
      pageName = pageName.substring(0, pageName.length - 1);
    }
    try {
      const photoLink = await helperFuncs.getCoverPhoto(pageName);
      return photoLink;
    } catch (error) {
      console.log(error);
      // if there is an error send a blank link
      return "https://mcdn.wallpapersafari.com/medium/36/29/9hlsuO.png";
    }
  }
  async function retrievClubFBCoverPhotos(document){
    const sheet = document.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const data = Promise.all(rows.map(async (row, i) => {
      const fbLink = row._rawData[9]
      if(!fbLink) {
         let coverImage = "https://mcdn.wallpapersafari.com/medium/36/29/9hlsuO.png";
         return Promise.resolve({club: row._rawData[0], image: coverImage})
      }
      else {
        let cover = await getFbCover(fbLink)
        console.log(cover)
        return Promise.resolve({club: row._rawData[0], image: cover})
      } 
    }))
    data.then(res => {
      const library = {}
      res.forEach(club => {
        library[club.club] = club.image
      })
      fs.writeFileSync('clubs.json', JSON.stringify(library))
    })
  }
  app.get("/fbcover", async function (req, res) {
    console.log(req)
    var link = req.query.link;
    let begin = link.indexOf("com");
    let pageName = link.substring(begin + 4);
    if (pageName[pageName.length - 1] === "/") {
      pageName = pageName.substring(0, pageName.length - 1);
      console.log(pageName);
    }
    try {
      const photoLink = await helperFuncs.getCoverPhoto(pageName);
      console.log(photoLink);
      res.json(JSON.stringify({ coverPhotoLink: photoLink }));
    } catch (error) {
      console.log(error.message);
      // if there is an error send a blank link
      res.json({
        coverPhotoLink:
          "https://mcdn.wallpapersafari.com/medium/36/29/9hlsuO.png",
      });
    }
  });

  app.get("*", (req, res) => {
    res.json({ message: "how did you land here?" });
  });

  // start the server listening for requests
  app.listen(process.env.PORT || 4000, () => console.log("Server is running..."));

}());



