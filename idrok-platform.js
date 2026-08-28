/* IDROK Platform UI — one visual runtime for every route. */
(() => {
  'use strict';

  const readTheme = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('idrokState') || '{}');
      return saved.theme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  };

  const applyTheme = () => {
    const theme = document.body.classList.contains('dark') ? 'dark' : readTheme();
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  };

  const improveAccessibility = () => {
    document.querySelectorAll('input[type="search"], .header-search input').forEach((input) => {
      if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', 'Kurs va mavzularni qidirish');
    });
    document.querySelectorAll('button, a').forEach((control) => {
      if (control.getAttribute('aria-label') || control.textContent.trim()) return;
      const card = control.closest('[data-course], .course-card, .lab-card, .topic-item');
      const title = card?.querySelector('h2, h3, h4, b, strong')?.textContent?.trim();
      control.setAttribute('aria-label', title ? `${title} sahifasini ochish` : 'Ochish');
    });
  };

  applyTheme();
  improveAccessibility();
  document.documentElement.classList.add('idrok-ui-ready');

  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.type === 'attributes')) applyTheme();
    if (records.some((record) => record.addedNodes.length)) improveAccessibility();
  });
  observer.observe(document.body, {subtree: true, childList: true, attributes: true, attributeFilter: ['class']});
})();
