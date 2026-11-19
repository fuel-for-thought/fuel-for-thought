// Swaps the navbar's "Sign in" link for the student's name and a Sign out button.
const link = document.querySelector('#auth-nav');

async function load() {
  try {
    const response = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!response.ok) return;
    const { user } = await response.json();
    if (!user) return;

    const box = document.createElement('span');
    box.className = 'signin signed-in';
    const name = document.createElement('span');
    name.textContent = user.name;
    name.title = user.email;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Sign out';
    button.addEventListener('click', async () => {
      button.disabled = true;
      await fetch('/api/auth/signout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      location.assign('/');
    });
    box.append(name, button);
    link.replaceWith(box);
  } catch {
    // Leave the Sign in link if the account service can't be reached.
  }
}

if (link) load();
