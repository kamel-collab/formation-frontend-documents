# Application Mes documents — liaison à l'API

Cette branche relie l'interface du jour 1 à l'API Laravel : les titres et les catégories sont chargés depuis la base et les ajouts sont envoyés avec `fetch`. Aucun fichier n'est téléversé. La préférence d'affichage compact reste dans `localStorage`.

## Démarrer

1. Dans le projet [Laravel](https://github.com/kamel-collab/formation-laravel-special), utilisez la branche `jour2-api-crud-documents`, démarrez Docker et exécutez les migrations dans la base de formation.
2. Ouvrez `index.html` dans le navigateur. Le JavaScript appelle l'API à l'adresse `http://localhost:8088/api/documents`.

Laravel prend en charge CORS pour ses routes API avec sa configuration par défaut. Le navigateur peut ainsi lire la réponse lorsque l'interface et l'API ont des origines différentes. Cette configuration ouverte convient à la démonstration locale ; elle devra être adaptée à une application réelle.

Le [TD Fetch](TD-Fetch-Documents.md), disponible sur la branche `jour1-ressources-stockage`, explique pas à pas le code et les vérifications. Le [guide de démarrage du jour 1](GUIDE.md) reste disponible pour les étapes précédentes.
