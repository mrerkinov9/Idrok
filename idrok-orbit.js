/* IDROK ORBIT — visual safety and accessibility guardrails. */
(() => {
  'use strict';

  const enforceOrbit = () => {
    document.body.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  };

  const labelControls = () => {
    document.querySelectorAll('input[type="search"], .header-search input').forEach((input) => {
      if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', 'Saytdan qidirish');
    });

    document.querySelectorAll('button, a').forEach((control) => {
      if (control.getAttribute('aria-label') || control.textContent.trim()) return;
      const card = control.closest('[data-course], .course-card, .lab-card, .topic-item');
      const title = card?.querySelector('h2, h3, h4, b, strong')?.textContent?.trim();
      control.setAttribute('aria-label', title ? `${title} sahifasini ochish` : 'Ochish');
    });
  };

  enforceOrbit();
  labelControls();

  const observer = new MutationObserver((records) => {
    if (document.body.classList.contains('dark')) enforceOrbit();
    if (records.some((record) => record.addedNodes.length)) labelControls();
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
})();
