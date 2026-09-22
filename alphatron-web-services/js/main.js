/* Alphatron Web Services — main.js
   Mobile nav toggle, FAQ accordion, and contact form validation.
   Kept intentionally simple and dependency-free. */

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initFaqAccordion();
  initContactForm();
  initFooterYear();
});

/* ---------- Mobile navigation ---------- */
function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- FAQ accordion ---------- */
function initFaqAccordion() {
  var items = document.querySelectorAll(".faq-item");
  items.forEach(function (item) {
    var question = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    if (!question || !answer) return;

    question.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";

      // Close others in the same list for a cleaner reading experience
      var list = item.closest(".faq-list");
      if (list) {
        list.querySelectorAll(".faq-item[data-open='true']").forEach(function (other) {
          if (other !== item) {
            other.setAttribute("data-open", "false");
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
            other.querySelector(".faq-a").style.maxHeight = null;
          }
        });
      }

      item.setAttribute("data-open", isOpen ? "false" : "true");
      question.setAttribute("aria-expanded", isOpen ? "false" : "true");
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var isValid = true;

    form.querySelectorAll("[data-required]").forEach(function (field) {
      var wrapper = field.closest(".form-field");
      var errorEl = wrapper ? wrapper.querySelector(".form-error") : null;
      var value = field.value.trim();
      var fieldValid = true;

      if (!value) {
        fieldValid = false;
      } else if (field.type === "email" && !isValidEmail(value)) {
        fieldValid = false;
        if (errorEl) errorEl.textContent = "Enter a valid email address.";
      }

      if (!fieldValid) {
        isValid = false;
        if (wrapper) wrapper.classList.add("has-error");
        if (errorEl && !errorEl.textContent) errorEl.textContent = "This field is required.";
      } else {
        if (wrapper) wrapper.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
      }
    });

    if (!isValid) {
      if (status) {
        status.textContent = "Please complete the required fields above before sending your enquiry.";
        status.classList.add("visible");
        status.style.background = "#f7ecec";
        status.style.borderColor = "#a13d3d";
        status.style.color = "#a13d3d";
      }
      return;
    }

    // No backend is connected in this build — acknowledge the enquiry locally.
    if (status) {
      status.textContent = "Thank you. Your enquiry has been recorded. This form does not yet send automatically — for now, please also reach us directly via WhatsApp or email so we can respond promptly.";
      status.style.background = "";
      status.style.borderColor = "";
      status.style.color = "";
      status.classList.add("visible");
    }
    form.reset();
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  var el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
