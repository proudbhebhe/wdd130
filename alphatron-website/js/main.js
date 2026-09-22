
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const form = document.querySelector("#project-form");
if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = document.querySelector("#form-message");
    message.textContent = "Thank you. Your project enquiry has been recorded. This demo form is ready to be connected to your preferred form service.";
    message.hidden = false;
    form.reset();
  });
}
