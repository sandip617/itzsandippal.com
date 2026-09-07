const siteConfig = {
  email: "itzsandip617@gmail.com",
  whatsapp: "917022232721"
};

document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const progress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${(window.scrollY / max) * 100}%`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

document.querySelectorAll(".project-open").forEach(btn => {
  btn.addEventListener("click", () => {
    modalTitle.textContent = btn.dataset.project;
    modalText.textContent =
      "This project card is ready for your real case study. Add project images, your role, the challenge, your approach and the result here.";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if (event.target.dataset.close === "true") closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const subject = encodeURIComponent(`New service request from ${data.get("name")}`);
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\nProject details:\n${data.get("message")}`
  );
  window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  document.getElementById("formNote").textContent = "Opening your email app with the project details...";
});

document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
  a.href = `https://wa.me/${siteConfig.whatsapp}`;
});
