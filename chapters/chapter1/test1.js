var assert = require("assert");
var axios = require("axios");
var conf = require("../config");
const validateConfig = require("./chapter1").validateConfig;

describe("chapter1", function() {
  it("la config est valide et l'appel à l'API est OK", function(done) {
    console.log(validateConfig);
    validateConfig()
      .then(result => {
        console.log(result);
        done();
      })
      .catch(error => {
        console.error(error.message);
        done(error);
      });
  });
});
