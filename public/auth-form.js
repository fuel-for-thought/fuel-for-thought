const form = document.querySelector('#auth-form');
const status = document.querySelector('#auth-status');
const mode = form.dataset.mode; // "signin" or "signup"
const button = form.querySelector('button[type=submit]');

function show(message, kind = 'error') {
  status.textContent = message;
  status.dataset.kind = kind;
}

function checkFields(values) {
  if (mode === 'signup' && !values.name.trim()) return 'Enter your name.';
  if (!/^[^\s@]+@hawaii\.edu$/i.test(values.email.trim())) return 'Use your UH email address, ending in @hawaii.edu.';
  if (mode === 'signup' && values.password.length < 8) return 'Use a password with at least 8 characters.';
  if (mode === 'signup' && values.password !== values.confirm) return 'The passwords don’t match.';
  if (!values.password) return 'Enter your password.';
  return '';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const problem = checkFields(values);
  if (problem) return show(problem);

  button.disabled = true;
  show(mode === 'signup' ? 'Creating your account…' : 'Signing in…', 'info');
  try {
    const response = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
    show(mode === 'signup' ? `Welcome, ${data.user.name}! Taking you to the Community…` : `Signed in as ${data.user.email}.`, 'success');
    const next = new URLSearchParams(location.search).get('next');
    location.assign(next && next.startsWith('/') && !next.startsWith('//') ? next : '/community');
  } catch (error) {
    show(error.message);
    button.disabled = false;
  }
});

form.addEventListener('input', () => show(''));
