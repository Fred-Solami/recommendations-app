let dataset = [];

async function loadData(){
  try{
    const res = await fetch('data.json');
    dataset = await res.json();
  }catch(e){
    console.error('Failed to load data.json', e);
  }
}

function renderResults(items){
  const container = document.getElementById('results');
  container.innerHTML = '';
  if(!items || items.length === 0){
    container.innerHTML = '<p class="no-results">No results found.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'grid';

  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = it.image;
    img.alt = it.title;

    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h2');
    title.textContent = it.title;

    const desc = document.createElement('p');
    desc.textContent = it.description;

    const cat = document.createElement('p');
    cat.className = 'cat';
    cat.textContent = it.category;

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(cat);

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function matchCategoryQuery(q){
  q = q.toLowerCase();
  if(q.includes('beach')) return 'Beaches';
  if(q.includes('beaches')) return 'Beaches';
  if(q.includes('temple')) return 'Temples';
  if(q.includes('temples')) return 'Temples';
  if(q.includes('country') || q.includes('countries')) return 'Countries';
  return null;
}

function search(query){
  if(!dataset || dataset.length === 0) return renderResults([]);
  query = (query || '').trim();
  if(query === '') return renderResults([]);

  const q = query.toLowerCase();
  const cat = matchCategoryQuery(q);
  let results = [];

  if(cat){
    results = dataset.filter(d => d.category.toLowerCase() === cat.toLowerCase());
  } else {
    results = dataset.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }

  // ensure we show at least two suggestions when possible
  if(results.length === 1){
    const extra = dataset.find(d => d.category.toLowerCase() === results[0].category.toLowerCase() && d.title !== results[0].title);
    if(extra) results.push(extra);
  }

  renderResults(results.slice(0, 10));
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await loadData();
  const searchInput = document.getElementById('searchInput');
  document.getElementById('searchBtn').addEventListener('click', ()=> search(searchInput.value));
  document.getElementById('clearBtn').addEventListener('click', ()=>{ searchInput.value = ''; renderResults([]); });
  searchInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') search(searchInput.value); });
});
