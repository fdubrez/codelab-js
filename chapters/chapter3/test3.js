var assert = require("assert");
var axios = require("axios");
var conf = require("../config");
const { validateChapterResult } = require("../donotedit/donotedit");
const {
  retrieveSoldiers,
  getDwarfsAndSindarins,
  retrieveSoldiersWithOnlyHealthStat,
  retrieveConsolidatedStats
} = require("./chapter3");

describe("chapter3", function() {
  it("on doit pouvoir récupérer la liste des soldats", function(done) {
    retrieveSoldiers()
      .then(result => {
        return validateChapterResult(3, "retrieveSoldiers", result);
      })
      .then(result => {
        done();
      })
      .catch(error => {
        console.error(error.message);
        done(error);
      });
  });

  it("récupérer les soldats et n'afficher que les nains et les elfes", function(done) {
    getDwarfsAndSindarins()
      .then(result => {
        return validateChapterResult(3, "getDwarfsAndSindarins", result);
      })
      .then(result => {
        done();
      })
      .catch(error => {
        console.error(error.message);
        done(error);
      });
  });

  it("récupérer uniquement les stats de santé", function(done) {
    retrieveSoldiersWithOnlyHealthStat()
      .then(result => {
        return validateChapterResult(
          3,
          "retrieveSoldiersWithOnlyHealthStat",
          result
        );
      })
      .then(result => {
        done();
      })
      .catch(error => {
        console.error(error.message);
        done(error);
      });
  });

  it("récupérer les stats consolidés de notre armée", function(done) {
    retrieveConsolidatedStats()
      .then(result => {
        return validateChapterResult(3, "retrieveConsolidatedStats", result);
      })
      .then(result => {
        done();
      })
      .catch(error => {
        console.error(error.message);
        done(error);
      });
  });
});
