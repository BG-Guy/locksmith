# Guardian Locksmith

Marketing website for Guardian Locksmith, a locksmith business serving Long Island, NY. Static HTML/CSS/JS — no build step, no dependencies.

## Structure

```
index.html      Home
services.html   Service details
about.html      Company story
contact.html    Contact info + request form
css/style.css   Shared styles
js/main.js      Mobile nav, scroll reveal, contact form demo
```

## Running locally

Any static file server works, e.g.:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Before launch — replace placeholders

- Phone number: `(516) 555-0142` (appears in every page's header/footer and `tel:` links)
- Email: `info@guardianlocksmith.com`
- License number in the footer (`License #placeholder-0000`)
- Contact form on `contact.html` is a front-end demo only — wire `js/main.js`'s submit handler to a real backend or form service (e.g. Formspree, Netlify Forms) before launch
- Add real customer testimonials/reviews once available — none are included, since fabricated reviews would be misleading on a live business site
