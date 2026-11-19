import { cp, mkdir, writeFile } from 'node:fs/promises';
import { goals, pokeDetails } from './milestone-pages.mjs';

const posts = [
  ['KE', 'kalani_eats', '2 hours ago', 'Mānoa Poke Stop', 5, 'Ask for the ¼ lb with no rice and add a side of edamame. $19 and around 49 g of protein, an 8-minute walk from Hamilton.', ['High protein', 'Budget'], 24],
  ['MS', 'mjsantos', 'Yesterday', 'Kaimukī Farm Stand', 4, 'Healthy and cheap, but far without a car. Take the bus and stock up for the week. The greens bag lasts me four days.', ['Budget', 'Vegan'], 11],
  ['DC', 'dorm_chef', '2 days ago', 'Puck’s Alley Market', 4, 'Half a rotisserie chicken for $7 covers two meals. Pair it with brown rice for a study night.', ['High protein', 'Budget'], 19],
  ['LW', 'leiwalks', '3 days ago', 'Paradise Palms Café', 4, 'The parfait is my favorite low-calorie option on upper campus. Go before class to avoid the lunch line.', ['Low calorie'], 7],
];
const tabs = [['Find food', '/find-food'], ['Community', '/'], ['My goals', '/my-goals']];
const filters = ['Budget', 'High protein', 'Low calorie', 'Vegan'];
const detail = index => '/place-' + (index + 1);
const link = (label, href) => `<a href="${href}">${label}</a>`;
const card = ([initials, user, time, place, rating, note, tags, helpful], index) => `
<article class="post" data-tags="${tags.join('|')}">
  <div class="author"><span class="avatar" aria-hidden="true">${initials}</span><div><strong>${user}</strong><small>${time}</small></div></div>
  <h2>${link(place, detail(index))}</h2>
  <div class="stars" aria-label="${rating} out of 5 stars">${'★'.repeat(rating)}<span>${'★'.repeat(5 - rating)}</span></div>
  <p>${note}</p>
  <div class="post-footer"><div>${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
  <a class="helpful" href="/sign-in">♧ ${helpful} found this helpful</a></div>
</article>`;

const community = `<div class="columns"><section aria-label="Community posts">
  <div class="toolbar"><input id="search" type="search" aria-label="Search posts or places" placeholder="Search posts or places"><a class="button" href="/sign-in">＋ New post</a></div>
  <div class="filters" aria-label="Filter posts">${filters.map(tag => `<button type="button" aria-pressed="false">${tag}</button>`).join('')}</div>
  <div id="posts">${posts.map(card).join('')}</div><p id="empty" hidden>No posts match your search.</p>
  <p class="fine">Sample posts for Milestone 1.</p>
</section><aside aria-label="Community resources">
  <section class="panel"><h2>Most helpful this week</h2><ol>
  <li>${link(posts[0][3], detail(0))}<small>from $8, 8 min walk</small></li>
  <li>${link(posts[2][3], detail(2))}<small>from $3, 18 min walk</small></li>
  <li>${link(posts[1][3], detail(1))}<small>from $2, 42 min walk</small></li>
  </ol></section>
  <section class="panel"><h2>Posting guidelines</h2><p>Share what you paid, what you ordered and how you got there. Keep it kind. Moderators remove posts that target people or businesses.</p></section>
</aside></div>`;

const pages = [
  ['', 'Community', 'Food finds from other UH students. Sign in to post, rate meals and mark tips as helpful.', community],
  ['find-food', 'Find food', 'Explore affordable meals near UH Mānoa.', `<div class="place-list">${posts.map((post, index) => `<article class="panel"><h2>${link(post[3], detail(index))}</h2><p>${post[5]}</p></article>`).join('')}</div><p class="fine">Sample listings for Milestone 1.</p>`],
  ['my-goals', 'My goals', 'Tell us your budget, how you want to eat, and how you get around.', goals],
  ['sign-in', 'Sign in', 'Join the UH Mānoa food community.', '<section class="panel narrow"><h2>Student accounts</h2><p>Account access is planned for a later milestone. You can browse all sample posts now.</p><a class="button" href="/">Back to Community</a></section>'],
  ['place-1', posts[0][3], 'Restaurant on University Ave. ★ 4.6 from 38 sample reviews.', pokeDetails(posts[0])],
  ...posts.slice(1).map((post, offset) => {
    const index = offset + 1;
    return [detail(index).slice(1), post[3], 'Sample food listing near UH Mānoa', `<section class="narrow">${card(post, index)}<a href="/find-food">Back to Find food</a></section>`];
  }),
  ['project', 'Project home', 'Fuel for Thought is an ICS 314 project for University of Hawaiʻi at Mānoa students.', `<div class="project">
    <h2>GitHub</h2><p>${link('Organization', 'https://github.com/fuel-for-thought')} · ${link('All repositories', 'https://github.com/orgs/fuel-for-thought/repositories')} · ${link('Source repository', 'https://github.com/fuel-for-thought/fuel-for-thought')}</p>
    <h2>Team Contract</h2><p>The approved team contract link is pending.</p>
    <h2>Deployment</h2><p>The Vercel deployment link is pending.</p>
    <h2>Milestones</h2><ul><li>M1 project board link is pending.</li><li>M2 project board link is pending.</li></ul>
    <h2>Screenshots</h2>${['Community', 'Find food', 'My goals', 'Sign in', 'Place details'].map((name, i) => `<figure><img src="/screenshots/${['community', 'find-food', 'my-goals', 'sign-in', 'place-details'][i]}.png" alt="${name} page screenshot" loading="lazy"><figcaption>${name}</figcaption></figure>`).join('')}
  </div>`],
];

await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
for (const [slug, title, subtitle, content] of pages) {
  await writeFile(`dist/${slug || 'index'}.html`, `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | Fuel for Thought</title><link rel="stylesheet" href="/style.css"><script type="module" src="/community.js"></script>${slug === 'my-goals' ? '<script type="module" src="/goals.js"></script>' : ''}</head>
<body>
<header class="site-nav"><nav class="wrap" aria-label="Main navigation">
<a href="/" class="brand">Fuel for Thought</a>
${tabs.map(([label, href]) => `<a href="${href}"${href === '/' + slug ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
<a class="signin" href="/sign-in">Sign in <span aria-hidden="true">▾</span></a>
</nav></header>
<main><header class="banner"><div class="wrap${slug === 'place-1' ? ' place-banner' : ''}">
${slug === 'place-1' ? '<a class="back-results" href="/find-food">Back to results</a>' : ''}
<div><h1>${title}</h1><p>${subtitle}</p></div>
${slug === 'place-1' ? '<a class="button" href="/sign-in">♥ Save to favorites</a>' : ''}
</div></header>
<div class="wrap content">${content}</div></main>
<footer class="site-footer"><div class="wrap footer-inner"><div><strong>Fuel for Thought</strong><br>Affordable, healthy food near UH Mānoa.</div><div>An ICS 314 project, University of Hawaiʻi at Mānoa<br><a href="/project">Project home page</a></div></div></footer>
</body></html>`);
}
