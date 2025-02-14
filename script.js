// Theme switcher functionality with local storage persistence
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference, default to light if none found
  const savedTheme = localStorage.getItem('minicraft-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonText(savedTheme);

  // Theme toggle handler
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('minicraft-theme', newTheme);
    updateThemeButtonText(newTheme);
  });

  // Helper function to update button text
  function updateThemeButtonText(theme) {
    themeToggle.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  }

  // Smooth scroll behavior for navigation
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply fade-in animation to sections
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(section);
  });

  // Error handling for theme switching
  window.addEventListener('storage', (e) => {
    if (e.key === 'minicraft-theme') {
      try {
        const newTheme = e.newValue || 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeButtonText(newTheme);
      } catch (error) {
        console.error('Error syncing theme across tabs:', error);
        // Fallback to light theme if there's an error
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeButtonText('light');
      }
    }
  });
});