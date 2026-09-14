# Guardian Locksmith

Marketing website for Guardian Locksmith, a locksmith business serving Long Island, NY. Static HTML/CSS/JS — no framework, no npm dependencies.

## Structure

The site is generated from small, single-purpose source files, then built into plain static HTML at the repo root (what actually gets deployed).

```
components/        Shared HTML building blocks, reused across pages
  head.html           <head> boilerplate (title/description are filled in per page)
  preloader.html      Homepage-only intro animation panel
  header.html          Site header + nav (active link / CTA filled in per page)
  page-hero.html        Inner-page hero banner (services/about/contact)
  cta-band.html          "Call to action" band (content filled in per page)
  footer.html             Site footer + script tags

pages/              Page-specific content — just the unique middle section
  home.html, about.html, services.html, contact.html

data/
  pages.json        Per-page metadata: title, description, active nav item,
                     header CTA, page-hero text, CTA-band text, etc.

css/
  style.css          Entry point — imports everything below, holds no rules itself
  base/
    tokens.css          Design tokens (colors, fonts, spacing)
    base.css            Element resets + .wrap layout container
  components/          One file per reusable UI piece (header, footer, hero,
                        buttons, services grid, steps, footer, preloader, ...)
  pages/                Styles specific to one page's content (about/services/contact)

js/
  components/          One file per behavior (preloader, nav toggle, scroll
                        reveal, mobile nav teaser menu, contact form demo)
                        — loaded as separate <script defer> tags, no bundler

scripts/
  dev-server.js       Zero-dependency static file server for local preview
  build.js            Assembles components/ + pages/ + data/pages.json into
                       the root-level index.html / about.html / services.html /
                       contact.html

index.html, about.html, services.html, contact.html
                    Generated output — do not hand-edit these directly (see below)
```

## Making changes

Edit the source files, not the generated root-level HTML pages:

- Shared markup (header, footer, page hero, CTA band) → edit the matching file in `components/`
- Text that differs per page (titles, hero copy, CTA copy, which nav link is active) → edit `data/pages.json`
- Content unique to one page → edit the matching file in `pages/`
- Styling → edit the relevant file under `css/components/` or `css/pages/` (or `css/base/` for tokens/resets)
- Behavior → edit the relevant file under `js/components/`

Then regenerate the static pages:

```
npm run build
```

This overwrites `index.html`, `about.html`, `services.html`, and `contact.html` at the repo root — commit those alongside your source changes, since they're what actually gets deployed.

## Running locally

```
npm run dev
```

Then open http://localhost:4488 (or `python3 -m http.server 8000`, or any static file server, also work).

## Before launch — replace placeholders

- Phone number: `(516) 555-0142` (in `components/header.html`, `components/footer.html`, `data/pages.json`, and `pages/contact.html`)
- Email: `info@guardianlocksmith.com` (`components/footer.html`, `pages/contact.html`)
- License number in the footer (`components/footer.html`, `License #placeholder-0000`)
- Contact form on the Contact page is a front-end demo only — wire `js/components/contact-form.js`'s submit handler to a real backend or form service (e.g. Formspree, Netlify Forms) before launch
- Add real customer testimonials/reviews once available — none are included, since fabricated reviews would be misleading on a live business site
