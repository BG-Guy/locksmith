// Mobile nav toggle
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    header.classList.toggle("nav-open");
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => header.classList.remove("nav-open"));
  });
}

// Reveal-on-scroll
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Service quick-look teaser menu — mobile layout only (hidden above 760px
// via .quick-look-section in style.css, since the desktop services grid
// above already covers the same links). First tap "primes" (previews) a
// link by sliding its panel out from behind the nav, second tap on the
// same link follows it; a real pointer's hover still works the same way
// if one's present.
// Adapted from the "Side Menu with Hover Image Teasers" snippet in
// github.com/BG-Guy/code-library (id: hover-teaser-side-menu) — same
// same-width nav/teaser mechanism, restyled with icon panels instead of
// photos/colors since no service photography exists yet. Swap the icon
// markup below for a real photo per service once available.
function initHoverTeaserMenu(container, links) {
  container.innerHTML = `
    <div class="htm-teaser-layer">
      ${links.map((l) => `<div class="htm-teaser" data-teaser="${l.id}">${l.icon}</div>`).join("")}
    </div>
    <nav class="htm-nav">
      ${links
        .map(
          (l) => `
        <a href="${l.href}" class="htm-link" data-link="${l.id}">
          <span>${l.label}</span>
          <span class="htm-dot"></span>
        </a>`
        )
        .join("")}
    </nav>
  `;

  let primed = null; // { link, leave } of whichever link is currently tap-primed

  container.querySelectorAll("[data-link]").forEach((link) => {
    const id = link.dataset.link;
    const teaser = container.querySelector(`[data-teaser="${id}"]`);

    const enter = () => {
      link.classList.add("is-active");
      teaser.classList.add("is-active");
    };
    const leave = () => {
      link.classList.remove("is-active");
      teaser.classList.remove("is-active");
    };

    let lastPointerType = "mouse";

    link.addEventListener("pointerdown", (e) => {
      lastPointerType = e.pointerType;
    });
    link.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") enter();
    });
    link.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse") leave();
    });

    link.addEventListener("click", (e) => {
      if (lastPointerType !== "touch") return;

      if (primed && primed.link !== link) {
        primed.leave();
        primed = null;
      }

      if (!primed) {
        e.preventDefault();
        enter();
        primed = { link, leave };
      } else {
        leave();
        primed = null;
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (primed && !container.contains(e.target)) {
      primed.leave();
      primed = null;
    }
  });
}

const teaserMenuEl = document.querySelector("#serviceTeaserMenu");

if (teaserMenuEl) {
  initHoverTeaserMenu(teaserMenuEl, [
    {
      id: "emergency",
      label: "Emergency Lockout",
      href: "services.html#emergency",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="2" width="14" height="20" rx="1" stroke="currentColor" stroke-width="1.4"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/></svg>`,
    },
    {
      id: "residential",
      label: "Residential",
      href: "services.html#residential",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 11l8-7 8 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v10h12V10" stroke="currentColor" stroke-width="1.4"/><path d="M10 20v-6h4v6" stroke="currentColor" stroke-width="1.4"/></svg>`,
    },
    {
      id: "commercial",
      label: "Commercial",
      href: "services.html#commercial",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" stroke="currentColor" stroke-width="1.4"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    },
    {
      id: "automotive",
      label: "Automotive",
      href: "services.html#automotive",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 16l1.5-5.5A2 2 0 0 1 7.4 9h9.2a2 2 0 0 1 1.9 1.5L20 16" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><rect x="3" y="16" width="18" height="4" rx="1" stroke="currentColor" stroke-width="1.4"/><circle cx="7.5" cy="20" r="1.3" fill="currentColor"/><circle cx="16.5" cy="20" r="1.3" fill="currentColor"/></svg>`,
    },
    {
      id: "rekeying",
      label: "Lock Rekeying",
      href: "services.html#rekeying",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M11 12h11M18 12v3M21 12v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    },
    {
      id: "high-security",
      label: "High-Security",
      href: "services.html#high-security",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2 4 5v6c0 5 3.4 9.1 8 11 4.6-1.9 8-6 8-11V5l-8-3z" stroke="currentColor" stroke-width="1.4"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
  ]);
}

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
