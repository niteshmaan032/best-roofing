# Roofing project record (Royal Renovators, NY Roofing, Goldenberg)

Written 22 Sep 2026 from the full working session with Claude Code. Everything below is what
happened, in order, so nothing is lost if the chat is gone.

Developer: Nitesh Maan (Zonic LLC). Client: Sean Levine, Royal Renovators Inc.
Repo: `/Users/niteshmaan/Desktop/nyc-renovators` (GitHub Pages at
`https://niteshmaan032.github.io/nyc-renovators/`).

---

## 1. Ground rules from the client (apply to all three sites)

- Every revision round goes into NEW versioned files. Originals and previous versions stay
  untouched as "staged" so the client can compare. Nothing is git-committed by Claude.
- Halve the white space wherever a section has empty space above or below its heading.
- One screen plus a teaser: a section should fit one screen with a slice of the next showing.
- US English (z not s, fiber not fibre). Oxford comma in lists of three or more.
- Never bare "New York": always "New York City" or "NYC". Royal is always "Royal Renovators Inc."
  Goldenberg is always "Goldenberg Roofing NYC".
- Full Name and Best Phone Number side by side on every desktop form; stacked on phones.
- The three sites must look different from each other (placeholders, section names, nav wording).
- Cards on mobile become horizontal sliders; desktop keeps its grid. Where the client asked for
  three items on mobile, desktop keeps four.
- Keep content for SEO: long lists on mobile get "click to see more", not deletions.
- Send links in a form ChatGPT and Claude can read (the client pastes pages into ChatGPT for
  review). GitHub Pages links did not open in his viewer.
- Cache-busting: every stylesheet and script link carries `?v=N`; bump it after each edit or the
  browser serves stale CSS.

## 2. Live working files (round 4, current)

Royal Renovators
- `nyc6.html` (homepage), `nyc6-contact.html`, `nyc6-about.html` (new), `nyc6-shingle-roofing.html`,
  `nyc6-projects.html`, `nyc6-blog.html`, `nyc6-faqs.html`
- `css/nyc6.css`, `css/nyc6-shingle.css`, `css/nyc6-projects.css`, `css/nyc6-blog.css`,
  `css/nyc6-faqs.css`, `css/nyc6-about.css`; `js/nyc6.js`, `js/nyc6-faqs.js`
- Live: https://niteshmaan032.github.io/nyc-renovators/nyc6.html

NY Roofing
- `nyroofing4.html`, `nyroofing4-contact.html`, `css/nyroofing4.css`, `js/nyroofing4.js`
- Live: https://niteshmaan032.github.io/nyc-renovators/nyroofing4.html

Goldenberg / Best Roofing
- `bestroofing4.html`, `bestroofing4-contact.html`, `css/bestroofing4.css`,
  `css/bestroofing4contact.css`, `js/bestroofing4.js`
- Live: https://niteshmaan032.github.io/nyc-renovators/bestroofing4.html

Previous staged versions (do not touch): nyc5 set, nyroofing3 set, bestroofing3 set; before
those nyc4, nyroofing2, bestroofing2; the originals nyc2/contact, nyroofing, bestroofing.

Shared assets added this round: `images/blog/*` (six real post photos from the live site),
`images/live/*` (real crew photos from nycrenovators.com: flat-roof-crew-queens,
shingle-gaf-timberline-install, about-hero, crew-tearoff-aerial, crew-brooklyn-street,
crew-shingle-tearoff, crew-truck), `images/bbb-accredited-640.png`.

## 3. Reports and emails (Claude artifacts)

- Tuesday 15 Sep call change list (all three sites, 106 items):
  https://claude.ai/code/artifact/461b9830-7050-4973-8bec-3a77c08802f4
- Friday 18 Sep call change list (Royal, 38 items):
  https://claude.ai/code/artifact/0dd38afa-f15e-4b02-8864-76aaa3ec3e8a
- Client email, round 4 (all three sites + About page, live URLs):
  https://claude.ai/code/artifact/09437bfd-ebce-42f4-afa5-5e0ecc24de01
- Earlier: nyc6-only email https://claude.ai/code/artifact/86d1c773-0acd-4aca-8d4c-3109e3b830fb,
  11 Sep call list https://claude.ai/code/artifact/b992b5b8-7d04-4c1a-9d5e-6dd97d8f3e98,
  Round-3 PDF on the Desktop: `Round-3-Change-Report-2026-09-14.pdf`.

## 4. What was done, round by round

