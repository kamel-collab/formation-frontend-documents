# Application Mes documents — liaison à l'API

Cette branche relie l'interface du jour 1 à l'API Laravel : les titres et les catégories sont chargés depuis la base et les ajouts sont envoyés avec `fetch`. Aucun fichier n'est téléversé. La préférence d'affichage compact reste dans `localStorage`.

## Démarrer

1. Dans le projet [Laravel](https://github.com/kamel-collab/formation-laravel-special), utilisez la branche `jour2-api-crud-documents`, démarrez Docker et exécutez les migrations dans la base de formation.
2. Dans le dossier de cette interface, démarrez son serveur :

```bash
docker compose up -d
```

3. Ouvrez <http://localhost:8089>. Utilisez cette adresse plutôt que l'ouverture directe de `index.html` pour les échanges avec l'API.

Le serveur web sert l'interface et transmet les requêtes `/api/` au service Laravel sur le réseau Docker. Démarrez Laravel avant l'interface afin que ce réseau soit disponible. Le premier démarrage peut télécharger l'image Caddy.

Le [TD Fetch](TD-Fetch-Documents.md), disponible sur la branche `jour1-ressources-stockage`, explique pas à pas le code et les vérifications. Le [guide de démarrage du jour 1](GUIDE.md) reste disponible pour les étapes précédentes.
