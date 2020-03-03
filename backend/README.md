backend
=======

Le backend est un simple projet Express.js

La liste des clientId utilisables se trouve dans `data/clientIds`. Ne pas hésiter à les imprimer.

Garder le `111` secret pour le formateur pour pas galérer quand vous faites la démo des chapitres pour aider les gens en retard.

## Usage

Démarrer le serveur sur le port 8080: `npm install && npm start`

On peut préciser un autre port en fournissant une variable d'environnement: `PORT=9000 npm start`

:warning: si le port change il faut changer la config du dashboard et la config dans le répertoire chapters pour que tout pointe sur la bonne URL.

## Pourquoi

Pour que la solution ne se trouve pas dans le TU, j'ai préféré vérifier le résultat côté serveur. Les "étudiants" envoient donc le résultat de leur méthode via les TUs et le serveur valide ou pas l'exercice.