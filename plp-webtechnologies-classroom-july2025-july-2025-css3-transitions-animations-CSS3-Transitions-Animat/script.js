// Wait until DOM is ready to avoid "null" references
document.addEventListener('DOMContentLoaded', () => {
  // --- Page load polish ---
  document.body.classList.add('loaded');

  // --- Theme toggle (safe guard: check element exists) ---
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  } else {
    console.warn('#theme-toggle not found');
  }

  // --- Counter feature ---
  let counter = 0;
  const counterDisplay = document.getElementById('counter');
  const incrementBtn = document.getElementById('increment-btn');
  if (incrementBtn && counterDisplay) {
    incrementBtn.addEventListener('click', () => {
      counter += 1;
      counterDisplay.textContent = counter;
    });
  } else {
    console.warn('Counter elements missing');
  }

  // --- Functions demo: local vs global scope ---
  let globalValue = 5;
  document.getElementById('global-val').textContent = globalValue;

  function square(num) {
    // local var `result` demonstrates local scope
    const result = num * num;
    return result;
  }

  const calcBtn = document.getElementById('calc-btn');
  const resultSpan = document.getElementById('result');
  if (calcBtn && resultSpan) {
    calcBtn.addEventListener('click', () => {
      const out = square(globalValue);
      resultSpan.textContent = out;
    });
  } else {
    console.warn('Calculation elements missing');
  }

  // --- JS triggers CSS animation by toggling a class ---
  const triggerBox = document.querySelector('.trigger-box');
  const animateBtn = document.getElementById('animate-btn');
  if (animateBtn && triggerBox) {
    animateBtn.addEventListener('click', () => {
      // Toggle class to trigger CSS transitions/keyframes
      triggerBox.classList.toggle('animate');
    });
  } else {
    console.warn('Trigger animation elements missing');
  }

  // Optional: global keyboard helper to remove the animate class when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.trigger-box.animate')) {
      document.querySelector('.trigger-box').classList.remove('animate');
    }
  });
});
