const conf = require("../config");
const authenticate = require("../donotedit/donotedit").authenticate;

/**
 * Indice: la config est présente dans un certain fichier config ;-)
 *
 */
function validateConfig() {
  return authenticate();
}

module.exports = {
  validateConfig
};
