# Pan-Asia Supermarket — Website

A from-scratch, static HTML/CSS/JS redesign of panasiasupermarket.com. No build step, no framework — just open the folder on any static web host.

## Structure

```
index.html            Home
about.html             About Us
locations.html         Store directory + interactive map (all 9 pins)
employment.html        Careers / job applications
locations/*.html       9 individual store pages (map, hours, departments, apply link)
css/styles.css         Full design system (colors, components, responsive rules)
js/main.js             Nav, hero slideshow, scroll reveal, contact form
js/locations-data.js   Single source of truth for all 9 stores (address, hours, coords, links)
js/map.js              Leaflet map initializer, shared by every page that shows a map
assets/images/         Logo + real store photos (downloaded and optimized from the live site)
```

## Hosting

Any static host works (Netlify, Vercel, GitHub Pages, S3, cPanel, etc.) — just upload the whole folder. `index.html` is the entry point.

## The interactive map

Built with [Leaflet](https://leafletjs.com/) + OpenStreetMap tiles, loaded from a public CDN (`unpkg.com`) — no API key required. This means **the map tiles need an internet connection to load** at runtime (same as Google Maps embeds would). All 9 locations, coordinates, hours and links live in one place: `js/locations-data.js` — edit that file to update a store everywhere at once (home map, locations map, store page, dropdown menu stays manual in each header).

## Updating a store

1. Edit the entry in `js/locations-data.js` (address, phone, hours, coordinates, etc).
2. If the same details appear on that store's own page in `locations/*.html`, update them there too (those pages are static HTML, not generated at runtime).

## Notes on content carried over from the old site

- Logo, all store photos, the two application PDFs (English/Spanish), and every Google Form application link were pulled directly from the live site and kept as-is.
- A few application-form links on the old site pointed to Google Forms' `/edit` view (which only works for the form's owner, not applicants). Those were corrected to the public `/viewform` link so applicants can actually open them — same forms, working link.
- Detroit, MI has no address yet (site says "Coming 2027") — its page reflects that; update `js/locations-data.js` once an address is announced.
