// La préférence d'affichage est gérée séparément dans securite.js.
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const logoutButton = document.querySelector('#logout-button');
const connectedContent = document.querySelector('#connected-content');
const form = document.querySelector('#document-form');
const titleInput = document.querySelector('#document-title');
const categoryInput = document.querySelector('#document-category');
const documentList = document.querySelector('#document-list');
const documentCount = document.querySelector('#document-count');
const listMessage = document.querySelector('#list-message');
const formMessage = document.querySelector('#form-message');
const submitButton = form.querySelector('button[type="submit"]');
const apiUrl = 'http://localhost:8088/api';
let token = null; // Conservé uniquement en mémoire, jusqu'au rechargement de la page.

function showFormMessage(message, success) {
  formMessage.textContent = message;
  formMessage.classList.remove('d-none', 'alert-success', 'alert-danger');
  formMessage.classList.add(success ? 'alert-success' : 'alert-danger');
}

function closeSession(message) {
  token = null;
  documentList.replaceChildren();
  documentCount.textContent = '0 document';
  listMessage.textContent = '';
  form.reset();
  form.classList.remove('was-validated');
  titleInput.setCustomValidity('');
  formMessage.classList.add('d-none');
  connectedContent.classList.add('d-none');
  logoutButton.classList.add('d-none');
  loginForm.classList.remove('d-none');
  loginMessage.textContent = message;
}

