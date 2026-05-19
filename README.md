# Nom du projet : BackTrack Quiz

## Description courte
Un jeu de blind-test musical où les chansons sont jouées à l'envers. Le joueur doit deviner le titre original.

## Problème résolu
Animer des soirées ou des pauses avec un jeu rapide, fun et sans installation complexe, tout en proposant un défi auditif original.

## Utilisateurs cibles
Les amateurs de musique, les étudiants, et toute personne cherchant un mini-jeu de navigateur rapide.

## Fonctionnalités principales envisagées
- Lecture audio d'extraits musicaux inversés.
- Formulaire de soumission de réponse.
- Validation de la réponse avec tolérance aux fautes de frappe (algorithme de distance).
- Suivi du score de la session.

## Stack technique choisie
- Front-end : HTML/CSS/JS Vanilla (ou framework léger type Vue.js/React selon les préférences de l'équipe).
- Back-end : API Python (FastAPI/Flask) ou Node.js (Express) pour servir les fichiers et valider les réponses.

## Contraintes identifiées
- Temps de développement très court (3 demi-journées).
- Devoir générer ou trouver les fichiers audio inversés à l'avance pour gagner du temps.

## Risques techniques
- Gestion des erreurs de saisie utilisateur pour ne pas générer de frustration.
- Problème de lecture audio automatique (autoplay) sur certains navigateurs.