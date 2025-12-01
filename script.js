const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

const loadBtn = document.getElementById('load-posts-btn');
const postsContainer = document.getElementById('posts');
const favoritesContainer = document.getElementById('favorites');

function getFavorites() {
  const raw = localStorage.getItem('favoritesPosts');
  return raw ? JSON.parse(raw) : [];
}

function saveFavorites(favs) {
  localStorage.setItem('favoritesPosts', JSON.stringify(favs));
}

async function loadPosts() {
  try {
    const response = await fetch(API_URL);
    const posts = await response.json();
    renderPosts(posts);
  } catch (err) {
    postsContainer.innerHTML = '<p>Помилка завантаження даних 😢</p>';
    console.error(err);
  }
}

function renderPosts(posts) {
  postsContainer.innerHTML = '';

  posts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <h3 class="card-title">${post.title}</h3>
      <p class="card-body">${post.body}</p>
    `;

    const btn = document.createElement('button');
    btn.textContent = 'Додати в обрані';
    btn.addEventListener('click', () => addToFavorites(post));

    card.appendChild(btn);
    postsContainer.appendChild(card);
  });
}

function addToFavorites(post) {
  const favorites = getFavorites();

  const exists = favorites.some(item => item.id === post.id);
  if (!exists) {
    favorites.push({
      id: post.id,
      title: post.title,
    });
    saveFavorites(favorites);
    renderFavorites();
  } else {
    alert('Цей пост вже є в обраних 🙂');
  }
}

function renderFavorites() {
  const favorites = getFavorites();
  favoritesContainer.innerHTML = '';

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>Поки що немає обраних постів.</p>';
    return;
  }

  favorites.forEach(post => {
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <h3 class="card-title">${post.title}</h3>
      <p class="card-body">ID: ${post.id}</p>
    `;

    const btn = document.createElement('button');
    btn.textContent = 'Видалити з обраних';
    btn.addEventListener('click', () => removeFromFavorites(post.id));

    card.appendChild(btn);
    favoritesContainer.appendChild(card);
  });
}

function removeFromFavorites(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(post => post.id !== id);
  saveFavorites(favorites);
  renderFavorites();
}

loadBtn.addEventListener('click', loadPosts);

renderFavorites();
