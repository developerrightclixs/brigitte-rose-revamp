# Brigitte Rose — Static Website

Luxury sleepwear storefront built in plain **HTML, CSS and JavaScript** (no framework, no build dependencies at runtime). Brand assets, copy, product names, prices and descriptions mirror the live reference at `brigitterose.developerstagging.com`.

## Run it

Open `index.html` directly, or serve the folder:

```
python -m http.server 8080
```

Then visit <http://localhost:8080/>.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, about teaser, values, debut collection, quote, gallery strip |
| `about.html` | Founder story, background, mission & vision, why choose |
| `products.html` | Shop grid with sticky animated fabric filter (sliding indicator, per-filter counts), sorting, quick-add |
| `product.html?p=<id>` | Product detail (Victoria's Secret-style): thumbnail gallery with hover zoom and lightbox, badges, star rating, print swatches, size grid + Size Guide, fit scale, quantity, Add to Bag, favorite, delivery options, Details / Fabric & Care / Shipping accordions, style #, share, sticky add-to-bag bar, You May Also Love carousel, Ratings & Reviews (write, sort, filter, helpful), Recently Viewed |
| `gallery.html` | Masonry gallery with lightbox and load-more (32 images from the client's gallery.zip, 1600px + 800px versions) |
| `contact.html` | Contact form with validation + FAQ |
| `cart.html` | Bag with quantity, remove, promo codes, free-shipping progress |
| `checkout.html` | Contact, shipping, delivery method, payment (card validation), notes, order summary |
| `order-confirmation.html` | Receipt for the placed order |
| `wishlist.html` | Saved sets |
| `terms.html`, `privacy.html` | Legal pages (draft — see approvals) |
| `404.html` | Not found |

## Structure

```
assets/css/styles.css      design tokens + all components
assets/js/data.js          catalog, gallery list, store config (shipping, tax, promo codes, contact)
assets/js/store.js         cart / wishlist / promo / orders in localStorage
assets/js/main.js          shared UI: header, drawers, mini-cart, toasts, modal, lightbox, cards, newsletter
assets/js/pages/*.js       one script per page
assets/img/                brand, product (lg + sm), gallery images
tools/layout.html          shared head/header/footer shell
tools/pages/*.html         page bodies
tools/build.py             assembles root HTML pages from layout + bodies
```

To change the header, footer or newsletter on every page, edit `tools/layout.html` and run `python tools/build.py`. To change a single page, edit its file in `tools/pages/` and rebuild. The root `*.html` files are the generated output.

## Typography

Headings use **MADE Saonara** (self-hosted in `assets/fonts/`, Playfair Display fallback), body copy uses **Google Sans** (loaded from the Google Fonts API; it is not part of the public catalog, so confirm usage rights with Google before launch — the fallback stack is Google Sans Text, Product Sans, then the system sans), and labels/buttons use **Lora** (Google Fonts). Two Saonara cuts are bundled: `MADE Saonara` (regular, used) and `MADE Saonara 2` (tight fashion display cut); switch via `--f-display`.

> **License:** the bundled Saonara files are MadeType's *personal use* release. A commercial license must be purchased before launch: <https://pixelsurplus.com/products/made-saonara> (see `assets/fonts/MADE-Saonara-LICENSE.txt`). To change a face, edit `--f-display`, `--f-body` or `--f-label` in `assets/css/styles.css` and the Google Fonts link in `tools/layout.html`, then rebuild.

## Corner radius

Three tokens in `assets/css/styles.css` control rounding: `--radius` (6px: buttons, inputs, badges, small images), `--radius-md` (12px: product cards, imagery, panels, modals, toasts) and `--radius-lg` (18px: drawers, hero image, page-hero and newsletter bands, sticky bar). Adjust the tokens to tune the whole site at once.

## Add-to-bag animation

Every add-to-bag action (product page, sticky bar, quick-add on cards) snapshots the product image, arcs it into the header bag icon, bumps the icon, then opens the bag sidebar. The animation is skipped automatically when the visitor prefers reduced motion. See `BR.flyToBag` in `assets/js/main.js`.

## Store configuration (`assets/js/data.js`)

- **Products**: name, price, fabric, design, description, care, images.
- **Sizes**: S / M / L.
- **Shipping**: Standard $10 (free at/above `freeShippingThreshold` = $150), Express $25.
- **Tax**: 9.5% applied when the shipping state is California; 0 elsewhere.
- **Promo codes**: `SPARKLE10` (10%), `WELCOME15` (15%), `FREESHIP` (free standard shipping).
- **Contact details**: email, phone, Instagram URL.
- **Size guide**: `sizeGuide` rows shown in the Size Guide modal (standard US sizing; confirm with the client).
- **Installments**: `installments.enabled` turns on the "4 interest-free payments" line once a provider (Klarna, Afterpay) is integrated. Off by default.
- **Per-product**: `color` (swatch label), `swatch` (chip color), `style` (style #), `bullets` (Details list), `badges`, and `reviews` (seed real customer reviews here; customer-written reviews are stored in the browser).

## How the cart & checkout work

All state lives in the browser's `localStorage` (`br_cart_v1`, `br_wishlist_v1`, `br_promo_v1`, `br_orders_v1`, `br_checkout_v1`). Checkout validates every field (email, address, ZIP, phone, Luhn card check, expiry, CVC), simulates payment processing, stores the order and redirects to the confirmation page. **No money is taken** — wire `checkout.js` to Stripe, PayPal or your commerce backend before launch.

The contact and newsletter forms validate and show success states client-side only. Connect them to a form service or backend to receive submissions.

## QA performed

Headless Chromium (Playwright) across 13 pages at 1440, 1024, 768, 390 and 320 px:

- 0 console errors, 0 horizontal overflow at any width.
- Verified: quick-add, wishlist toggle, size validation, add to bag → mini-cart, thumbnails & lightbox, quantity stepper, promo (valid + invalid), free-shipping progress, checkout validation (12 required fields), CA tax, express shipping, card formatting/brand detection, order placement → confirmation, cart cleared, contact & newsletter validation and success, gallery load-more & lightbox, mobile menu open/close with scroll lock and Escape.

## Items for client approval

1. **Contact email & phone** are the live site's placeholders (`ex@domain.com`, `(+1) 234 56 789`). Replace in `data.js` and `tools/layout.html`.
2. **Instagram URL** is not set on the live site; currently points to instagram.com.
3. **Gallery copy** ("Fall/Winter 2026… plaids and floral prints") does not match the sparkle-set imagery. Kept verbatim; recommend revising.
4. **Terms & Privacy** pages are standard drafts and need legal review (the live site returns 404 for both).
5. **Shipping, tax and promo rules** above are reasonable defaults, not confirmed policy.
6. **Size Guide** measurements are standard US sizing placeholders, not Brigitte Rose's measured spec.
8. **Reviews** start empty on purpose (no fabricated reviews). Real reviews can be seeded per product in `data.js`; the on-page "Write a Review" form stores reviews in the visitor's browser until a review backend is connected.
7. **Payment gateway, order emails, form delivery** require backend integration.
9. **MADE Saonara font** is the personal-use release; buy the commercial license before go-live.