### Round 3 (nyc5 / nyroofing3 / bestroofing3, from the 11 Sep call)
- Trustindex Google reviews widgets replaced the dummy review sliders on all three sites
  (Royal id 822a762744ea8344f0862095899, NY Roofing d1db8fa68d5a3181cb46b4f6cad,
  Goldenberg ad7207c66cc76800e726576a073). Note: Trustindex waits for the first mouse move or
  scroll before drawing widgets below the fold.
- Goldenberg hero: "24/7 Emergency Repair" chip replaced by Google G logo + 5.0 star + "Google",
  with extra space before "Free Estimates". Reviews section moved below the "Don't let a small
  roof problem…" band.
- NY Roofing hero form: red error text, centered thank-you panel with a yellow call link, form
  hides after submit.
- Royal blog page (`nyc5-blog.html`) and FAQs page (`nyc5-faqs.html`) built: blog uses the six
  real posts from nycrenovators.com; FAQ page has 66 questions in ten topics with live search
  and a sticky topic rail. Heroes reduced to a single heading ("Our Insights",
  "Frequently Asked Questions"), estimate band removed above the footer, blog cards show
  "Royal Renovators Inc." beside the date, FAQ accordion on the blog page, six blog cards with
  pagination.

### Round 4 (nyc6 / nyroofing4 / bestroofing4, from the 15 Sep Tuesday call)
Royal homepage: red 3px stripe under the header (2px mobile); hero heading and paragraph
30px lower, CTAs and credential marks right-aligned clear of the chat pop-up; plaque "Since
1988" with the outline seal as default and the "Change design" picker removed; white hero form
with navy heading, Full Name + Best Phone side by side, the "We'll only contact you about your
project." line under the phone field; hero GAF/Yelp marks no longer navigate; floating green
call button hidden on desktop; services strip starts with "Flat Roof Systems" visible.
Section order: reviews after Recent Projects, awards replaced by a centered "Accredited and
reviewed by" strip, blog ("Roofing Tips and Guides", date-only bylines) after Areas, network
section hidden (moved to About Us). Why Choose keeps the top three cards with the client's
5 Star Reviews text and the "Since 1988, our name is on buildings…" paragraph, cards capped at
four lines. GAF section: Contractor ID under the logo, one benefit card removed. Contact
section: cards above a taller borderless map, centered form heading, address on two lines,
office hours removed. Footer: logos left level with contact details right, then socials left
with copyright and Terms right; "Home" and "Roof Inspection" links removed. Areas list: Queens
removed, Far Rockaway heads the right column.
Royal contact page: "Tell us about your roofing project." then "Request a free written estimate
or call us…" on the next line; short dashes; "Get a Free Estimate" submit; validation never
says "please call"; "We respond within one day"; "Receive Your Written Estimate"; the
"A photograph helps…" sentence removed; Inc. 5000 added to the credential row; title
"Contact Royal Renovators Inc."; "for immediate assistance" only on mobile.
Royal blog page: half-height hero, four-line featured excerpt, "More From Royal Renovators
Inc.'s Blog". FAQ page: tighter hero, numbered topics, rail scrolls within the page.

NY Roofing: "Areas Served" nav; Metal Roofing and Roof Leak Detection removed from the dropdown;
Resources opens on first click; rating 5.0 everywhere; placeholder "A leak, a new roof, or
something else? Tell us what you need..."; About badge and bullet icons removed, crew photo
cropped; "Here's how a job with us differs:"; "SBS membrane", "fiber"; contact panel phone →
24/7 → office; band "Have a roofing question or need a free estimate? Reach out today";
footer "We deliver quality workmanship for lasting results.", no Home link, mobile chips
trimmed; contact page: shorter banner with breadcrumb right, one-line intro "Roofing questions
or a free estimate? Call us 24/7", Name+Phone and Address+Email side by side with 20px gaps,
placeholders "Full name" / "Property street address, borough", "An on-site inspection", "Once
you approve, we schedule the work", form no longer stretches the card; mobile contact page
keeps the form under the head (homepage section-order rules scoped out).

Goldenberg: nav dividers removed; hero "Licensed & Insured" eyebrow, "Manhattan's Flat Roof
Experts" (white "Manhattan's"), paragraph "Flat roof repair and replacement for homes,
brownstones, and commercial buildings across NYC.", chips 5.0 Google · 24/7 Emergency Response ·
TPO, EPDM & SBS Specialists, white form slid right; Who We Work With deleted; CTA band "Protect
your NYC property with a lasting roof" with the client's text and equal buttons; "New York City",
"Goldenberg Roofing NYC", Oxford commas site-wide; two bullets per What We Do card; contact
form box runs the full navy column, intro "Tell us what is happening with your roof, and we
will contact you"; footer white text, "Office Hours", two-line address, new paragraph; every
section shares the header's side padding; contact page paired fields, no Opening Hours, FAQ lede
"Straight answers to what property owners ask"; mobile: sliders (Shingle Roofing first), two
blog cards, trimmed footer, contact page details → form → map → FAQs with a full-width yellow
call button.

