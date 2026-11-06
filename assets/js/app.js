// Sélectionner les éléments HTML dont l'application a besoin.
// Une constante contient ici une référence à un élément, pas sa valeur.
const form = document.querySelector('#document-form');
const titleInput = document.querySelector('#document-title');
const categoryInput = document.querySelector('#document-category');
const fileInput = document.querySelector('#document-file');
const documentList = document.querySelector('#document-list');
const documentCount = document.querySelector('#document-count');
const formMessage = document.querySelector('#form-message');

function updateDocumentCount() {
  // Compter les éléments de la liste et afficher le singulier ou le pluriel.
  const count = documentList.querySelectorAll('.document-item').length;
  documentCount.textContent = `${count} document${count > 1 ? 's' : ''}`;
}

// Construire une ligne de document et la renvoyer à la fonction appelante.
function createDocument(title, category, file) {
  const article = document.createElement('article');
  article.className = 'document-item';

  // Choisir un pictogramme selon l'extension du fichier sélectionné.
  // Ce pictogramme est décoratif : il est masqué aux lecteurs d'écran.
  const icon = document.createElement('span');
  icon.className = 'document-icon';
  icon.setAttribute('aria-hidden', 'true');
  const extension = file ? file.name.split('.').pop().toLowerCase() : '';
  icon.textContent = extension === 'pdf' ? 'PDF' : 'DOC';
  if (extension !== 'pdf') icon.classList.add('doc-icon');

  const details = document.createElement('div');
  details.className = 'document-details';

  // textContent affiche le titre comme du texte, sans interpréter du HTML saisi.
  const heading = document.createElement('h3');
  heading.textContent = title;

  // Le nom du fichier est affiché, mais le fichier n'est ni envoyé ni stocké.
  const metadata = document.createElement('p');
  metadata.textContent = file ? `${category} · ${file.name}` : `${category} · Ajouté à l’instant`;

  const categoryLabel = document.createElement('span');
  categoryLabel.className = 'category-label';
  categoryLabel.textContent = category;

  // Assembler les éléments enfants dans l'ordre d'affichage.
  details.append(heading, metadata);
  article.append(icon, details, categoryLabel);
  return article;
}

form.addEventListener('submit', (event) => {
  // Empêcher le rechargement automatique de la page à l'envoi du formulaire.
  event.preventDefault();

  // Vérifier le titre sans les espaces placés avant et après.
  const title = titleInput.value.trim();
  titleInput.setCustomValidity(title.length < 3 ? 'Saisissez au moins 3 caractères.' : '');

  // Afficher les styles de validation Bootstrap et masquer l'ancien message.
  form.classList.add('was-validated');
  formMessage.classList.add('d-none');

  // Si un champ est invalide, lui donner le focus et arrêter le traitement.
  if (!form.checkValidity()) {
    form.querySelector(':invalid')?.focus();
    return;
  }

  // Récupérer les valeurs, puis ajouter la nouvelle ligne au début de la liste.
  const category = categoryInput.value;
  const file = fileInput.files[0];
  documentList.prepend(createDocument(title, category, file));
  updateDocumentCount();

  // Réinitialiser le formulaire et confirmer l'ajout temporaire à l'utilisateur.
  form.reset();
  form.classList.remove('was-validated');
  titleInput.setCustomValidity('');
  formMessage.textContent = 'Document ajouté à la liste pour cette démonstration.';
  formMessage.classList.remove('d-none');
});

// Effacer l'erreur personnalisée lorsque l'utilisateur modifie le titre.
titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));

// Refermer le menu mobile après un clic sur un lien.
document.querySelectorAll('#navigation .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const navigation = document.querySelector('#navigation');
    if (navigation.classList.contains('show')) {
      // Utiliser le composant Collapse de Bootstrap pour fermer le menu.
      bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  });
});

// Mettre le compteur à jour dès le chargement de la page.
updateDocumentCount();
