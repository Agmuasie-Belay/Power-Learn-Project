// ----------------------------
// Dark/Light Mode Toggle
// ----------------------------
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// ----------------------------
// Counter Feature
// ----------------------------
let counter = 0;
const counterDisplay = document.getElementById('counter');
document.getElementById('increment-btn').addEventListener('click', () => {
  counter++;
  counterDisplay.textContent = counter;
});

// ----------------------------
// Collapsible FAQ Section
// ----------------------------
const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
  });
});

// ----------------------------
// Form Validation
// ----------------------------
const form = document.getElementById('signup-form');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form from submitting

  // Get input values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Error message elements
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const formSuccess = document.getElementById('form-success');

  let isValid = true;

  // Validate Name
  if (name.length < 3) {
    nameError.textContent = "Name must be at least 3 characters.";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  // Validate Email
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    emailError.textContent = "Enter a valid email.";
    isValid = false;
  } else {
    emailError.textContent = "";
  }

  // Validate Password
  if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    isValid = false;
  } else {
    passwordError.textContent = "";
  }

  // Show success message if valid
  if (isValid) {
    formSuccess.textContent = "Form submitted successfully! 🎉";
    form.reset();
  } else {
    formSuccess.textContent = "";
  }
});
