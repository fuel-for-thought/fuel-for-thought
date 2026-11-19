const search = document.querySelector('#search');

if (search) {
  const filters = Array.from(document.querySelectorAll('.filters button'));
  const posts = Array.from(document.querySelectorAll('#posts .post'));
  const empty = document.querySelector('#empty');

  function updateFeed() {
    const query = search.value.trim().toLowerCase();
    const selected = filters.filter(button => button.getAttribute('aria-pressed') === 'true')
      .map(button => button.textContent);
    for (const post of posts) {
      const matchesText = post.textContent.toLowerCase().includes(query);
      const tags = post.dataset.tags.split('|');
      post.hidden = !matchesText || !selected.every(tag => tags.includes(tag));
    }
    empty.hidden = posts.some(post => !post.hidden);
  }

  search.addEventListener('input', updateFeed);
  for (const button of filters) {
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') === 'false'));
      updateFeed();
    });
  }
}
