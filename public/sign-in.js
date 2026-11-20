const form = document.querySelector('#sign-in-preview');
const status = document.querySelector('#sign-in-status');

form.addEventListener('submit', event => {
  event.preventDefault();
  status.textContent = 'Student accounts are coming soon. You can browse everything as a guest for now.';
});

form.addEventListener('input', () => {
  status.textContent = '';
});
