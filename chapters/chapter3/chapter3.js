const axios = require("axios");
const conf = require("../config");

/**
 * CODE MOI
 * - Faire un appel http à l'API en attaquant le path suivant /api/soldiers
 *
 * @returns un tableau contenant les soldats disponibles
 *
 */
function retrieveSoldiers() {
  return axios.todo;
}

/**
 * CODE MOI
 * - filtrer les résultats en ne récupérant que les nains et les elfes
 *
 * @returns un tableau contenant uniquement les soldats elfes et nains
 */
function getDwarfsAndSindarins() {
  return retrieveSoldiers().todo;
}

/**
 * CODE MOI
 * - modifier le contenu du tableau des soldats en ne gardant que la statistique de santé
 *
 * @returns un tableau contenant tous les soldats mais ne contant que les champs 'name', 'race' et 'health'
 */
function retrieveSoldiersWithOnlyHealthStat() {
  return retrieveSoldiers().todo;
}

/**
 * CODE MOI
 * - Récupérer un unique objet contenant la somme totale de toutes les stats de notre armée
 *
 * @returns un unique objet {agility: xxx, intellect: xxx, strength: xxx, health: xxx}
 */
function retrieveConsolidatedStats() {
  return retrieveSoldiers().todo;
}

module.exports = {
  retrieveSoldiers,
  getDwarfsAndSindarins,
  retrieveSoldiersWithOnlyHealthStat,
  retrieveConsolidatedStats
};
