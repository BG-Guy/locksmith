// Behavior unique to contact.html: the request-service form. This is a
// front-end demo only — no backend is wired up yet, so "sending" just
// pauses briefly, then shows the confirmation and clears the form.

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const successMsg = document.querySelector("#form-success");
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;
  const idleLabel = submitLabel ? submitLabel.textContent : "";

  // How long the demo "Sending…" state lasts: long enough to register,
  // short enough not to feel slow.
  const SEND_DELAY_MS = 900;

  // Busy state on the submit button: disabled (so a double click can't
  // send twice), with its label swapped for "Sending…" (see contact.css).
  function setSending(isSending) {
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.classList.toggle("is-sending", isSending);
    if (submitLabel) submitLabel.textContent = isSending ? "Sending…" : idleLabel;
  }

  // Demo submit: show the busy state, then the confirmation. Focus moves to
  // the confirmation (role="status", tabindex="-1" in the HTML) so keyboard
  // and screen-reader users land on it and hear it.
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitBtn && submitBtn.disabled) return;

    if (successMsg) successMsg.classList.remove("is-visible");
    setSending(true);

    window.setTimeout(() => {
      contactForm.reset();
      setSending(false);
      if (successMsg) {
        successMsg.classList.add("is-visible");
        successMsg.focus();
      }
    }, SEND_DELAY_MS);
  });
}
