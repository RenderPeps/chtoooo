const toastContainer = document.getElementById('toast-container');

const ICONS = {
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>',
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5"/><circle cx="12" cy="16.2" r=".3" fill="currentColor"/></svg>'
};

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


const SUBMIT_URL = 'https://jsonplaceholder.typicode.com/posts';

const form = document.getElementById('temp-form');
const roomInput = document.getElementById('room');
const tempInput = document.getElementById('temperature');
const submitBtn = document.getElementById('submit-btn');
const submitLabel = document.getElementById('submit-label');

function setFormDisabled(disabled) {
  submitBtn.disabled = disabled;
  roomInput.disabled = disabled;
  tempInput.disabled = disabled;
  submitLabel.textContent = disabled ? 'Отправка…' : 'Отправить';
}

form.addEventListener('submit', async (event) => {
  // не перезагружет страницу
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const payload = {
    room: roomInput.value.trim(),       // строка
    temperature: parseFloat(tempInput.value) // число
  };

  setFormDisabled(true);

  try {
    const response = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Сервер ответил ошибкой: ${response.status}`);
    }

    const data = await response.json();

    // сообщение выводится
    const message = data.message ?? `Показания по аудитории ${payload.room} успешно сохранены.`;
    showToast('message', message);

    // очищаем форму только при успехе
    form.reset();

  } catch (err) {
    showToast('error', err.message || 'Не удалось отправить данные. Попробуйте ещё раз.');
    // форму при ошибке не очищаем — значения остаются как были
  } finally {
    setFormDisabled(false);
  }
});
