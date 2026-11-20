function choices(name, labels, selected, type = 'checkbox') {
  return labels.map(label => `<label class="goal-choice">
    <input type="${type}" name="${name}" value="${label}" ${selected.includes(label) ? 'checked' : ''}>
    <span>${label}</span>
  </label>`).join('');
}

export const goals = `<div class="columns goals-layout">
<form id="goals-form">
  <fieldset><legend>Weekly food budget</legend>
    <label for="weekly-budget">How much can you spend on food each week?</label>
    <div class="budget-input"><span aria-hidden="true">$</span><input id="weekly-budget" name="budget" type="number" min="0" step="0.01" value="60" required></div>
  </fieldset>
  <fieldset><legend>Nutrition goal</legend>
    <div class="goal-options">${choices('nutrition', ['High protein', 'Low calorie', 'Balanced', 'Bulking'], ['High protein'], 'radio')}</div>
    <label for="calories">Daily calorie target (optional)</label>
    <input id="calories" name="calories" type="number" min="1" value="2200">
  </fieldset>
  <fieldset><legend>Dietary needs</legend>
    <div class="goal-options">${choices('diet', ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Halal', 'Nut allergy'], ['Dairy-free'])}</div>
    <label for="diet-notes">Anything else we should filter out?</label>
    <textarea id="diet-notes" name="notes" rows="2" placeholder="For example: no pork, no shellfish"></textarea>
  </fieldset>
  <fieldset><legend>Getting there</legend>
    <p>Choose every way you can get to food.</p>
    <div class="goal-options travel-options">${choices('travel', ['Walk', 'Bus', 'Bike', 'Moped', 'Car'], ['Walk', 'Bus'])}</div>
    <label for="trip">Longest trip you’ll make: <output id="trip-time" for="trip">20</output> minutes</label>
    <input id="trip" name="trip" type="range" min="5" max="45" value="20">
  </fieldset>
  <button class="button" type="submit">Save goals</button>
  <p class="fine" id="goals-status" role="status">Your goals are saved in this browser.</p>
</form>
<aside class="panel plan" aria-labelledby="plan-heading">
  <h2 id="plan-heading">Your plan</h2>
  <p><span id="plan-budget">$60.00</span> a week works out to about <strong id="meal-budget">$4.29 per meal</strong> for two meals a day.</p>
  <p id="plan-food">High protein options, dairy-free.</p>
  <p id="plan-travel">Within 20 minutes by walk, bus.</p>
  <a class="button" href="/find-food">Browse sample food</a>
</aside>
</div>`;

const menu = [
  ['Ahi poke bowl, regular', '$11.50', '610', '38 g', ['High protein']],
  ['Shoyu tofu bowl', '$9.00', '520', '22 g', ['Vegetarian']],
  ['Poke by the ¼ lb (no rice)', '$8.00', '190', '26 g', ['Low calorie', 'High protein']],
];

export function pokeDetails([, reviewer, , , rating, review]) {
  return `<dl class="place-stats">
  <div><dt>Meals from</dt><dd>$8</dd></div>
  <div><dt>Walk</dt><dd>8 min</dd></div>
  <div><dt>Bus</dt><dd>Not needed</dd></div>
  <div><dt>Distance from campus</dt><dd>0.4 mi</dd></div>
</dl>
<div class="place-layout">
  <div>
    <section aria-labelledby="menu-heading">
      <h2 id="menu-heading">Menu and nutrition</h2>
      <table class="menu-table" aria-labelledby="menu-heading">
        <thead><tr><th scope="col">Item</th><th scope="col">Price</th><th scope="col">Calories</th><th scope="col">Protein</th></tr></thead>
        <tbody>${menu.map(([item, price, calories, protein, tags]) => `<tr>
          <th scope="row">${item}<div>${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div></th>
          <td><strong>${price}</strong></td><td>${calories}</td><td>${protein}</td></tr>`).join('')}</tbody>
      </table>
    </section>
    <section class="student-review">
      <h2>What students say</h2>
      <article class="post"><strong>${reviewer}</strong> <span class="stars" aria-label="${rating} out of 5 stars">${'★'.repeat(rating)}</span><p>${review}</p></article>
    </section>
  </div>
  <figure class="place-map">
    <div class="map-art" aria-hidden="true">
      <span class="map-campus">UH Mānoa</span><span class="map-road university"></span>
      <span class="map-road side-road"></span><span class="map-road king"></span><span class="map-road south"></span>
      <span class="map-label avenue-label">University Ave</span><span class="map-label king-label">King St</span>
      <span class="map-pin">1</span>
    </div>
    <figcaption class="fine">Illustrative map near UH Mānoa</figcaption>
  </figure>
</div>
<p class="fine">Sample menu, prices, and travel times for Milestone 1.</p>`;
}