// Chaque demande protégée reçoit le token de la session qui l'a démarrée.
async function authenticatedFetch(path, options = {}, sessionToken = token) {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${sessionToken}`);
  const response = await fetch(`${apiUrl}${path}`, { ...options, headers });
  if (response.status === 401 && token === sessionToken) {
    closeSession('Session expirée ou révoquée. Connectez-vous à nouveau.');
  }
  return response;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector('button');
  button.disabled = true;
  loginMessage.textContent = 'Connexion en cours…';
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.querySelector('#login-email').value.trim(),
        password: document.querySelector('#login-password').value,
      }),
    });
    if (response.status === 401 || response.status === 422) throw new Error('Vérifiez votre e-mail et votre mot de passe.');
    if (response.status === 429) throw new Error('Trop de tentatives. Patientez une minute.');
    if (!response.ok) throw new Error('Connexion impossible. Vérifiez que Laravel fonctionne.');
    const data = await response.json();
    token = data.token;
    document.querySelector('#login-password').value = '';
    loginForm.classList.add('d-none');
    logoutButton.classList.remove('d-none');
    connectedContent.classList.remove('d-none');
    loginMessage.textContent = 'Vous êtes connecté. Le token reste en mémoire dans cette page.';
    await loadDocuments(token);
  } catch (error) {
    loginMessage.textContent = error instanceof TypeError ? 'Serveur inaccessible. Vérifiez que Laravel fonctionne.' : error.message;
  } finally {
    button.disabled = false;
  }
});

logoutButton.addEventListener('click', async () => {
  const sessionToken = token;
  logoutButton.disabled = true;
  try {
    const response = await authenticatedFetch('/logout', { method: 'POST' }, sessionToken);
    if (token !== sessionToken) return;
    closeSession(response.ok ? 'Vous êtes déconnecté.' : 'Déconnexion locale effectuée. La révocation du token n’a pas été confirmée.');
  } catch (error) {
    if (token === sessionToken) closeSession('Déconnexion locale effectuée. La révocation du token n’a pas été confirmée.');
  } finally {
    logoutButton.disabled = false;
  }
});

function createDocument(documentData, sessionToken) {
  const article = document.createElement('article');
  article.className = 'document-item flex-wrap';
  const details = document.createElement('div');
  details.className = 'document-details';
  const heading = document.createElement('h3');
  heading.textContent = documentData.title;
  const metadata = document.createElement('p');
  metadata.textContent = documentData.category;
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.pdf,application/pdf';
  fileInput.className = 'form-control form-control-sm mt-2';
  fileInput.setAttribute('aria-label', `Choisir un PDF pour ${documentData.title}`);
  const upload = document.createElement('button');
  upload.type = 'button';
  upload.className = 'btn btn-sm btn-outline-primary mt-2 me-2';
  upload.textContent = 'Envoyer le PDF';
  const download = document.createElement('button');
  download.type = 'button';
  download.className = 'btn btn-sm btn-outline-secondary mt-2';
  download.textContent = 'Télécharger le PDF';
  details.append(heading, metadata, fileInput, upload, download, status);
  article.append(details);

  upload.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) { status.textContent = 'Choisissez un PDF avant l’envoi.'; return; }
    const data = new FormData();
    data.append('file', file);
    upload.disabled = true;
    status.textContent = 'Envoi en cours…';
    try {
      const response = await authenticatedFetch(`/documents/${documentData.id}/file`, { method: 'POST', body: data }, sessionToken);
      if (token !== sessionToken) return;
      if (response.status === 422) throw new Error('Fichier refusé : choisissez un vrai PDF de 1 Mo maximum.');
      if (response.status === 409) throw new Error('Ce document possède déjà un PDF.');
      if (!response.ok) throw new Error('Envoi impossible. Vérifiez votre accès et réessayez.');
      fileInput.value = '';
      status.textContent = 'PDF enregistré.';
    } catch (error) {
      if (token === sessionToken) status.textContent = error instanceof TypeError ? 'Serveur inaccessible. Réessayez.' : error.message;
    } finally { upload.disabled = false; }
  });

  download.addEventListener('click', async () => {
    download.disabled = true;
    status.textContent = 'Téléchargement en cours…';
    try {
      const response = await authenticatedFetch(`/documents/${documentData.id}/file`, {}, sessionToken);
      if (token !== sessionToken) return;
      if (response.status === 404) throw new Error('Aucun PDF accessible pour ce document.');
      if (!response.ok) throw new Error('Téléchargement impossible. Réessayez.');
      const blob = await response.blob();
      if (token !== sessionToken) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${documentData.id}.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Téléchargement lancé.';
    } catch (error) {
      if (token === sessionToken) status.textContent = error instanceof TypeError ? 'Serveur inaccessible. Réessayez.' : error.message;
    } finally { download.disabled = false; }
  });
  return article;
}

async function loadDocuments(sessionToken) {
  listMessage.textContent = 'Chargement des documents…';
  try {
    const response = await authenticatedFetch('/documents', {}, sessionToken);
    if (token !== sessionToken) return;
    if (!response.ok) throw new Error('Liste indisponible.');
    const documents = await response.json();
    if (token !== sessionToken) return;
    documentList.replaceChildren();
    documents.forEach((item) => documentList.append(createDocument(item, sessionToken)));
    documentCount.textContent = `${documents.length} document${documents.length > 1 ? 's' : ''}`;
    listMessage.textContent = documents.length ? '' : 'Aucun document pour le moment.';
  } catch (error) {
    if (token !== sessionToken) return;
    documentList.replaceChildren();
    documentCount.textContent = 'Indisponible';
    listMessage.textContent = 'Impossible de charger la liste. Vérifiez Laravel puis reconnectez-vous.';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const sessionToken = token;
  const title = titleInput.value.trim();
  titleInput.setCustomValidity(title.length < 3 ? 'Saisissez au moins 3 caractères.' : '');
  form.classList.add('was-validated');
  formMessage.classList.add('d-none');
  if (!form.checkValidity()) { form.querySelector(':invalid')?.focus(); return; }
  submitButton.disabled = true;
  try {
    const response = await authenticatedFetch('/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category: categoryInput.value }),
    }, sessionToken);
    if (token !== sessionToken) return;
    if (response.status === 422) throw new Error('Le titre ou la catégorie est invalide.');
    if (!response.ok) throw new Error('Impossible d’ajouter le document. Réessayez.');
    form.reset();
    form.classList.remove('was-validated');
    titleInput.setCustomValidity('');
    showFormMessage('Document enregistré. Vous pouvez lui ajouter un PDF dans la liste.', true);
    await loadDocuments(sessionToken);
  } catch (error) {
    if (token === sessionToken) showFormMessage(error instanceof TypeError ? 'Serveur inaccessible. Réessayez.' : error.message, false);
  } finally { submitButton.disabled = false; }
});

titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));
document.querySelectorAll('#navigation .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const navigation = document.querySelector('#navigation');
    if (navigation.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(navigation).hide();
  });
});
