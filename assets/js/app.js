// Éléments de la page et adresse de l'API.
const form = document.querySelector('#document-form');
const titleInput = document.querySelector('#document-title');
const categoryInput = document.querySelector('#document-category');
const documentList = document.querySelector('#document-list');
const documentCount = document.querySelector('#document-count');
const listMessage = document.querySelector('#list-message');
const formMessage = document.querySelector('#form-message');
const submitButton = form.querySelector('button[type="submit"]');
const apiUrl = 'http://localhost:8088/api/documents';

// Construire une ligne à partir des données renvoyées par l'API.
function createDocument(documentData) {
  const article = document.createElement('article');
  article.className = 'document-item';

  const icon = document.createElement('span');
  icon.className = 'document-icon doc-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = 'DOC';

  const details = document.createElement('div');
  details.className = 'document-details';

  const heading = document.createElement('h3');
  heading.textContent = documentData.title;

  const metadata = document.createElement('p');
  metadata.textContent = documentData.category;

  const categoryLabel = document.createElement('span');
  categoryLabel.className = 'category-label';
  categoryLabel.textContent = documentData.category;

  details.append(heading, metadata);
  article.append(icon, details, categoryLabel);
  return article;
}

// Charger la liste depuis Laravel et afficher les données reçues.
async function loadDocuments() {
  listMessage.textContent = 'Chargement des documents…';

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error('La liste est indisponible.');
    }

    const documents = await response.json();
    documentList.replaceChildren();
    documents.forEach((documentData) => {
      documentList.append(createDocument(documentData));
    });
    documentCount.textContent = `${documents.length} document${documents.length > 1 ? 's' : ''}`;
    listMessage.textContent = documents.length === 0 ? 'Aucun document pour le moment.' : '';
  } catch (error) {
    documentList.replaceChildren();
    documentCount.textContent = 'Indisponible';
    listMessage.textContent = 'Impossible de charger les documents. Vérifiez que Laravel fonctionne, puis rechargez la page.';
  }
}

function showFormMessage(message, success) {
  formMessage.textContent = message;
  formMessage.classList.remove('d-none', 'alert-success', 'alert-danger');
  formMessage.classList.add(success ? 'alert-success' : 'alert-danger');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  titleInput.setCustomValidity(title.length < 3 ? 'Saisissez au moins 3 caractères.' : '');
  form.classList.add('was-validated');
  formMessage.classList.add('d-none');

  if (!form.checkValidity()) {
    form.querySelector(':invalid')?.focus();
    return;
  }

  submitButton.disabled = true;
  let errorMessage = 'Impossible de joindre le serveur. Vérifiez la connexion puis réessayez.';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, category: categoryInput.value }),
    });

    if (response.status === 422) {
      errorMessage = 'Le titre ou la catégorie est invalide.';
      throw new Error(errorMessage);
    }
    if (!response.ok) {
      errorMessage = 'Impossible d’ajouter le document. Vérifiez que Laravel fonctionne.';
      throw new Error(errorMessage);
    }

    form.reset();
    form.classList.remove('was-validated');
    titleInput.setCustomValidity('');
    showFormMessage('Document enregistré.', true);
    await loadDocuments();
  } catch (error) {
    showFormMessage(errorMessage, false);
  } finally {
    submitButton.disabled = false;
  }
});

titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));

// Refermer le menu mobile après un clic sur un lien.
document.querySelectorAll('#navigation .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const navigation = document.querySelector('#navigation');
    if (navigation.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  });
});

loadDocuments();
