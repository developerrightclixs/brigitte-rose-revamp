# Brigitte Rose — Pixel-Perfect Website Refinement Brief for Claude Code

## Mission
Refine the **existing** Brigitte Rose website into a polished, luxury sleepwear shopping experience. This is a **design and UX perfection pass, not a rebuild**. Preserve the current brand logo, brand colors, product data, functionality, integrations, and approved copy. Make every section intentional, aligned, consistent, responsive, accessible, and visually premium.

Live reference: https://brigitterose.developerstagging.com/

## Non-negotiable rules
1. **Inspect the repository first.** Identify framework/CMS, theme, templates, component architecture, styling conventions, plugins, and current design tokens. Work within the existing stack. Do not migrate frameworks or replace the theme without permission.
2. **Preserve the existing logo exactly** (including proportions, spacing, asset, and colors). Do not redraw or rebrand it.
3. **Preserve the existing brand palette.** Extract actual colors from existing CSS/assets. Define/reuse tokens for consistent application; do not introduce a new palette. Neutral supporting tones may be harmonized without changing brand identity.
4. Preserve product names, prices, variants, inventory behavior, checkout, cart, customer information, forms, analytics, SEO, and legal text. Never replace real product photography with generated placeholders.
5. Avoid sweeping rewrites. Make small, verifiable, reversible changes. Never edit production data or delete assets.
6. Treat the existing website as the baseline; improve hierarchy and polish without radically changing the client-approved page order or content.

## Audit before editing
- Inspect every public page, section, interaction, template, and breakpoint. At minimum: Home, About, Products/shop, Gallery, Contact, product detail, cart, checkout, and any existing legal pages.
- Capture screenshots at **1440px, 1024px, 768px, 390px, and 320px** widths (where browser tooling is available). Audit desktop, tablet, mobile, hover, focus, active, loading, empty, error, and sticky states.
- Record existing fonts, logo asset, exact color values, spacing, container widths, image aspect ratios, border radii, shadows, and breakpoints.
- Produce `DESIGN_AUDIT.md` with issue, location, severity, proposed fix, and completion status. Do not claim a page has been visually verified without browser inspection.

## Design direction
Luxury feminine sleepwear, refined editorial fashion aesthetic, calm whitespace, confident typography, beautiful product imagery, understated motion, and exceptional mobile usability. Prioritize clarity and elegance over effects. No unnecessary gradients, glowing effects, generic SaaS UI, excessive rounded cards, or gimmicky animation.

### Global design system
- Standardize content max-width and section gutters across all pages.
- Establish a coherent type scale for display, H1–H6, body, labels, and captions; retain existing brand fonts unless a clear rendering issue requires a compatible fallback.
- Consistent vertical rhythm, optical alignment, line lengths, button sizes, image crops, and grid gaps.
- Make CTA primary/secondary styles consistent with existing brand colors; ensure hover, focus-visible, disabled, and loading states.
- Normalize header/footer, icon stroke weights, dividers, badges, forms, cards, and spacing.
- Use fluid `clamp()` typography and spacing when appropriate; avoid horizontal overflow at any breakpoint.
- Ensure minimum 44x44px touch targets and readable contrast, including on image overlays.

## Page-by-page refinement

### 1. Header and navigation
- Polish logo placement and size while retaining the original logo.
- Align menu items, spacing, capitalization, cart icon/count, and header height.
- Verify desktop hover/focus behavior and mobile menu opening, closing, keyboard use, and scroll locking.
- Ensure sticky behavior (if already implemented) does not overlap content or jump during scrolling.
- Make active-page states obvious but subtle.

### 2. Homepage hero
Existing headline: **“Made to Sparkle, Designed for Comfort.”**
- Refine hero composition, heading wrapping, image positioning, overlay/contrast, CTA placement, and viewport-height behavior.
- Keep the existing visual identity and approved hero imagery.
- Ensure important image subjects are not cropped on mobile; use art direction/object-position where needed.
- Make “Shop Now” prominent, tasteful, and functional.

### 3. About Us teaser
- Improve text/image balance, heading hierarchy, whitespace, and visual alignment.
- Retain the brand story; avoid awkwardly narrow text columns or inconsistent image ratios.
- Provide a natural transition from hero to collection.

