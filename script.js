const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.querySelector('.menu-toggle');
const backToTop = document.getElementById('backToTop');
const searchInput = document.getElementById('searchInput');
const brandTitle = document.getElementById('brandTitle');

function applyTheme(theme) {
  body.dataset.theme = theme;
  localStorage.setItem('blog-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro';
}

const savedTheme = localStorage.getItem('blog-theme') || 'light';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(body.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('scroll', () => {
  if (backToTop) {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    const term = event.target.value.toLowerCase();
    document.querySelectorAll('.recipe-card').forEach((card) => {
      const text = card.dataset.search || card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? 'flex' : 'none';
    });
  });
}

let gradientIndex = 0;
if (brandTitle) {
  setInterval(() => {
    gradientIndex = (gradientIndex + 1) % 2;
    brandTitle.classList.toggle('gradient-a', gradientIndex === 0);
    brandTitle.classList.toggle('gradient-b', gradientIndex === 1);
  }, 5000);
}

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
if (slides.length) {
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}

const visitKey = 'blog-visit-count';
const visitCounter = document.getElementById('visitCounter');
const visits = Number(localStorage.getItem(visitKey) || 0) + 1;
localStorage.setItem(visitKey, String(visits));
if (visitCounter) visitCounter.textContent = `${visits} visitas`;

function renderComments(recipeCard) {
  const list = recipeCard.querySelector('[data-comments]');
  const comments = JSON.parse(localStorage.getItem(`comments:${recipeCard.dataset.search || 'recipe'}`) || '[]');
  list.innerHTML = comments.length
    ? comments.map((item) => `<li><strong>${item.name}</strong>: ${item.comment}</li>`).join('')
    : '<li>Nenhum comentário ainda. Seja o primeiro!</li>';
}

function saveComments(recipeCard, comment) {
  const key = `comments:${recipeCard.dataset.search || 'recipe'}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  comments.unshift(comment);
  localStorage.setItem(key, JSON.stringify(comments.slice(0, 8)));
  renderComments(recipeCard);
}

document.querySelectorAll('.recipe-card').forEach((card) => {
  renderComments(card);
  const reactionButtons = card.querySelectorAll('.reaction-btn');
  reactionButtons.forEach((button) => {
    const key = `${card.dataset.search || 'recipe'}:${button.dataset.reaction}`;
    const countEl = button.querySelector('[data-count]');

    function updateCount() {
      const current = Number(localStorage.getItem(key) || 0);
      countEl.textContent = String(current);
    }

    updateCount();

    button.addEventListener('click', () => {
      const current = Number(localStorage.getItem(key) || 0);
      const next = current + 1;
      localStorage.setItem(key, String(next));
      countEl.textContent = String(next);
      button.classList.add('active');
    });
  });

  const form = card.querySelector('[data-comment-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.name.value.trim();
      const comment = form.comment.value.trim();
      if (!name || !comment) return;
      saveComments(card, { name, comment, date: new Date().toLocaleString('pt-BR') });
      form.reset();
    });
  }
});
