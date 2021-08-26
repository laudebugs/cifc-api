"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function (resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
/// <reference path="@types/node"
const url = require("url");
const got = require("got");
const baseUrl = "https://www.facebook.com";

module.exports = {
  getCoverPhoto: function (slug) {
    return __awaiter(this, void 0, void 0, function* () {
      const address = new url.URL(`/pg/${slug}/posts/`, baseUrl).href;
      const response = yield got(address, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0",
        },
      });

      let string = response.body;
      console.log(string)
      let index = string.indexOf('{"coverPhotoData');
      // start from the index
      let curr = index;
      for (let i = 0; i < 3; i++) {
        // loop until we find the fourth closing brace
        let c = string.charAt(curr);
        do {
          curr += 1;
        } while (string.charAt(curr) !== "}");
        curr += 1;
      }
      var data = JSON.parse(string.substring(index, curr) + "}");
      return data.coverPhotoData.uri;
    });
  },
};
