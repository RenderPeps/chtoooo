const toastContainer = document.getElementById('toast-container');

const ICONS = {
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>',
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5"/><circle cx="12" cy="16.2" r=".3" fill="currentColor"/></svg>'
};

/**
 * Показывает toast-уведомление.
 * @param {'message'|'error'} type
 * @param {string} text
 * @param {number} duration - время в мс, через которое уведомление автоматически закроется. 0 — не закрывать автоматически.
 */
function showToast(type, text, duration = 6000) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] ?? ICONS.message}</span>
    <div class="toast-body">
      <p class="toast-title">${type === 'error' ? 'Ошибка' : 'Сообщение'}</p>
      <p class="toast-text"></p>
    </div>
    <button class="toast-close" aria-label="Закрыть уведомление">&times;</button>
  `;
  toast.querySelector('.toast-text').textContent = text;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('is-visible'));

  let autoCloseTimer = duration > 0 ? setTimeout(() => closeToast(toast), duration) : null;

  toast.querySelector('.toast-close').addEventListener('click', () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    closeToast(toast);
  });

  return toast;
}

function closeToast(toast) {
  toast.classList.remove('is-visible');
  toast.classList.add('is-leaving');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

const GALLERY_URL = 'data.json';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;  

const galleryArea = document.getElementById('gallery-area');
const refreshBtn = document.getElementById('btn-refresh');
const refreshIcon = refreshBtn.querySelector('.icon-refresh');


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImagesWithRetry() {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const response = await fetch(GALLERY_URL);

      if (!response.ok) {
        throw new Error(`Сервер ответил ошибкой: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (err) {
      lastError = err;

      const isLastAttempt = attempt === MAX_RETRIES + 1;
      if (isLastAttempt) break;

      await delay(RETRY_DELAY);
    }
  }

  throw lastError;
}

function renderLoading() {
  galleryArea.innerHTML = `
    <div class="gallery-status">
      <div class="spinner" role="status" aria-label="Загрузка"></div>
      <p>Загружаем изображения…</p>
    </div>
  `;
}


function renderEmpty() {
  galleryArea.innerHTML = `
    <div class="gallery-status">
      <p class="gallery-empty">Изображения не найдены</p>
    </div>
  `;
}


function renderError() {
  galleryArea.innerHTML = `
    <div class="gallery-status">
      <p class="gallery-error-msg">Не удалось загрузить изображения. Попробуйте обновить галерею.</p>
    </div>
  `;
}


function renderGallery(images) {
  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  images.forEach(item => {
    const card = document.createElement('figure');
    card.className = 'gallery-item';
    card.innerHTML = `
      <div class="gallery-item-media">
        <img src="${item.url}" alt="" loading="lazy">
      </div>
    `;
    grid.appendChild(card);
  });

  galleryArea.innerHTML = '';
  galleryArea.appendChild(grid);
}

async function loadGallery() {
  refreshBtn.disabled = true;
  refreshIcon.classList.add('is-spinning');
  renderLoading();

  try {
    const images = await fetchImagesWithRetry();

    if (!images || images.length === 0) {
      renderEmpty();
    } else {
      renderGallery(images);
    }
  } catch (err) {
    renderError();
    showToast('error', 'Не удалось получить изображения с сервера. Проверьте соединение и попробуйте снова.');
  } finally {
    refreshBtn.disabled = false;
    refreshIcon.classList.remove('is-spinning');
  }
}


loadGallery();

refreshBtn.addEventListener('click', loadGallery);
