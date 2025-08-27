// ===============================
// 🌐 Mobile Menu Toggle
// ===============================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuToggle.classList.toggle("active"); // animate hamburger
});

// Close menu when clicking a link (better UX on mobile)
document.querySelectorAll("nav ul li a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuToggle.classList.remove("active");
  });
});

// ===============================
// 📩 Contact Form Validation
// ===============================
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.querySelector("input[type='text']").value.trim();
  const email = this.querySelector("input[type='email']").value.trim();
  const message = this.querySelector("textarea").value.trim();

  // Basic validation
  if (!name || !email || !message) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("⚠️ Please enter a valid email address.");
    return;
  }

  // ✅ Success feedback
  alert(`✅ Thanks, ${name}! Your message has been received.`);

  // Reset form
  this.reset();
});
