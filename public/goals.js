const form = document.querySelector('#goals-form');
const status = document.querySelector('#goals-status');
const storageKey = 'fuel-for-thought:goals';
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) {
    for (const input of form.elements) {
      const values = saved[input.name];
      if (!Array.isArray(values)) continue;
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = values.includes(input.value);
      } else {
        input.value = values[0];
      }
    }
  }
} catch {
  // The sample defaults still work if storage is unavailable.
}

function updatePlan() {
  const data = new FormData(form);
  const budget = Number(data.get('budget'));
  const trip = data.get('trip');
  const diet = data.getAll('diet');
  const travel = data.getAll('travel');
  const nutrition = data.get('nutrition');
  document.querySelector('#plan-budget').textContent = dollars.format(budget);
  document.querySelector('#meal-budget').textContent = dollars.format(budget / 14) + ' per meal';
  document.querySelector('#trip-time').textContent = trip;
  document.querySelector('#plan-food').textContent = [nutrition + ' options', ...diet.map(label => label.toLowerCase())].join(', ') + '.';
  document.querySelector('#plan-travel').textContent = travel.length
    ? `Within ${trip} minutes by ${travel.map(label => label.toLowerCase()).join(', ')}.`
    : `Within ${trip} minutes. No travel modes selected.`;
}

form.addEventListener('input', () => {
  updatePlan();
  status.textContent = 'Your goals are saved in this browser.';
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const names = new Set(Array.from(form.elements, input => input.name).filter(Boolean));
  const goals = Object.fromEntries(Array.from(names, name => [name, data.getAll(name)]));
  try {
    localStorage.setItem(storageKey, JSON.stringify(goals));
    status.textContent = 'Goals saved in this browser.';
  } catch {
    status.textContent = 'Browser storage is unavailable. Your current plan is still shown.';
  }
});

updatePlan();
