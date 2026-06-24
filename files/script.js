const logEl = document.getElementById('log');
function log(msg) {
  const p = document.createElement('p');
  const time = new Date().toLocaleTimeString();
  p.textContent = `[${time}] ${msg}`;
  logEl.prepend(p);
}

/* 
   TOAST
   showToast(type, text) — показывает уведомление
   автоматически через таймаут закрвается
   плавное появление/скрытие через CSS-классы
   каждое уведомление сохраняется в localStorage
*/

const TOAST_STORAGE_KEY = 'toastHistory';
const toastContainer = document.getElementById('toast-container');

const ICONS = {
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>',
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5"/><circle cx="12" cy="16.2" r=".3" fill="currentColor"/></svg>'
};

/**
 * Показывает toast-уведомление
 * @param {'message'|'error'} type - тип уведомления (влияет на стиль)
 * @param {string} text - текст, который увидит пользователь
 * @param {number} duration - время до автозакрытия
 */
function showToast(type, text, duration = 5000) {
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
  saveToHistory(type, text);

  // анимашки
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
  // сначала закончить анимацию потом из дом удалить 
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}


function saveToHistory(type, text) {
  const history = readHistory();
  history.push({ type, text, time: new Date().toISOString() });
  // JSON.stringify из массива с строчку
  localStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify(history));
}

function readHistory() {
  const raw = localStorage.getItem(TOAST_STORAGE_KEY);
  if (!raw) return [];
  try {
    // JSON.parse из строчки в массив
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

document.getElementById('btn-history').addEventListener('click', () => {
  const history = readHistory();
  log(`пидорасов в комнате: ${history.length}`);
  history.forEach(item => log(`— [${item.type}] ${item.text} (${item.time})`));
});

document.getElementById('btn-clear').addEventListener('click', () => {
  localStorage.removeItem(TOAST_STORAGE_KEY);
  log('почищено');
});



document.getElementById('btn-success').addEventListener('click', () => {
  showToast('message', 'щас бы пожрать');
});

document.getElementById('btn-error').addEventListener('click', () => {
  showToast('error', 'я случайно убил курицу 80кг');
});



async function loadUser(id) {
  const url = `https://jsonplaceholder.typicode.com/users/${id}`;
  log(`Отправляем запрос: GET ${url}`);

  // fetch() отправляет HTTP-запрос и возвращает Promise,
  const response = await fetch(url);

  // объект Response статус HTTP-сообщения
  log(`Получен ответ, статус: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    throw new Error(`Сервер ответил ошибкой: ${response.status}`);
  }

  // response.json() читает тело ответа как JSON и возвращает Promise<object>
  const data = await response.json();
  return data;
}

document.getElementById('btn-fetch-ok').addEventListener('click', async () => {
  try {
    const user = await loadUser(1);
    log(`Получены данные пользователя: ${user.name} (${user.email})`);
    showToast('message', `Загружен пользователь: ${user.name}`);
  } catch (err) {
    log(`Произошла ошибка: ${err.message}`);
    showToast('error', err.message);
  }
});

// специально обращаемся к несуществующему ресурсу, чтобы показать обработку ошибки
document.getElementById('btn-fetch-fail').addEventListener('click', async () => {
  try {
    const user = await loadUser(99999);
    log(`Получены данные пользователя: ${JSON.stringify(user)}`);
    showToast('message', 'Запрос выполнен успешно.');
  } catch (err) {
    log(`Произошла ошибка: ${err.message}`);
    showToast('error', 'Не удалось загрузить данные пользователя.');
  }
});

log('Страница загружена. Готова к демонстрации.');
