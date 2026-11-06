// Démonstration localStorage : mémoriser une préférence non sensible.
const compactButton = document.querySelector('#compact-mode');
const storageMessage = document.querySelector('#storage-message');
const storageKey = 'formation_affichage_compact';

function appliquerAffichage(compact) {
  documentList.classList.toggle('compact', compact);
  compactButton.checked = compact;
}

try {
  // La valeur reste dans ce navigateur après un rechargement.
  appliquerAffichage(localStorage.getItem(storageKey) === 'oui');
  storageMessage.textContent = 'Choix conservé dans ce navigateur.';
} catch (error) {
  // Certains navigateurs ou paramètres peuvent bloquer le stockage.
  storageMessage.textContent = 'Le stockage du navigateur est indisponible.';
}

compactButton.addEventListener('change', () => {
  appliquerAffichage(compactButton.checked);
  try {
    localStorage.setItem(storageKey, compactButton.checked ? 'oui' : 'non');
    storageMessage.textContent = 'Choix conservé dans ce navigateur.';
  } catch (error) {
    storageMessage.textContent = 'Choix appliqué, mais non mémorisé par le navigateur.';
  }
});

