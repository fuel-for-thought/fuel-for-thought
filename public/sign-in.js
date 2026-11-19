const form = document.querySelector('#sign-in-preview');
const status = document.querySelector('#sign-in-status');

form.addEventListener('submit', event => {
  event.preventDefault();
  status.textContent = 'Demo complete. No sign-in request was sent.';
});

form.addEventListener('input', () => {
  status.textContent = 'Demo only. No account is created.';
});