### Friday 18 Sep call (nyc6, same version)
Applied from the call and the four Meet-chat wordings: mobile hero paragraph "Serving NYC since
1988. BBB A+ rated and GAF Master Elite, specializing in flat roofing, shingles, siding and
gutters."; Exterior Work intro "Water can enter through more than your roof…"; Roofing Systems
intro "NYC brownstones, apartments, and storefronts typically use low-slope roofing…"; Flat Roofs
card "Common throughout NYC, flat and low-slope roofs need proper drainage…"; real live-site
photos in the Flat/Shingle Roofs cards; GAF ID directly under the logo; Building Types three-line
cards with tighter spacing; Why Choose aerial photo stretched so the 35+ tile lines up (photo not
cropped, per Nitesh); "Not sure which one you need?" band is just that line and the button;
mobile: Call button only in the hero, GAF badge inert, "Same-Day Leak Response" hidden,
"Serving Queens & NYC", map under the Areas intro, Angi line hidden in GAF, footer logos cut to
Google/BBB/GAF, reviews and GAF padding halved; contact page "Inc." title, desktop lede ends at
the number, Inc. 5000 mark, FAQ button hidden on mobile; shingle page white estimate button,
H2 "Shingle Roof Installation, Replacement & Repair", two-per-view benefit slider, FAQs show
five with "Click to see more", nyc6 footer applied. Skipped per Nitesh: raising the hero form.
Open with the client: which mobile Areas treatment he wants (call said remove the list and show
the map; Nitesh's earlier note said keep the list).

### About Us page (`nyc6-about.html`, built 21 Sep)
Final structure: hero with the crew photo (from
https://www.nycrenovators.com/wp-content/uploads/2024/09/Photo-Jul-02-2024_-2-57-14-PM-_5_-_1_-1.webp);
1) Top-Rated Queens Roofing Contractor With 35+ Years of Experience (collage + copy);
2) A Local Roofing Company Built on Experience & Results (navy band with four stat tiles);
3) Roofing Services We Specialize In (seven cards + a red "Not sure what your roof needs?"
request-a-quote card); 4) Why Property Owners Choose Royal Renovators Inc. (lede + seven
reasons in a two-column grid); 5) A Roofing Company Focused on Long-Term Value (centered
banner, mission quote removed); then How a Job With Us Runs, the One Standard Six Local
Companies panel, estimate band, Trustindex reviews, Get In Touch, footer. Content came from
nycrenovators.com/queens/about-us/. Nitesh finished the last tweaks himself after the usage
limit hit. All nyc6 pages share the homepage footer and link About to this page.

## 5. Techniques that worked (for next time)

- Meeting videos: `afconvert` to 16 kHz mono WAV, `mlx-whisper` (whisper-large-v3-turbo) for
  the transcript, PyAV frames every 30–60 s into PIL contact sheets, and a small Swift tool on
  Apple Vision (`ocr.swift`) to read ChatGPT text the client scrolled on screen.
- Verification: local `python3 -m http.server`, Chrome MCP with 412px iframes for phone checks
  (tabs vanish often; re-fetch context). When the extension drops, headless Chrome works:
  `Google Chrome --headless=new --no-sandbox --virtual-time-budget=12000 --window-size=W,H
  --screenshot=out.png URL` run in the background and killed once the file exists (`timeout`
  is not installed on this Mac).
- Change-list pages and emails are built as HTML with a "Copy email text" button and published
  as artifacts so the client-facing text can be pasted straight into Gmail.

## 6. What is next

- Royal borough company pages, starting with Queens and Brooklyn. Queens keeps the Royal
  Renovators Inc. name and logos with "Queens" in place of NYC. Brooklyn is "Royal Roofing and
  Siding Brooklyn": only the Google mark (Yelp optional), no GAF Master Elite, no license number
  ("fully licensed and insured"), neighborhoods instead of boroughs, its own Trustindex widget
  kept high, its own blogs and FAQs. Estimate from the call: three to four weeks for all main pages.
- Sean will email shorter copy for the shingle page hero.
- Confirm the Trustindex widget ID with the WordPress team (widget count differs from Google).
- Client plan: go live with Royal first, then NY Roofing, then Goldenberg. Calls are usually
  Tuesday or Friday at 12 pm EDT.
