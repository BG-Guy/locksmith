// Homepage preloader — builds the dial's tick marks, then dismisses the
// overlay once the 2.5s spin-and-unlock animation finishes.
const preloader = document.querySelector("#preloader");

if (preloader) {
  const stickContainer = preloader.querySelector("#preloaderSticks");

  for (let i = 0; i < 40; i++) {
    if (i % 5 === 0) {
      const long = document.createElement("div");
      long.className = "pl-longStick";
      long.style.transform = `translateY(-50%) rotate(${9 * i}deg) translateY(-72px)`;
      const number = document.createElement("span");
      number.className = "pl-nOfStick";
      number.textContent = i;
      long.appendChild(number);
      stickContainer.appendChild(long);
    } else {
      const short = document.createElement("div");
      short.className = "pl-shortStick";
      short.style.transform = `translateY(-50%) rotate(${9 * i}deg) translateY(-82px)`;
      stickContainer.appendChild(short);
    }
  }

  document.body.style.overflow = "hidden";

  window.setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.body.style.overflow = "";
    window.setTimeout(() => preloader.remove(), 600);
  }, 2500);
}

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

// Mobile nav drawer — opened by the hamburger button, closed by the site's
// existing .mobile-nav-drawer + .site-header.nav-open CSS. First tap
// "primes" (previews) a link by sliding its panel out from behind the nav,
// second tap on the same link follows it; a real pointer's hover still
// works the same way if one's present.
// Adapted from the "Side Menu with Hover Image Teasers" snippet in
// github.com/BG-Guy/code-library (id: hover-teaser-side-menu) — same
// same-width nav/teaser mechanism, restyled with icon panels instead of
// photos/colors since no site photography exists yet. Swap the icon
// markup below for a real photo per link once available.
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

const mobileNavMenuEl = document.querySelector("#mobileNavMenu");

if (mobileNavMenuEl) {
  initHoverTeaserMenu(mobileNavMenuEl, [
    {
      id: "home",
      label: "Home",
      href: "index.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 11l8-7 8 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v10h12V10" stroke="currentColor" stroke-width="1.4"/><path d="M10 20v-6h4v6" stroke="currentColor" stroke-width="1.4"/></svg>`,
    },
    {
      id: "services",
      label: "Services",
      href: "services.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    },
    {
      id: "about",
      label: "About",
      href: "about.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/><path d="M12 8h.01M11 11h1v6h1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    {
      id: "contact",
      label: "Contact",
      href: "contact.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" stroke="currentColor" stroke-width="1.4"/></svg>`,
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
