var assert = require("assert");
var axios = require("axios");
var conf = require("../config");
const { validateChapterResult } = require("../donotedit/donotedit");
const { readSauronCSVFile, consolidateSauronStats } = require("./chapter4");

describe("chapter4", function() {
  it("lire le contenu du fichier csv", function(done) {
    const result = readSauronCSVFile();
    console.log(result);
    validateChapterResult(4, "readSauronCSVFile", { actual: result })
      .then(result => {
        done();
      })
      .catch(error => {
        console.error(error.message);
        done(error);
      });
  });

  it("aggréger les données du fichier de Sauron", function(done) {
    const result = consolidateSauronStats();
    console.log(result);
    validateChapterResult(4, "consolidateSauronStats", result)
      .then(result => {
        done();
      })
      .catch(error => {
        console.error(error.message);
        done(error);
      });
  });
});
