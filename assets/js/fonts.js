/* ==========================================================================
   Brigitte Rose — Font config
   THE ONLY PLACE FONTS ARE DEFINED. To change a typeface:
   pick it on fonts.google.com, copy the URL out of the <link> it gives you,
   and paste it over the URL below. Nothing else needs editing — the family
   name is read out of the URL and pushed into CSS before the page paints.

   Each role accepts either:
     "https://fonts.googleapis.com/css2?family=..."  → Google font
     "Family Name"                                   → self-hosted (see @font-face in styles.css)
     { url: "...", family: "..." }                   → explicit, when a URL holds several families

   Size/leading tuning for paragraphs lives in styles.css (--fs-para, --lh-para),
   because a new face often needs a nudge: Garamonds run small, Inter runs large.
   ========================================================================== */
(function () {
  "use strict";

  /* Fallback stacks — used until the webfont lands, and if it never does. */
  var SERIF = '"Times New Roman", Times, Georgia, serif';
  var SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  /* ---------- EDIT HERE ---------- */
  var FONTS = {
    /* Headings (h1–h3, hero, section titles) */
    display: { font: "MADE Saonara", fallback: SERIF, cssVar: "--f-display" },

    /* Paragraphs and body copy */
    para: {
      font: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      fallback: SANS,
      cssVar: "--f-para"
    },

    /* Labels, buttons, eyebrows, h4 */
    label: {
      font: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500&display=swap",
      fallback: SERIF,
      cssVar: "--f-label"
    },

    /* Script accent: footer brand line */
    script: {
      font: "https://fonts.googleapis.com/css2?family=Parisienne&display=swap",
      fallback: 'Snell Roundhand, "Apple Chancery", cursive',
      cssVar: "--f-script"
    },

    /* UI chrome: nav, prices, badges, form controls */
    ui: {
      font: "https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap",
      fallback: SANS,
      cssVar: "--f-body"
    }
  };
  /* ---------- /EDIT HERE ---------- */

  var isUrl = function (s) { return /^https?:\/\//i.test(s); };

  /* "…?family=EB+Garamond:ital,wght@0,400&display=swap" → "EB Garamond"
     Handles css2 (family=Name:axes) and the older css API (family=Name:400,700).
     URLSearchParams already turns "+" into a space for us. */
  var familyFromUrl = function (url) {
    try {
      var names = new URL(url, location.href).searchParams.getAll("family");
      if (!names.length) return "";
      return names[0].split(":")[0].trim();
    } catch (e) {
      return "";
    }
  };

  /* Google serves invisible text during load unless display=swap is asked for.
     Add it when the pasted URL left it off. */
  var withSwap = function (url) {
    return /[?&]display=/.test(url) ? url : url + (url.indexOf("?") === -1 ? "?" : "&") + "display=swap";
  };

  var quote = function (family) {
    return /^[A-Za-z][A-Za-z0-9-]*$/.test(family) ? family : '"' + family.replace(/"/g, "") + '"';
  };

  var head = document.head || document.getElementsByTagName("head")[0];
  var root = document.documentElement;
  var seen = {};

  for (var role in FONTS) {
    if (!Object.prototype.hasOwnProperty.call(FONTS, role)) continue;

    var spec = FONTS[role];
    var raw = typeof spec.font === "string" ? { url: null, family: spec.font } : spec.font;
    if (typeof spec.font === "string" && isUrl(spec.font)) raw = { url: spec.font, family: "" };

    var url = raw.url || null;
    var family = raw.family || (url ? familyFromUrl(url) : "");

    if (!family) {
      /* Unparseable URL — leave the CSS fallback in styles.css alone rather than
         writing a broken value over it. */
      if (window.console) console.warn("[fonts] could not read a family name for role '" + role + "'; using the CSS default.");
      continue;
    }

    /* One <link> per distinct URL, injected synchronously so it blocks paint
       the same way a hand-written <link> would — no flash of fallback text. */
    if (url && !seen[url]) {
      seen[url] = true;
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = withSwap(url);
      head.appendChild(link);
    }

    root.style.setProperty(spec.cssVar, quote(family) + ", " + (spec.fallback || SERIF));
  }
})();
