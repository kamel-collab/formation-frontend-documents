# Guide de démarrage : interface Mes documents

## Objectif

Ce dépôt rassemble deux états successifs de l'interface réalisée au jour 1. Il ne nécessite ni PHP, ni Composer, ni Docker pour ces deux étapes : les fichiers HTML, CSS, JavaScript et Bootstrap sont déjà fournis.

| Branche | Contenu |
| --- | --- |
| `jour1-interface` | Interface responsive, liste fictive et formulaire en JavaScript. |
| `jour1-ressources-stockage` | Même interface avec une préférence d'affichage conservée dans `localStorage`. |

Les documents ajoutés restent temporaires : ils disparaissent au rechargement. Aucun fichier ni donnée de document n'est envoyé à Laravel à ces étapes.

## 1. Cloner le projet

Ouvrez un terminal dans le dossier où vous souhaitez placer le projet et exécutez :

```bash
git clone --branch jour1-interface https://github.com/kamel-collab/formation-frontend-documents.git app-frontend-documents
cd app-frontend-documents
```

Ouvrez ensuite le dossier `app-frontend-documents` dans VS Code. Si vous possédez déjà une copie du projet, ouvrez-la au lieu de la cloner à nouveau.

## 2. Ouvrir et essayer l'interface

Ouvrez `index.html` dans un navigateur. La page affiche trois documents fictifs. Complétez le formulaire et ajoutez un document : une ligne apparaît dans la liste. Rechargez la page : les ajouts temporaires disparaissent.

Le fichier éventuellement sélectionné reste sur votre ordinateur. L'interface affiche son nom pour la démonstration, mais ne l'envoie pas.

## 3. Passer à l'étape ressources et stockage

Dans un terminal ouvert à la racine du projet, vérifiez l'état de votre travail :

```bash
git status
```

Sauvegardez votre travail avant de changer de branche. Si Git refuse le changement à cause de modifications locales, demandez de l'aide au formateur ; ne supprimez pas vos fichiers.

Pour récupérer la liste des branches, puis ouvrir la seconde étape :

```bash
git fetch origin
git switch jour1-ressources-stockage
```

Rechargez `index.html` dans le navigateur. Activez **Affichage compact**, puis rechargez : cette préférence reste mémorisée si le navigateur autorise `localStorage`. Seule la préférence est conservée, pas les documents. Selon le navigateur, le stockage peut fonctionner différemment pour une page ouverte directement en `file://`.

## 4. Se repérer dans les fichiers

- `index.html` : structure et éléments de l'interface.
- `assets/css/style.css` : styles personnalisés.
- `assets/js/app.js` : comportement du formulaire et de la liste.
- `assets/js/securite.js` : préférence d'affichage dans la branche `jour1-ressources-stockage`.
- `assets/vendor/bootstrap/` : Bootstrap et sa licence, disponibles localement.

L'API Laravel est dans un [dépôt distinct](https://github.com/kamel-collab/formation-laravel-special). La liaison avec `fetch` sera réalisée lors d'une étape ultérieure.
