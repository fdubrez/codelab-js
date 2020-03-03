const fs = require("fs");

/**
 * CODE MOI
 * - Lire le contenu du fichier csv et retourner le résultat
 * aide: fs.readFileSync
 * utilise un chemin absolu pour éviter les embûches
 *
 * @returns une String contenant le contenu du fichier
 *
 */
function readSauronCSVFile() {
  // TODO
}

/**
 * CODE MOI
 * - Lire le contenu du fichier csv et retourner un objet avec les stats consolidées
 *
 * @returns un objet du style {health: xxx, kills: xxx, uptime: xxx}
 *
 */
function consolidateSauronStats() {
  // TODO
}

module.exports = {
  readSauronCSVFile,
  consolidateSauronStats
};
