# Application Mes documents

Interface du projet fil rouge : navigation, liste de documents et formulaire responsive.

Le [guide de démarrage](GUIDE.md) explique comment cloner le dépôt et choisir l'étape de la formation.

## Ouvrir l’application

Ouvrir `index.html` dans un navigateur. Bootstrap 5.3.8 est fourni dans `assets/vendor/bootstrap` : aucune connexion Internet ni installation n’est nécessaire.

## Organisation

```text
app-html-css-js/
├── index.html                    Structure et composants Bootstrap
├── assets/
│   ├── css/style.css             Couleurs et styles personnalisés
│   ├── js/app.js                 Ajout et validation du formulaire
│   └── vendor/bootstrap/         Bootstrap et sa licence
└── README.md
```

## Fonctionnement

- Les trois premiers documents sont fictifs.
- Le formulaire ajoute une ligne temporaire dans la page. Un rechargement rétablit la liste initiale.
- Le fichier sélectionné reste sur l’ordinateur : seul son nom est affiché. Aucun fichier ni aucune donnée n’est envoyé ou enregistré.
- Les champs sont vérifiés côté navigateur pour la démonstration. La validation et le stockage sécurisés seront réalisés côté Laravel lors des prochaines étapes.

## Points à observer

- `navbar`, `navbar-expand-md` et `collapse` : navigation adaptée aux petits écrans.
- `container`, `row`, `col-*` et `g-4` : mise en page responsive.
- `card`, `form-control`, `form-select` et `btn` : composants Bootstrap.
- `app.js` : événements, validation du formulaire et mise à jour du DOM.
