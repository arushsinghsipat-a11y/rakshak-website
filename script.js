const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.main-nav');
const yearNode = document.getElementById('year');
const checklistItems = document.querySelectorAll('.checklist input');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

checklistItems.forEach((item) => {
  item.addEventListener('change', () => {
    const label = item.parentElement;
    label.style.opacity = item.checked ? '1' : '0.7';
    label.style.textDecoration = item.checked ? 'none' : 'line-through';
  });
});
