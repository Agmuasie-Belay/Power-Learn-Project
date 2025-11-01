// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// Contact Form Handling
const form = document.getElementById("contact-form");
const response = document.getElementById("form-response");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    response.textContent = "✅ Thanks! Your message has been sent.";
    form.reset();
  });
}
