const toggleBtn = document.getElementById('theme-toggle');

function isDarkTheme() {
  return document.documentElement.classList.contains('dark-theme');
}

function updateButton() {
  if (isDarkTheme()) {
    toggleBtn.textContent = 'Светлая тема';
    toggleBtn.setAttribute('aria-pressed', 'true');
  } else {
    toggleBtn.textContent = 'Тёмная тема';
    toggleBtn.setAttribute('aria-pressed', 'false');
  }
}

toggleBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDarkTheme() ? 'dark' : 'light');

  updateButton();
});

updateButton();
