const http = require("http");
const conf = require("../config");
const axios = require("axios");

function authenticate() {
  const url = conf.baseUrl + "/authenticate";
  console.log("calling GET " + url);
  return new Promise((resolve, reject) => {
    http
      .get(url, { headers: { clientId: conf.clientId } }, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          console.log(data);
          if (resp.statusCode !== 200) {
            throw new Error(
              `Invalid return code. Expected 200 but was ${resp.statusCode}`
            );
          }
          resolve(data);
        });
      })
      .on("error", err => {
        console.error("Error: " + err.message);
        reject(err);
      });
  });
}

function validateChapterResult(chapter, method, actual) {
  const url = `${conf.baseUrl}/validateChapter/${chapter}/${method}`;
  return axios
    .post(url, actual, { headers: { clientId: conf.clientId } })
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`POST ${url} ${error.message}`);
      throw error;
    });
}

module.exports = {
  authenticate,
  validateChapterResult
};
