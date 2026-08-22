const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let passed = 0;

function check(condition, message) {
  if (!condition) throw new Error(message);
  passed += 1;
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => {
    const component = parseInt(value, 16) / 255;
    return component <= 0.03928
      ? component / 12.92
      : ((component + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const css = read('design-system.css');

[
  '--ds-navy: #081326',
  '--ds-action: #5965f2',
  '--ds-science: #20cdbb',
  '--ds-space-1: 4px',
  '--ds-space-16: 64px',
  '--ds-radius-sm: 12px',
  '--ds-radius-lg: 24px',
  '--ds-motion-fast: 160ms',
  '--ds-motion-base: 220ms',
  'font-size: 16px',
  'font-size: 12px',
  'min-height: 44px',
  'prefers-reduced-motion: reduce',
  'prefers-contrast: more',
  'overflow-x: clip',
].forEach((token) => check(css.includes(token), `Design token/policy missing: ${token}`));

[
  ['grade-7', '--ds-grade-7'],
  ['grade-8', '--ds-grade-8'],
  ['grade-9', '--ds-grade-9'],
  ['grade-10', '--ds-grade-10'],
  ['grade-11', '--ds-grade-11'],
].forEach(([grade, token]) => {
  check(css.includes(`body.idrok-course.${grade}`), `${grade} accent selector missing`);
  check(css.includes(`var(${token})`), `${grade} accent token is not used`);
  check(
    css.includes(`body.idrok-course.${grade} { --idrok-accent: var(${token}); --violet: var(${token}); }`),
    `${grade} does not override the legacy course accent`,
  );
});

const pages = {
  'index.html': 'class="idrok-next-home"',
  'physics7.html': 'class="idrok-course grade-7"',
  'physics8.html': 'class="idrok-course grade-8"',
  'physics.html': 'class="idrok-course grade-9"',
  'physics10.html': 'class="idrok-course grade-10"',
  'physics11.html': 'class="idrok-course grade-11"',
  'lab.html': 'class="idrok-lab"',
  'labs.html': 'class="idrok-labs"',
  'garden.html': 'class="idrok-garden"',
};

Object.entries(pages).forEach(([file, bodyClass]) => {
  const html = read(file);
  check(html.includes('design-system.css?v=2'), `${file} does not load the current shared design system`);
  check(html.includes(bodyClass), `${file} is missing its product-shell class`);
});

check(contrast('#f6f8ff', '#081326') >= 4.5, 'Dark shell text contrast is below WCAG AA');
check(contrast('#15213a', '#ffffff') >= 4.5, 'Primary text contrast is below WCAG AA');
check(contrast('#5f6d84', '#ffffff') >= 4.5, 'Muted text contrast is below WCAG AA');
check(contrast('#ffffff', '#5965f2') >= 4.5, 'Primary button contrast is below WCAG AA');

console.log(`Design system checks passed: ${passed}`);
