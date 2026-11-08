# Application Mes documents — API sécurisée

Cette branche contient la correction du TD du jour 4. L'interface se connecte à l'API de la branche Laravel `jour3-securite-documents`.

## Essayer

1. Vérifiez que l'API du jour 3 est configurée et disponible sur `http://localhost:8088`. Utilisez une base locale de formation déjà préparée et les comptes donnés par le formateur.
2. Ouvrez `index.html` dans le navigateur, connectez-vous, puis créez un document.
3. Sur sa ligne, choisissez un PDF fictif de 1 Mo maximum, cliquez sur **Envoyer le PDF**, puis sur **Télécharger le PDF**.
4. Déconnectez-vous, connectez-vous avec le second compte et vérifiez que son utilisateur ne voit pas les documents du premier.

Le token Sanctum reste uniquement dans la mémoire de la page. Un rechargement demande une nouvelle connexion. La déconnexion tente également de révoquer le token sur le serveur. Aucun mot de passe ni token n'est enregistré dans `localStorage` : seule la préférence d'affichage compact y est conservée.

La création des informations du document et l'envoi du PDF sont deux requêtes distinctes. Si l'envoi échoue, le document existe déjà : réessayez depuis sa ligne plutôt que de le créer une seconde fois. L'API accepte un seul fichier par document et masque son chemin privé ; un téléchargement sans fichier accessible renvoie 404. La validation du navigateur ne remplace pas celle de Laravel.

## Guide

Le TD `TD-Interface-API-Securisee.md` est disponible sur la branche de départ `jour2-fetch-documents`. Suivez-le pour construire cette correction étape par étape. Les guides des jours précédents restent disponibles dans le dépôt.
