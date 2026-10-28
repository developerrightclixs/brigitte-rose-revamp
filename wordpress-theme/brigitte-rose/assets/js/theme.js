/* ==========================================================================
   Brigitte Rose - theme UI
   Drawers, toasts, modal, lightbox, accordions, reveal-on-scroll, carousels,
   quantity steppers, the wishlist (localStorage), the gallery "load more",
   the product gallery and the sticky add-to-bag bar.

   WooCommerce-specific behaviour lives in woo.js.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.BR_DATA || {};
  var T = D.i18n || {};

  var BR = window.BR = window.BR || {};

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  BR.$ = $; BR.$$ = $$; BR.data = D; BR.i18n = T;

  BR.escape = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ---------- Icons (the few the scripts inject) ---------- */
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  BR.icons = {
    close: '<svg ' + S + ' stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    check: '<svg ' + S + ' stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
    alert: '<svg ' + S + ' stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>',
    chevronRight: '<svg ' + S + ' stroke-width="1.5"><path d="m9 6 6 6-6 6"/></svg>',
    chevronLeft: '<svg ' + S + ' stroke-width="1.5"><path d="m15 6-6 6 6 6"/></svg>',
    search: '<svg ' + S + ' stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    heart: '<svg ' + S + ' stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>'
  };

  /* ---------- Focus management ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, e) {
    var nodes = $$(FOCUSABLE, container).filter(function (n) { return n.offsetParent !== null; });
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Drawers ---------- */
  var overlay, openDrawer = null, lastFocus = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.addEventListener("click", closeDrawers);
    document.body.appendChild(overlay);
    return overlay;
  }

  function openDrawerEl(el) {
    if (!el) return;
    ensureOverlay();
    if (openDrawer && openDrawer !== el) {
      openDrawer.classList.remove("is-open");
      openDrawer.setAttribute("aria-hidden", "true");
    }
    lastFocus = document.activeElement;
    openDrawer = el;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
    setTimeout(function () { var f = $(FOCUSABLE, el); if (f) f.focus(); }, 60);
  }

  function closeDrawers() {
    if (!openDrawer) return;
    openDrawer.classList.remove("is-open");
    openDrawer.setAttribute("aria-hidden", "true");
    if (overlay) overlay.classList.remove("is-open");
    if (!$(".modal.is-open") && !$(".lightbox.is-open")) document.body.classList.remove("no-scroll");
    var toFocus = lastFocus;
    openDrawer = null;
    if (toFocus && toFocus.focus) toFocus.focus();
  }

  BR.openDrawer = openDrawerEl;
  BR.closeDrawers = closeDrawers;
  BR.openCart = function () { openDrawerEl($("#cart-drawer")); };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeDrawers(); BR.closeModal(); BR.closeLightbox(); }
    if (e.key === "Tab" && openDrawer) trapFocus(openDrawer, e);
    var modal = $(".modal.is-open");
    if (e.key === "Tab" && modal) trapFocus(modal, e);
  });

  /* ---------- Toasts ---------- */
  var toastStack;
  BR.toast = function (msg, opts) {
    opts = opts || {};
    if (!toastStack) {
      toastStack = document.createElement("div");
      toastStack.className = "toast-stack";
      toastStack.setAttribute("aria-live", "polite");
      document.body.appendChild(toastStack);
    }
    var t = document.createElement("div");
    t.className = "toast toast--" + (opts.type || "success");
    t.innerHTML = (opts.type === "error" ? BR.icons.alert : BR.icons.check) +
      "<span>" + BR.escape(msg) + "</span>" +
      (opts.action ? '<a href="' + BR.escape(opts.action.href) + '">' + BR.escape(opts.action.label) + "</a>" : "");
    toastStack.appendChild(t);
    setTimeout(function () {
      t.classList.add("is-leaving");
      setTimeout(function () { t.remove(); }, 320);
    }, opts.duration || 3600);
  };

  /* ---------- Modal ---------- */
  var modalEl;
  BR.openModal = function (html, opts) {
    opts = opts || {};
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.className = "modal";
      modalEl.setAttribute("role", "dialog");
      modalEl.setAttribute("aria-modal", "true");
      modalEl.innerHTML = '<div class="modal__backdrop"></div><div class="modal__panel">' +
        '<button class="icon-btn modal__close" type="button" aria-label="Close">' + BR.icons.close + '</button>' +
        '<div class="modal__content"></div></div>';
      modalEl.querySelector(".modal__backdrop").addEventListener("click", BR.closeModal);
      modalEl.querySelector(".modal__close").addEventListener("click", BR.closeModal);
      document.body.appendChild(modalEl);
    }
    lastFocus = document.activeElement;
    modalEl.querySelector(".modal__content").innerHTML = html;
    if (opts.label) modalEl.setAttribute("aria-label", opts.label);
    modalEl.classList.add("is-open");
    document.body.classList.add("no-scroll");
    setTimeout(function () {
      var f = $(FOCUSABLE, modalEl.querySelector(".modal__content")) || modalEl.querySelector(".modal__close");
      if (f) f.focus();
    }, 60);
    return modalEl;
  };

  BR.closeModal = function () {
    if (!modalEl || !modalEl.classList.contains("is-open")) return;
    modalEl.classList.remove("is-open");
    if (!openDrawer && !$(".lightbox.is-open")) document.body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  /* ---------- Lightbox ---------- */
  var lb, lbItems = [], lbIndex = 0;

  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = '<img class="lightbox__img" alt="">' +
      '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close">' + BR.icons.close + '</button>' +
      '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous image">' + BR.icons.chevronLeft + '</button>' +
      '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next image">' + BR.icons.chevronRight + '</button>' +
      '<div class="lightbox__count" aria-live="polite"></div>';
    lb.querySelector(".lightbox__close").addEventListener("click", BR.closeLightbox);
    lb.querySelector(".lightbox__prev").addEventListener("click", function () { lbShow(lbIndex - 1); });
    lb.querySelector(".lightbox__next").addEventListener("click", function () { lbShow(lbIndex + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) BR.closeLightbox(); });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "ArrowRight") lbShow(lbIndex + 1);
      if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      if (e.key === "Tab") trapFocus(lb, e);
    });

    var sx = 0, sy = 0;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.body.appendChild(lb);
    return lb;
  }

  function lbShow(i) {
    if (!lbItems.length) return;
    lbIndex = (i + lbItems.length) % lbItems.length;
    var img = lb.querySelector(".lightbox__img");
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    img.src = lbItems[lbIndex].src;
    img.alt = lbItems[lbIndex].alt || "";
    lb.querySelector(".lightbox__count").textContent = (lbIndex + 1) + " / " + lbItems.length;
    var single = lbItems.length < 2;
    lb.querySelector(".lightbox__prev").style.display = single ? "none" : "";
    lb.querySelector(".lightbox__next").style.display = single ? "none" : "";
  }

  BR.openLightbox = function (items, index) {
    if (!items || !items.length) return;
    ensureLightbox();
    lbItems = items;
    lastFocus = document.activeElement;
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lbShow(index || 0);
    setTimeout(function () { lb.querySelector(".lightbox__close").focus(); }, 60);
  };

  BR.closeLightbox = function () {
    if (!lb || !lb.classList.contains("is-open")) return;
    lb.classList.remove("is-open");
    if (!openDrawer && !$(".modal.is-open")) document.body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  // Any element with [data-lightbox-group] opens its whole group.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-lightbox-group]");
    if (!el) return;
    e.preventDefault();
    var group = $$('[data-lightbox-group="' + el.getAttribute("data-lightbox-group") + '"]')
      .filter(function (g) { return !g.hasAttribute("hidden"); });
    var items = group.map(function (g) {
      var img = g.querySelector("img");
      return {
        src: g.getAttribute("data-full") || g.getAttribute("href") || (img ? img.src : ""),
        alt: img ? img.alt : ""
      };
    });
    BR.openLightbox(items, group.indexOf(el));
  });

  /* ---------- Header ---------- */
  function initHeader() {
    var header = $(".header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    var pairs = [
      ["[data-open-menu]", "#menu-drawer"],
      ["[data-open-cart]", "#cart-drawer"],
      ["[data-open-search]", "#search-drawer"]
    ];

    pairs.forEach(function (pair) {
      var drawer = $(pair[1]);
      if (!drawer) return;
      $$(pair[0]).forEach(function (btn) {
        btn.addEventListener("click", function (e) { e.preventDefault(); openDrawerEl(drawer); });
      });
      $$("[data-close-drawer]", drawer).forEach(function (btn) {
        btn.addEventListener("click", closeDrawers);
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal(root) {
    var els = $$(".reveal:not(.is-visible), .reveal-stagger:not(.is-visible)", root || document);
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    els.forEach(function (el) { io.observe(el); });

    // Safety net: never leave content hidden.
    window.addEventListener("beforeprint", function () {
      els.forEach(function (el) { el.classList.add("is-visible"); });
    });
    setTimeout(function () { els.forEach(function (el) { el.classList.add("is-visible"); }); }, 4000);
  }
  BR.initReveal = initReveal;

  /* ---------- Accordions ---------- */
  function initAccordions(root) {
    $$(".accordion__btn", root || document).forEach(function (btn) {
      if (btn.dataset.brBound) return;
      btn.dataset.brBound = "1";
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-open", !open);
      });
    });
  }
  BR.initAccordions = initAccordions;

  /* ---------- Carousels ---------- */
  function initCarousels(root) {
    $$(".carousel", root || document).forEach(function (el) {
      if (el.dataset.brBound) return;
      el.dataset.brBound = "1";

      var track = el.querySelector(".carousel__track");
      var prev = el.querySelector(".carousel__btn--prev");
      var next = el.querySelector(".carousel__btn--next");
      if (!track || !prev || !next) return;

      function step() {
        var first = track.firstElementChild;
        var gap = parseFloat(getComputedStyle(track).columnGap || 24) || 24;
        return first ? first.getBoundingClientRect().width + gap : 300;
      }
      function update() {
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      }
      prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
      next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      setTimeout(update, 50);
    });
  }
  BR.initCarousels = initCarousels;

  /* ---------- Quantity steppers ---------- */
  // Local clamping only. woo.js listens for br:qty to push the change to the cart.
  document.addEventListener("click", function (e) {
    var dec = e.target.closest("[data-qty-dec]");
    var inc = e.target.closest("[data-qty-inc]");
    if (!dec && !inc) return;

    var wrap = (dec || inc).closest("[data-qty], .quantity");
    if (!wrap) return;
    var input = wrap.querySelector('input[type="number"], input.qty');
    if (!input) return;

    var min = parseInt(input.getAttribute("min"), 10);
    var max = parseInt(input.getAttribute("max"), 10);
    if (isNaN(min)) min = 1;

    var value = (parseInt(input.value, 10) || 0) + (dec ? -1 : 1);
    if (!isNaN(max) && max > 0) value = Math.min(max, value);
    value = Math.max(min, value);

    if (String(value) === String(input.value)) return;
    input.value = value;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    var key = wrap.getAttribute("data-qty");
    if (key) {
      document.dispatchEvent(new CustomEvent("br:qty", { detail: { key: key, qty: value } }));
    }
  });

  /* ---------- Wishlist (per browser) ---------- */
  var WISH_KEY = "br_wishlist_v1";

  function readWishlist() {
    try {
      var raw = window.localStorage.getItem(WISH_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.map(String) : [];
    } catch (err) {
      return [];
    }
  }

  function writeWishlist(list) {
    try { window.localStorage.setItem(WISH_KEY, JSON.stringify(list)); } catch (err) { /* private mode */ }
  }

  BR.wishlist = {
    all: readWishlist,
    has: function (id) { return readWishlist().indexOf(String(id)) !== -1; },
    toggle: function (id) {
      id = String(id);
      var list = readWishlist();
      var at = list.indexOf(id);
      if (at === -1) { list.push(id); } else { list.splice(at, 1); }
      writeWishlist(list);
      paintWishlist();
      return at === -1;
    }
  };

  function paintWishlist() {
    var list = readWishlist();

    $$("[data-wish-count]").forEach(function (el) {
      el.textContent = list.length;
      el.classList.toggle("is-visible", list.length > 0);
    });

    $$("[data-wish]").forEach(function (btn) {
      var on = list.indexOf(String(btn.getAttribute("data-wish"))) !== -1;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", String(on));
    });

    // Wishlist page: show only the saved cards.
    var root = $("[data-wishlist-root]");
    if (!root) return;

    var shown = 0;
    $$("[data-wish-id]", root).forEach(function (slot) {
      var on = list.indexOf(String(slot.getAttribute("data-wish-id"))) !== -1;
      slot.hidden = !on;
      if (on) shown++;
    });

    var empty = $("[data-wishlist-empty]", root);
    var grid = $("[data-wishlist-grid]", root);
    var count = $("[data-wishlist-count]", root);

    if (empty) empty.hidden = shown > 0;
    if (grid) grid.hidden = shown === 0;
    if (count) {
      count.textContent = shown ? shown + " " + (shown === 1 ? (T.savedSet || "saved set") : (T.savedSets || "saved sets")) : "";
      count.hidden = shown === 0;
    }
  }
  BR.paintWishlist = paintWishlist;

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-wish]");
    if (!btn) return;
    e.preventDefault();

    var id = btn.getAttribute("data-wish");
    var name = btn.getAttribute("data-wish-name") || "";
    var added = BR.wishlist.toggle(id);

    BR.toast(
      (name ? name + " " : "") + (added ? (T.saved || "saved to your wishlist.") : (T.unsaved || "removed from your wishlist.")),
      added && D.wishlistUrl ? { action: { label: T.view || "View", href: D.wishlistUrl } } : {}
    );
  });

  /* ---------- Newsletter ---------- */
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); }
  BR.isEmail = isEmail;

  BR.setFieldError = function (input, msg) {
    var field = input.closest(".field");
    if (!field) return;
    var err = field.querySelector(".field__error");
    field.classList.toggle("is-invalid", !!msg);
    if (err) err.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  BR.showFormMsg = function (form, type, text) {
    var box = form.querySelector(".form-msg");
    if (!box) return;
    box.className = "form-msg form-msg--" + type + " is-visible";
    box.innerHTML = (type === "success" ? BR.icons.check : BR.icons.alert) + "<span>" + BR.escape(text) + "</span>";
  };

  function post(action, fields) {
    var body = new URLSearchParams();
    body.set("action", action);
    body.set("nonce", D.nonce || "");
    Object.keys(fields).forEach(function (k) { body.set(k, fields[k]); });

    return fetch(D.ajaxUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: body.toString()
    }).then(function (r) { return r.json(); });
  }
  BR.post = post;

  function initNewsletter() {
    $$("form[data-newsletter]").forEach(function (form) {
      if (form.dataset.brBound) return;
      form.dataset.brBound = "1";

      var input = form.querySelector('input[type="email"]');
      var btn = form.querySelector('button[type="submit"]');
      if (input) input.addEventListener("input", function () { BR.setFieldError(input, ""); });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!input) return;

        if (!isEmail(input.value)) {
          BR.setFieldError(input, T.badEmail || "Please enter a valid email address.");
          input.focus();
          return;
        }
        BR.setFieldError(input, "");
        if (btn) btn.classList.add("is-loading");

        post("br_subscribe", { email: input.value, source: location.pathname })
          .then(function (res) {
            if (btn) btn.classList.remove("is-loading");
            if (res && res.success) {
              BR.showFormMsg(form, "success", res.data.message);
              form.reset();
            } else {
              BR.showFormMsg(form, "error", (res && res.data && res.data.message) || T.genericError);
            }
          })
          .catch(function () {
            if (btn) btn.classList.remove("is-loading");
            BR.showFormMsg(form, "error", T.genericError || "Something went wrong.");
          });
      });
    });
  }

  /* ---------- Contact form ---------- */
  function initContactForms() {
    $$("form[data-contact-form]").forEach(function (form) {
      if (form.dataset.brBound) return;
      form.dataset.brBound = "1";

      form.addEventListener("input", function (e) {
        if (e.target.closest(".field")) BR.setFieldError(e.target, "");
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var get = function (name) { return form.querySelector('[name="' + name + '"]'); };
        var ok = true;

        var name = get("name"), email = get("email"), message = get("message"), consent = get("consent");

        if (name && name.value.trim().length < 2) { BR.setFieldError(name, "Please add your name."); ok = false; }
        if (email && !isEmail(email.value)) { BR.setFieldError(email, T.badEmail); ok = false; }
        if (message && message.value.trim().length < 10) { BR.setFieldError(message, "Please write at least 10 characters."); ok = false; }
        if (consent && !consent.checked) { BR.setFieldError(consent, "Please tick the box to continue."); ok = false; }
        if (!ok) return;

        var btn = form.querySelector('button[type="submit"]');
        if (btn) btn.classList.add("is-loading");

        var fields = {};
        ["name", "email", "subject", "message", "company", "recipient", "page"].forEach(function (key) {
          var el = get(key);
          if (el) fields[key] = el.value;
        });

        post("br_contact", fields)
          .then(function (res) {
            if (btn) btn.classList.remove("is-loading");
            if (res && res.success) {
              BR.showFormMsg(form, "success", res.data.message);
              form.reset();
              return;
            }
            if (res && res.data && res.data.fields) {
              Object.keys(res.data.fields).forEach(function (key) {
                var el = get(key);
                if (el) BR.setFieldError(el, res.data.fields[key]);
              });
              return;
            }
            BR.showFormMsg(form, "error", (res && res.data && res.data.message) || T.genericError);
          })
          .catch(function () {
            if (btn) btn.classList.remove("is-loading");
            BR.showFormMsg(form, "error", T.genericError || "Something went wrong.");
          });
      });
    });
  }

  /* ---------- Gallery "Load more" ---------- */
  function initGalleryMore() {
    $$("[data-gallery-more]").forEach(function (btn) {
      if (btn.dataset.brBound) return;
      btn.dataset.brBound = "1";

      var wrap = btn.closest("section") || document;
      var grid = $(".masonry, .gallery-strip", wrap);
      var countEl = $("[data-gallery-count]", wrap);
      if (!grid) return;

      var items = $$(".gallery-item", grid);
      var page = parseInt(btn.getAttribute("data-gallery-more"), 10) || 12;

      function update() {
        var shown = items.filter(function (el) { return !el.hasAttribute("hidden"); }).length;
        if (countEl) countEl.textContent = "Showing " + shown + " of " + items.length;
        btn.hidden = shown >= items.length;
      }

      btn.addEventListener("click", function () {
        var hidden = items.filter(function (el) { return el.hasAttribute("hidden"); }).slice(0, page);
        hidden.forEach(function (el) {
          el.removeAttribute("hidden");
          el.classList.add("reveal");
          requestAnimationFrame(function () { el.classList.add("is-visible"); });
        });
        update();
      });

      update();
    });
  }

  /* ---------- Size guide modal ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-size-guide]");
    if (!btn) return;
    e.preventDefault();

    var payload;
    try { payload = JSON.parse(btn.getAttribute("data-size-guide")); } catch (err) { return; }
    if (!payload || !payload.rows || !payload.rows.length) return;

    var rows = payload.rows.map(function (r) {
      return "<tr><td>" + BR.escape(r.size) + "</td><td>" + BR.escape(r.us) + "</td><td>" +
        BR.escape(r.bust) + "</td><td>" + BR.escape(r.waist) + "</td><td>" + BR.escape(r.hips) + "</td></tr>";
    }).join("");

    BR.openModal(
      '<h2 class="modal__title">' + BR.escape(T.sizeGuide || "Size Guide") + "</h2>" +
      '<table class="size-table"><thead><tr><th>Size</th><th>US</th><th>Bust</th><th>Waist</th><th>Hips</th></tr></thead><tbody>' +
      rows + "</tbody></table>" +
      (payload.note ? '<p style="font-size:var(--fs-xs);color:var(--c-muted)">' + BR.escape(payload.note) + "</p>" : ""),
      { label: T.sizeGuide || "Size guide" }
    );
  });

  /* ---------- Delivery tabs ---------- */
  function initDeliveryTabs() {
    var tabs = $$(".delivery__opt");
    tabs.forEach(function (tab) {
      if (tab.dataset.brBound) return;
      tab.dataset.brBound = "1";
      tab.addEventListener("click", function () {
        tabs.forEach(function (other) {
          var on = other === tab;
          other.classList.toggle("is-active", on);
          other.setAttribute("aria-selected", String(on));
        });
      });
    });
  }

  /* ---------- Product gallery ---------- */
  function initProductGallery() {
    var stage = $("[data-pdp-gallery]");
    if (!stage) return;

    var images;
    try { images = JSON.parse(stage.getAttribute("data-pdp-gallery")); } catch (err) { return; }
    if (!images || !images.length) return;

    var wrap = $("#pdp-main", stage);
    var img = $("#pdp-main-img", stage);
    var counter = $("#pdp-counter", stage);
    if (!wrap || !img) return;

    var current = 0;

    function show(i) {
      current = (i + images.length) % images.length;
      img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
      img.src = images[current];
      if (counter) counter.textContent = (current + 1) + " / " + images.length;

      $$("[data-thumb]").forEach(function (b) {
        var on = parseInt(b.getAttribute("data-thumb"), 10) === current;
        b.classList.toggle("is-active", on);
        if (b.hasAttribute("aria-selected")) b.setAttribute("aria-selected", String(on));
      });

      var thumb = $('.pdp2__thumb[data-thumb="' + current + '"]');
      if (thumb && thumb.scrollIntoView) {
        thumb.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      }
    }
    BR.pdpShow = show;

    $$("[data-thumb]").forEach(function (b) {
      b.addEventListener("click", function () { show(parseInt(b.getAttribute("data-thumb"), 10)); });
    });
    $$("[data-nav]", stage).forEach(function (b) {
      b.addEventListener("click", function () { show(current + parseInt(b.getAttribute("data-nav"), 10)); });
    });

    // Hover zoom on pointer devices.
    if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) {
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        img.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        img.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
        wrap.classList.add("is-zooming");
      });
      wrap.addEventListener("mouseleave", function () { wrap.classList.remove("is-zooming"); });
    }

    wrap.addEventListener("click", function () {
      BR.openLightbox(images.map(function (src, i) {
        return { src: src, alt: img.alt + " - " + (i + 1) };
      }), current);
    });

    var sx = 0, sy = 0;
    wrap.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    wrap.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("keydown", function (e) {
      if ($(".lightbox.is-open, .modal.is-open, .drawer.is-open")) return;
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }

  /* ---------- Share ---------- */
  function initShare() {
    var btn = $("#share-copy");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var done = function () { BR.toast(T.copied || "Link copied to clipboard."); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href).then(done, done);
      } else {
        done();
      }
    });
  }

  /* ---------- Sticky add-to-bag bar ---------- */
  function initStickyBar() {
    var bar = $("#sticky-bar");
    var form = $("form.cart");
    if (!bar || !form) return;

    var button = form.querySelector('button[type="submit"], .single_add_to_cart_button');
    if (!button) return;

    bar.innerHTML = '<div class="sticky-bar__inner">' +
      (bar.dataset.img ? '<img class="sticky-bar__img" src="' + BR.escape(bar.dataset.img) + '" alt="" width="44" height="66">' : "") +
      '<div class="sticky-bar__meta">' +
        '<div class="sticky-bar__name">' + BR.escape(bar.dataset.name || "") + "</div>" +
        '<div class="sticky-bar__price">' + BR.escape(bar.dataset.price || "") + "</div>" +
      "</div>" +
      '<button type="button" class="btn btn--black" data-sticky-add>' + BR.escape(T.addToBag || "Add to Bag") + "</button>" +
      "</div>";

    $("[data-sticky-add]", bar).addEventListener("click", function () {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      // Let the real button do the work, so validation and gateways behave.
      setTimeout(function () { button.click(); }, 320);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var past = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
        bar.classList.toggle("is-visible", past);
        bar.setAttribute("aria-hidden", String(!past));
      }, { threshold: 0 }).observe(button);
    }
  }

  /* ---------- Boot ---------- */
  function boot(root) {
    initReveal(root);
    initAccordions(root);
    initCarousels(root);
    initNewsletter();
    initContactForms();
    initGalleryMore();
    initDeliveryTabs();
    paintWishlist();
  }
  BR.boot = boot;

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    boot();
    initProductGallery();
    initShare();
    initStickyBar();
  });

  // Elementor renders widgets into the editing canvas after load.
  window.addEventListener("elementor/frontend/init", function () {
    if (!window.elementorFrontend || !window.elementorFrontend.hooks) return;
    window.elementorFrontend.hooks.addAction("frontend/element_ready/global", function ($scope) {
      boot($scope && $scope[0] ? $scope[0] : undefined);
    });
  });
})();
