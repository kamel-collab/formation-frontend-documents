# Application Mes documents — ressources et stockage

Cette copie présente les notions front-end du jour 1. Les documents ajoutés restent temporaires et aucun fichier n'est envoyé.

Le [guide de démarrage](GUIDE.md) explique comment cloner le dépôt et choisir l'étape de la formation.

## Ouvrir l'application

Ouvrir `index.html` dans un navigateur. Bootstrap est fourni dans le projet : l'interface fonctionne sans connexion Internet et sans serveur Python.

## Ressources locales, CDN et environnement isolé

Les fichiers Bootstrap sont dans `assets/vendor/bootstrap` et sont chargés localement par `index.html`.

Un CDN fournirait ces fichiers depuis un service externe. Ici, aucune connexion à un CDN n'est nécessaire : cette organisation convient à une démonstration hors ligne, y compris dans un environnement isolé si les fichiers y sont déjà disponibles.

## localStorage : préférence d'affichage

Activer **Affichage compact**, puis recharger la page : le choix reste mémorisé par le navigateur s'il autorise le stockage local. Le code commenté se trouve dans `assets/js/securite.js`.

Dans les outils de développement, ouvrir **Application > Stockage local** et chercher `formation_affichage_compact`. L'organisation et le comportement du stockage peuvent varier lors d'une ouverture directe en `file://` ; si nécessaire, utiliser un serveur web local pour cette démonstration.

Ce stockage conserve seulement une préférence non sensible. Ne pas y stocker de mot de passe ou d'identifiant de session : les scripts exécutés dans la page peuvent le lire.

