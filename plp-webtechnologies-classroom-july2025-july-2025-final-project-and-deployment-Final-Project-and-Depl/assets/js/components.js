// Function to load header and footer components
function loadComponents() {
  // Load header
  fetch('components/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      initMobileMenu();
    });
  
  // Load footer
  fetch('components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
      initScrollToTop();
    });
}

// Initialize mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.querySelector('.navbar');
  
  if (menuToggle && navbar) {
    menuToggle.addEventListener('change', function() {
      if (this.checked) {
        navbar.style.display = 'flex';
      } else {
        navbar.style.display = 'none';
      }
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.checked = false;
        navbar.style.display = 'none';
      });
    });
  }
}

// Initialize scroll to top button
function initScrollToTop() {
  const scrollBtn = document.querySelector('.iconTop a');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadComponents();
  
  // Add active class to current page link
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Initialize skill bar animations on skills page
  if (window.location.pathname.includes('skills.html')) {
    animateSkillBars();
  }
  
  // Initialize portfolio item hover effects
  if (window.location.pathname.includes('portfolio.html')) {
    initPortfolioHover();
  }
});

// Animate skill bars on scroll
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.parentElement.getAttribute('data-width');
        entry.target.style.width = width;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

// Initialize portfolio hover effects
function initPortfolioHover() {
  const portfolioItems = document.querySelectorAll('.portfolio-box');
  
  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.querySelector('.portfolio-layer').style.transform = 'translateY(0)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.querySelector('.portfolio-layer').style.transform = 'translateY(100%)';
    });
  });
}