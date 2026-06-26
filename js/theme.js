/**
 * Theme & Direction Manager: Handles Dark/Light Mode transitions, LTR/RTL switching and state persistence
 */
(function() {
  const THEME_KEY = 'editorial_portfolio_theme';
  const DIR_KEY = 'editorial_portfolio_dir';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateToggleIcons(theme);
  }

  function updateToggleIcons(theme) {
    const toggleButtons = document.querySelectorAll('.theme-toggle');
    toggleButtons.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9 9.003 9.003 0 00-9-9zm0 16a7 7 0 117-7 7.008 7.008 0 01-7 7z"/></svg>`;
      } else {
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 105 5 5 5 0 00-5-5zm0 8a3 3 0 113-3 3 3 0 01-3 3zm0-10a1 1 0 001-1V3a1 1 0 00-2 0v1a1 1 0 001 1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM5.636 7.05a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zm11.314 11.314a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zM4 12a1 1 0 00-1-1H2a1 1 0 000 2h1a1 1 0 001-1zm18 0a1 1 0 00-1-1h-1a1 1 0 000 2h1a1 1 0 001-1zM7.05 18.364a1 1 0 000-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zm11.314-11.314a1 1 0 000-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0z"/></svg>`;
      }
    });
  }

  function getPreferredDir() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
  }

  // Initialize immediately to prevent flash of wrong layouts
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  const currentDir = getPreferredDir();
  applyDir(currentDir);

  // Setup click handlers after DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    updateToggleIcons(getPreferredTheme());

    document.body.addEventListener('click', (e) => {
      const toggle = e.target.closest('.theme-toggle');
      if (toggle) {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      }

      const dirToggle = e.target.closest('.dir-toggle');
      if (dirToggle) {
        const activeDir = document.documentElement.getAttribute('dir') || 'ltr';
        const nextDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
        applyDir(nextDir);
      }
    });
  });
})();

