codelab-js
==========

Coding Dojo en JS pour s'initier au Javascript en se tirant la bourre entre collègues.

## Déroulement

*  Distribuer à chaque participant un des papiers avec un UUID dessus (ces UUID sont hard codés dans le TP donc c'est bien ceux la qu'il faut).
*  Les "étudiants" se connectent sur le dashboard pour créer leur équipe (npm d'équipe, le clientId correspond à l'UUID fourni, fournir un lien vers une image pour l'avatar de l'équipe)
*  une fois son équipe créée, elle devient visible sur le dashboard et on peut commencer à résoudre les problèmes dans les différents chapitres

L'avancement se met à jour automatiquement via [SSE](https://developer.mozilla.org/en-US/docs/Web/API/EventSource#Examples). Guess what ça marche pas sous IE :p

## Formateur

Le formateur a le projet sur la branche master sur son poste.

Lancer le backend: `cd backend && npm install && npm start`

Lancer le dashboard: `cd dashboard && npm install && npm start`

:warning: pour l'instant il faut que le formateur et les "étudiants" se trouvent sur le même réseau local. J'ai testé à une dizaine sur un partage wifi sur mon portable ça passe. Juste si possible faire les npm install sur ler propre réseau avant.

## Etudiant

Tout se passe dans le répertoire `chapters`. Se référer au README qui s'y trouve.

