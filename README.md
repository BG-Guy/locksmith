# Guardian Locksmith

Marketing website for Guardian Locksmith, a locksmith business serving Long Island, NY. Static HTML/CSS/JS — no build step, no dependencies.

## Structure

Each page's own styles and behavior live in a file of the same name, right
next to it. Styles and scripts used by more than one page live in
`components/`, one subfolder per component. `global.css` holds only
CSS variables, the reset, and base typography — nothing page- or
component-specific.

```
index.html                       Home
home.css / home.js                 → its styles / preloader + scroll-reveal

services.html                    Service details
services.css                       → its styles

about.html                       Company story
about.css                          → its styles

contact.html                     Contact info + request form
contact.css / contact.js           → its styles / form-submit demo

global.css                       Variables, reset, base typography — nothing else

components/
  header/header.css                Logo, desktop nav, phone/CTA actions
  mobile-nav/mobile-nav.css+js      Hamburger button + slide-in panel
  footer/footer.css                Footer link grid + copyright bar
  buttons/buttons.css              .btn variants used everywhere
  page-hero/page-hero.css          Dark banner atop services/about/contact
  cta-band/cta-band.css            Brass CTA band (home, services, about)
```

## Running locally

```
npm run dev
```

Then open the URL it prints (defaults to http://localhost:4488; override with `PORT=xxxx npm run dev`).

## Before launch — replace placeholders

- Phone number: `(516) 555-0142` (appears in every page's header/footer and `tel:` links)
- Email: `info@guardianlocksmith.com`
- License number in the footer (`License #placeholder-0000`)
- Contact form on `contact.html` is a front-end demo only — wire `contact.js`'s submit handler to a real backend or form service (e.g. Formspree, Netlify Forms) before launch
- Add real customer testimonials/reviews once available — none are included, since fabricated reviews would be misleading on a live business site
