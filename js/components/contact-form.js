// Contact form (static demo — no backend wired up yet)
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const successMsg = document.querySelector("#form-success");
    if (successMsg) {
      successMsg.classList.add("is-visible");
    }
    contactForm.reset();
  });
}
