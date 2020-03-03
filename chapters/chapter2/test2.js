var assert = require("assert");
var axios = require("axios");
var conf = require("../config");
const getYourOwnteam = require("./chapter2").getYourOwnTeam;

describe("chapter2", function() {
  it("should be able to retrieve our team", function(done) {
    console.log(getYourOwnteam);
    getYourOwnteam()
      .then(result => {
        console.log(result);
        done();
      })
      .catch(error => {
        console.error(`${error.message}`);
        done(error);
      });
  });
});