### 4. Debut collection / product grid
Current featured products include **Camouflage Sparkle Set, Leopard Sparkle Set, Navy Sparkle Set, Grey Sparkle Set, and Black Sparkle Set** (currently displayed at $189 on the public site; preserve live prices from the store).
- Harmonize card image aspect ratios, cropping, title baselines, price alignment, CTA positions, hover states, and responsive columns.
- Keep the product imagery visually dominant, not crowded by long descriptions.
- Make “Details” / “View Options” clear, accessible, and functional; avoid duplicate/conflicting CTAs.
- Audit sale/stock/variant states where applicable.
- Investigate any unexpected **“No products found”** output; fix its source or display logic only after verifying intended behavior.
- Preserve dynamic WooCommerce or equivalent product bindings; do not hardcode prices or product details.

### 5. Gallery
- Refine gallery composition, image quality, aspect ratios, spacing, and responsive behavior.
- Check whether current text mentioning **Fall/Winter 2026, plaids and floral prints** accurately matches the products and imagery. Flag potential content mismatch for client approval; do not silently rewrite approved copy.
- Ensure “Explore More” leads to the intended destination and gallery interactions work on touch devices.

### 6. Contact / newsletter / footer
- Align newsletter heading, fields, labels, input heights, button, validation, and confirmation/error messages.
- Public homepage currently exposes **“Sign Up Here”** and multiple inputs; confirm each field has a purpose, visible label, correct input type, and sensible mobile layout.
- Refine Pacific Palisades location text, navigation, Instagram link, Terms & Conditions, Privacy Policy, and attribution alignment.
- Preserve any required developer credit and legal disclosures.
- Check social link targets, form delivery, spam protection, and privacy-consent requirements.

### 7. Product detail, cart, checkout, and supporting pages
- Improve product gallery/thumbs, option selectors, size choices, quantity controls, add-to-cart feedback, pricing hierarchy, accordions, and related products **without altering store logic**.
- Polish cart totals, empty cart, checkout form spacing, mobile checkout usability, and error messaging.
- Ensure consistent header/footer and page titles across About, Contact, Shop, Gallery, and legal pages.
- Never interfere with payment processing, shipping, taxes, inventory, or checkout scripts.

## Accessibility and performance
- Semantic heading order, descriptive image alt text, form labels, focus-visible indicators, keyboard navigation, logical tab order, reduced-motion support.
- Avoid layout shifts; use explicit image dimensions/aspect-ratio and responsive image sizes.
- Optimize only safely: image formats, lazy loading below fold, font loading, CSS duplication, and unnecessary animation work. Do not break existing caching/plugins.
- Target strong Core Web Vitals and Lighthouse results, but report measured results rather than inventing scores.
- Verify all pages at 320px without clipped text, overlapping controls, or horizontal scrolling.

## Implementation sequence
1. **Discover:** inspect repo and identify all templates/components and design tokens.
2. **Audit:** write `DESIGN_AUDIT.md` with prioritized issues and screenshot references.
3. **Plan:** write a short `REFINEMENT_PLAN.md` mapping proposed changes to exact files. Highlight anything that needs client approval.
4. **Execute:** improve global styles first, then header/hero, content sections, shop/product templates, forms, and footer.
5. **Test:** run available build/lint/tests; verify links, forms, cart, responsive layout, and browser console. If environment lacks browser access, clearly mark visual QA as pending.
6. **Report:** write `REFINEMENT_REPORT.md` with changed files, before/after notes, confirmed tests, unresolved items, and approval requests.

## Definition of done
- Every section feels part of one premium, cohesive design system.
- Existing brand colors and logo remain unchanged.
- All breakpoints look intentional and polished.
- No overlapping elements, inconsistent gutters, awkward crops, truncated labels, broken CTAs, or accidental empty-state text.
- Product/cart/checkout behavior remains intact.
- Accessibility and performance are not regressed.
- Changes are documented and ready for client review.

## Start now
First inspect the existing project and the live reference, then create the audit and plan. Proceed with safe visual refinements in the current codebase. Ask before any irreversible change, major content rewrite, brand alteration, or commerce-logic modification. Do not stop at generic recommendations: implement and verify the improvements that are possible in the provided environment.
