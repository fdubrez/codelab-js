const axios = require("axios");
const conf = require("../config");

/**
 * CODE MOI
 * - Faire un appel http à l'API en attaquant le path suivant /api/teams/{clientId}
 * - Vous devez renseigner le header 'clientId' pour vous authentifier auprès de l'API
 * - doc du client HTTP: https://github.com/axios/axios
 *
 * N'oubliez pas que la config est présente dans un certain fichier config ;-)
 *
 */
function getYourOwnTeam() {
  return axios.toto;
}

module.exports = {
  getYourOwnTeam
};
