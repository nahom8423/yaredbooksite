// JavaScript for menu toggle and search button

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const searchBtn = document.querySelector('.search-btn');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
  });

  searchBtn.addEventListener('click', () => {
    alert('Search functionality to be implemented.');
  });
});
