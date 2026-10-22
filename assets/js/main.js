/* ==========================================================================
   Brigitte Rose — Shared UI: header, drawers, mini-cart, toasts, modals,
   product cards, wishlist buttons, newsletter, reveal animations, lightbox
   ========================================================================== */
(function () {
  var store = BR.store;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  BR.$ = $; BR.$$ = $$;
  BR.escape = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* ---------- Icons ---------- */
  BR.icons = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 6h13v10H1zM14 10h4l4 4v2h-8z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7a3 3 0 1 1 3-3c0 2-3 3-3 3zM12 7a3 3 0 1 0-3-3c0 2 3 3 3 3z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
  };

  /* ---------- Focus trap ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    var nodes = $$(FOCUSABLE, container).filter(function (n) { return n.offsetParent !== null; });
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Overlay / drawers ---------- */
  var overlay, openDrawer = null, lastFocus = null;
  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div"); overlay.className = "overlay"; overlay.setAttribute("aria-hidden", "true");
    overlay.addEventListener("click", closeDrawers);
    document.body.appendChild(overlay);
    return overlay;
  }
  function openDrawerEl(el) {
    ensureOverlay();
    if (openDrawer && openDrawer !== el) { openDrawer.classList.remove("is-open"); openDrawer.setAttribute("aria-hidden", "true"); }
    lastFocus = document.activeElement;
    openDrawer = el;
    el.classList.add("is-open"); el.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-open"); document.body.classList.add("no-scroll");
    setTimeout(function () { var f = $(FOCUSABLE, el); if (f) f.focus(); }, 60);
  }
  function closeDrawers() {
    if (!openDrawer) return;
    openDrawer.classList.remove("is-open"); openDrawer.setAttribute("aria-hidden", "true");
    overlay && overlay.classList.remove("is-open");
    if (!$(".modal.is-open") && !$(".lightbox.is-open")) document.body.classList.remove("no-scroll");
    var toFocus = lastFocus; openDrawer = null;
    if (toFocus && toFocus.focus) toFocus.focus();
  }
  BR.openDrawer = openDrawerEl; BR.closeDrawers = closeDrawers;

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeDrawers(); BR.closeModal(); BR.closeLightbox(); }
    if (e.key === "Tab" && openDrawer) trapFocus(openDrawer, e);
    var modal = $(".modal.is-open"); if (e.key === "Tab" && modal) trapFocus(modal, e);
  });

  /* ---------- Toasts ---------- */
  var toastStack;
  BR.toast = function (msg, opts) {
    opts = opts || {};
    if (!toastStack) { toastStack = document.createElement("div"); toastStack.className = "toast-stack"; toastStack.setAttribute("aria-live", "polite"); document.body.appendChild(toastStack); }
    var t = document.createElement("div");
    t.className = "toast toast--" + (opts.type || "success");
    t.innerHTML = (opts.type === "error" ? BR.icons.alert : BR.icons.check) + "<span>" + BR.escape(msg) + "</span>" + (opts.action ? '<a href="' + opts.action.href + '">' + BR.escape(opts.action.label) + "</a>" : "");
    if (opts.action && opts.action.onClick) { t.querySelector("a").addEventListener("click", function (e) { e.preventDefault(); opts.action.onClick(); }); }
    toastStack.appendChild(t);
    setTimeout(function () { t.classList.add("is-leaving"); setTimeout(function () { t.remove(); }, 320); }, opts.duration || 3600);
  };

  /* ---------- Modal ---------- */
  var modalEl;
  BR.openModal = function (html, opts) {
    opts = opts || {};
    if (!modalEl) {
      modalEl = document.createElement("div"); modalEl.className = "modal"; modalEl.setAttribute("role", "dialog"); modalEl.setAttribute("aria-modal", "true");
      modalEl.innerHTML = '<div class="modal__backdrop"></div><div class="modal__panel"><button class="icon-btn modal__close" type="button" aria-label="Close">' + BR.icons.close + '</button><div class="modal__content"></div></div>';
      modalEl.querySelector(".modal__backdrop").addEventListener("click", BR.closeModal);
      modalEl.querySelector(".modal__close").addEventListener("click", BR.closeModal);
      document.body.appendChild(modalEl);
    }
    lastFocus = document.activeElement;
    modalEl.querySelector(".modal__content").innerHTML = html;
    if (opts.label) modalEl.setAttribute("aria-label", opts.label);
    modalEl.classList.add("is-open"); document.body.classList.add("no-scroll");
    setTimeout(function () { var f = $(FOCUSABLE, modalEl.querySelector(".modal__content")) || modalEl.querySelector(".modal__close"); f.focus(); }, 60);
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
    lb = document.createElement("div"); lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Image viewer");
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
    // touch swipe
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
    img.src = lbItems[lbIndex].src; img.alt = lbItems[lbIndex].alt || "";
    lb.querySelector(".lightbox__count").textContent = (lbIndex + 1) + " / " + lbItems.length;
    var single = lbItems.length < 2;
    lb.querySelector(".lightbox__prev").style.display = single ? "none" : "";
    lb.querySelector(".lightbox__next").style.display = single ? "none" : "";
  }
  BR.openLightbox = function (items, index) {
    ensureLightbox(); lbItems = items; lastFocus = document.activeElement;
    lb.classList.add("is-open"); document.body.classList.add("no-scroll");
    lbShow(index || 0);
    setTimeout(function () { lb.querySelector(".lightbox__close").focus(); }, 60);
  };
  BR.closeLightbox = function () {
    if (!lb || !lb.classList.contains("is-open")) return;
    lb.classList.remove("is-open");
    if (!openDrawer && !$(".modal.is-open")) document.body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  // Any element with [data-lightbox-group] opens its group
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-lightbox-group]"); if (!el) return;
    e.preventDefault();
    var group = $$('[data-lightbox-group="' + el.getAttribute("data-lightbox-group") + '"]');
    var items = group.map(function (g) { return { src: g.getAttribute("data-full") || g.getAttribute("href") || (g.querySelector("img") || {}).src, alt: (g.querySelector("img") || {}).alt || "" }; });
    BR.openLightbox(items, group.indexOf(el));
  });

  /* ---------- Header: scroll shadow, counts, menu, mini-cart ---------- */
  function initHeader() {
    var header = $(".header"); if (!header) return;
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // Active nav
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav__link, .mobile-nav a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      var isProduct = page === "product.html" && href === "products.html";
      if (href === page || isProduct) a.setAttribute("aria-current", "page");
    });

    // Menu drawer
    var menuBtn = $("[data-open-menu]"), menu = $("#menu-drawer");
    if (menuBtn && menu) {
      menuBtn.addEventListener("click", function () { openDrawerEl(menu); });
      $$("[data-close-drawer]", menu).forEach(function (b) { b.addEventListener("click", closeDrawers); });
    }
    // Cart drawer
    var cartBtn = $("[data-open-cart]"), cart = $("#cart-drawer");
    if (cartBtn && cart) {
      cartBtn.addEventListener("click", function (e) { e.preventDefault(); renderMiniCart(); openDrawerEl(cart); });
      $$("[data-close-drawer]", cart).forEach(function (b) { b.addEventListener("click", closeDrawers); });
    }
    updateCounts();
    window.addEventListener("br:cart", function () { updateCounts(true); renderMiniCart(); });
    window.addEventListener("br:wishlist", function () { updateCounts(); });
  }
  function updateCounts(bump) {
    var c = store.cartCount(), w = store.getWishlist().length;
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = c; el.classList.toggle("is-visible", c > 0);
      if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    $$("[data-wish-count]").forEach(function (el) { el.textContent = w; el.classList.toggle("is-visible", w > 0); });
  }
  BR.updateCounts = updateCounts;

  /* ---------- Fly-to-bag animation ---------- */
  // Snapshots `imgEl` (or any element), arcs it into the header bag icon, bumps the icon, then calls `done`.
  BR.flyToBag = function (imgEl, done, srcOverride) {
    var target = $("[data-open-cart]");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!imgEl || !target || reduce || !("animate" in Element.prototype)) { if (done) done(); return; }
    var from = imgEl.getBoundingClientRect(), to = target.getBoundingClientRect();
    if (!from.width || !to.width) { if (done) done(); return; }
    // When launching from a non-image element (e.g. a button), start as a small card centred on it
    if (imgEl.tagName !== "IMG") { var cw = Math.min(72, from.width), ch = cw * 1.5; from = { left: from.left + from.width / 2 - cw / 2, top: from.top + from.height / 2 - ch / 2, width: cw, height: ch }; }
    var ghost = document.createElement("img");
    ghost.src = srcOverride || imgEl.currentSrc || imgEl.src; ghost.alt = ""; ghost.className = "fly-img";
    ghost.style.left = from.left + "px"; ghost.style.top = from.top + "px"; ghost.style.width = from.width + "px"; ghost.style.height = from.height + "px";
    document.body.appendChild(ghost);
    var endW = 28, endH = 28 * (from.height / from.width);
    var dx = (to.left + to.width / 2 - endW / 2) - from.left, dy = (to.top + to.height / 2 - endH / 2) - from.top;
    var sx = endW / from.width, sy = endH / from.height;
    // Arc: rise first, then drop into the bag
    var anim = ghost.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
      { transform: "translate(" + (dx * 0.5) + "px," + (dy * 0.5 - 120) + "px) scale(" + ((1 + sx) / 2) + "," + ((1 + sy) / 2) + ")", opacity: 1, offset: 0.55 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")", opacity: 0.4, offset: 1 }
    ], { duration: 820, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" });
    anim.onfinish = function () {
      ghost.remove();
      target.classList.remove("is-catching"); void target.offsetWidth; target.classList.add("is-catching");
      setTimeout(function () { target.classList.remove("is-catching"); }, 500);
      if (done) done();
    };
  };

  /* ---------- Shared pieces ---------- */
  BR.shipProgressHTML = function (t) {
    if (t.subtotal <= 0) return "";
    var pct = Math.min(100, Math.round(((BR.CONFIG.freeShippingThreshold - t.remainingForFree) / BR.CONFIG.freeShippingThreshold) * 100));
    var label = t.remainingForFree > 0
      ? "You’re <strong>" + store.money(t.remainingForFree) + "</strong> away from complimentary standard shipping."
      : "<strong>Complimentary standard shipping</strong> unlocked.";
    return '<div class="ship-progress"><div class="ship-progress__label">' + label + '</div><div class="ship-progress__bar"><div class="ship-progress__fill" style="width:' + pct + '%"></div></div></div>';
  };
  BR.qtyHTML = function (key, qty, size) {
    return '<div class="qty' + (size === "lg" ? " qty--lg" : "") + '" data-qty="' + BR.escape(key) + '">' +
      '<button type="button" data-qty-dec aria-label="Decrease quantity"' + (qty <= 1 ? "" : "") + '>' + BR.icons.minus + '</button>' +
      '<input type="number" inputmode="numeric" min="1" max="10" value="' + qty + '" aria-label="Quantity">' +
      '<button type="button" data-qty-inc aria-label="Increase quantity"' + (qty >= 10 ? " disabled" : "") + '>' + BR.icons.plus + '</button></div>';
  };

  function renderMiniCart() {
    var body = $("#cart-drawer .drawer__body"), foot = $("#cart-drawer .drawer__foot"); if (!body) return;
    var items = store.getCart();
    if (!items.length) {
      body.innerHTML = '<div class="mini-cart__empty">' + BR.icons.bag + '<p>Your bag is empty.</p><a class="btn btn--outline btn--sm" href="products.html">Shop the Collection</a></div>';
      foot.innerHTML = ""; return;
    }
    var t = store.totals();
    body.innerHTML = BR.shipProgressHTML(t) + items.map(function (l) {
      var p = BR.getProduct(l.id);
      return '<div class="cart-line" data-line="' + BR.escape(l.key) + '">' +
        '<a class="cart-line__img" href="product.html?p=' + p.id + '"><img src="' + BR.img(p.images[0], "sm") + '" alt="' + BR.escape(p.name) + '" width="84" height="126"></a>' +
        '<div><h3 class="cart-line__title"><a href="product.html?p=' + p.id + '">' + BR.escape(p.name) + '</a></h3>' +
        '<div class="cart-line__meta">Size ' + BR.escape(l.size) + ' · ' + store.money(p.price) + '</div>' +
        '<div class="cart-line__row">' + BR.qtyHTML(l.key, l.qty) + '<button type="button" class="cart-line__remove" data-remove="' + BR.escape(l.key) + '">' + BR.icons.trash + ' Remove</button></div></div>' +
        '<div class="cart-line__price">' + store.money(p.price * l.qty) + '</div></div>';
    }).join("");
    foot.innerHTML = '<div class="mini-cart__totals"><span>Subtotal</span><strong>' + store.money(t.subtotal) + '</strong></div>' +
      '<p class="mini-cart__note">Shipping and taxes calculated at checkout.</p>' +
      '<div class="mini-cart__actions"><a class="btn btn--block" href="checkout.html">Checkout</a><a class="btn btn--outline btn--block" href="cart.html">View Bag</a></div>';
  }
  BR.renderMiniCart = renderMiniCart;

  // Global quantity + remove delegation (works in drawer and cart page)
  document.addEventListener("click", function (e) {
    var dec = e.target.closest("[data-qty-dec]"), inc = e.target.closest("[data-qty-inc]"), rem = e.target.closest("[data-remove]");
    if (dec || inc) {
      var wrap = (dec || inc).closest("[data-qty]"); var input = wrap.querySelector("input");
      var v = parseInt(input.value, 10) || 1; v = dec ? v - 1 : v + 1;
      if (v < 1) { store.removeLine(wrap.getAttribute("data-qty")); return; }
      input.value = Math.min(10, v);
      store.updateQty(wrap.getAttribute("data-qty"), input.value);
    }
    if (rem) { store.removeLine(rem.getAttribute("data-remove")); BR.toast("Removed from your bag."); }
  });
  document.addEventListener("change", function (e) {
    var wrap = e.target.closest("[data-qty]"); if (!wrap || e.target.tagName !== "INPUT") return;
    var v = parseInt(e.target.value, 10); if (isNaN(v) || v < 1) v = 1; if (v > 10) v = 10; e.target.value = v;
    store.updateQty(wrap.getAttribute("data-qty"), v);
  });

  /* ---------- Stars ---------- */
  var starPath = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z';
  BR.starIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + starPath + '" fill="currentColor"/></svg>';
  BR.starsHTML = function (rating, cls) {
    rating = Math.max(0, Math.min(5, rating || 0)); var out = "";
    for (var i = 1; i <= 5; i++) {
      var fill = rating >= i ? 100 : rating > i - 1 ? Math.round((rating - (i - 1)) * 100) : 0;
      var gid = "sg" + i + "_" + fill + "_" + Math.floor(Math.random() * 1e6);
      out += '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="' + gid + '"><stop offset="' + fill + '%" stop-color="currentColor"/><stop offset="' + fill + '%" stop-color="transparent"/></linearGradient></defs><path d="' + starPath + '" fill="url(#' + gid + ')" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
    }
    return '<span class="stars ' + (cls || "") + '" role="img" aria-label="' + rating + ' out of 5 stars">' + out + '</span>';
  };

  /* ---------- Carousel ---------- */
  BR.carouselHTML = function (itemsHTML, label) {
    return '<button type="button" class="carousel__btn carousel__btn--prev" aria-label="Previous">' + BR.icons.chevronLeft + '</button>' +
      '<div class="carousel__track" role="region" aria-label="' + BR.escape(label || "Products") + '" tabindex="0">' + itemsHTML + '</div>' +
      '<button type="button" class="carousel__btn carousel__btn--next" aria-label="Next">' + BR.icons.chevronRight + '</button>';
  };
  BR.initCarousel = function (root) {
    var track = root.querySelector(".carousel__track"), prev = root.querySelector(".carousel__btn--prev"), next = root.querySelector(".carousel__btn--next");
    if (!track) return;
    function step() { var first = track.firstElementChild; return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24) : 300; }
    function update() { prev.disabled = track.scrollLeft <= 2; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2; }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); setTimeout(update, 50);
  };

  /* ---------- Product cards ---------- */
  BR.productCardHTML = function (p, opts) {
    opts = opts || {};
    var wished = store.inWishlist(p.id);
    var hover = p.images[1] ? '<img class="is-hover" src="' + BR.img(p.images[1], "sm") + '" alt="" loading="lazy" width="640" height="960">' : "";
    return '<article class="product-card" data-product="' + p.id + '">' +
      '<a class="product-card__media" href="product.html?p=' + p.id + '" aria-label="' + BR.escape(p.name) + '">' +
        '<img class="is-primary" src="' + BR.img(p.images[0], "sm") + '" alt="' + BR.escape(p.name) + '" loading="' + (opts.eager ? "eager" : "lazy") + '" width="640" height="960">' + hover +
        '<span class="product-card__badges">' + ((p.badges || []).map(function (b) { return '<span class="product-card__badge product-card__badge--red">' + BR.escape(b) + '</span>'; }).join("")) + (p.badge ? '<span class="product-card__badge">' + BR.escape(p.badge) + '</span>' : "") + '</span>' +
      '</a>' +
      '<button type="button" class="icon-btn product-card__wish' + (wished ? " is-active" : "") + '" data-wish="' + p.id + '" aria-pressed="' + wished + '" aria-label="' + (wished ? "Remove from" : "Add to") + ' wishlist">' + BR.icons.heart + '</button>' +
      '<div class="product-card__quick"><div class="quick-add"><div class="quick-add__label">Quick add · Select size</div><div class="quick-add__sizes">' +
        BR.CONFIG.sizes.map(function (s) { return '<button type="button" data-quick-add="' + p.id + '" data-size="' + s + '" aria-label="Add ' + BR.escape(p.name) + ' size ' + s + ' to bag">' + s + '</button>'; }).join("") +
      '</div></div></div>' +
      '<div class="product-card__body"><h3 class="product-card__title"><a href="product.html?p=' + p.id + '">' + BR.escape(p.name) + '</a></h3>' +
      '<div class="product-card__sub">' + BR.escape(p.fabric) + '</div>' +
      (function () { var st = store.reviewStats(p.id); return st.count ? '<div class="product-card__rating">' + BR.starsHTML(st.average, "stars--sm") + '<span>(' + st.count + ')</span></div>' : ""; })() +
      '<div class="product-card__price">' + store.money(p.price) + '</div>' +
      '<div class="product-card__swatches" aria-hidden="true">' + BR.PRODUCTS.map(function (x) { return '<span style="background:' + (x.swatch || "#ccc") + '" title="' + BR.escape(x.color || x.name) + '"' + (x.id === p.id ? ' class="is-active"' : "") + '></span>'; }).join("") + '</div></div></article>';
  };

  document.addEventListener("click", function (e) {
    var qa = e.target.closest("[data-quick-add]");
    if (qa) {
      var p = BR.getProduct(qa.getAttribute("data-quick-add")); var size = qa.getAttribute("data-size");
      var card = qa.closest(".product-card"); var img = card ? card.querySelector(".product-card__media img.is-primary") : null;
      qa.disabled = true;
      BR.flyToBag(img, function () {
        store.addToCart(p.id, size, 1); qa.disabled = false;
        renderMiniCart(); openDrawerEl($("#cart-drawer"));
        BR.toast(p.name + " (" + size + ") added to your bag.");
      });
    }
    var w = e.target.closest("[data-wish]");
    if (w) {
      var id = w.getAttribute("data-wish"); var added = store.toggleWishlist(id); var prod = BR.getProduct(id);
      $$('[data-wish="' + id + '"]').forEach(function (b) { b.classList.toggle("is-active", added); b.setAttribute("aria-pressed", added); b.setAttribute("aria-label", (added ? "Remove from" : "Add to") + " wishlist"); });
      BR.toast(added ? prod.name + " saved to your wishlist." : prod.name + " removed from your wishlist.", added ? { action: { label: "View", href: "wishlist.html" } } : {});
    }
  });

  /* ---------- Newsletter + generic validation ---------- */
  BR.isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); };
  BR.setFieldError = function (input, msg) {
    var field = input.closest(".field"); if (!field) return;
    var err = field.querySelector(".field__error");
    field.classList.toggle("is-invalid", !!msg);
    if (err) err.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  };
  BR.showFormMsg = function (form, type, text) {
    var box = form.querySelector(".form-msg"); if (!box) return;
    box.className = "form-msg form-msg--" + type + " is-visible";
    box.innerHTML = (type === "success" ? BR.icons.check : BR.icons.alert) + "<span>" + text + "</span>";
  };
  function initNewsletter() {
    $$("form[data-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]'); var btn = form.querySelector('button[type="submit"]');
        if (!BR.isEmail(input.value)) { BR.setFieldError(input, "Please enter a valid email address."); input.focus(); return; }
        BR.setFieldError(input, "");
        btn.classList.add("is-loading");
        setTimeout(function () {
          btn.classList.remove("is-loading");
          var r = store.subscribe(input.value);
          BR.showFormMsg(form, "success", r.already ? "You’re already on the list — thank you." : "Welcome to Brigitte Rose. You’re on the list.");
          form.reset();
        }, 700);
      });
      var inp = form.querySelector('input[type="email"]'); if (inp) inp.addEventListener("input", function () { BR.setFieldError(inp, ""); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $$(".reveal, .reveal-stagger"); if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden (print, odd viewports, observer not firing)
    window.addEventListener("beforeprint", function () { els.forEach(function (el) { el.classList.add("is-visible"); }); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add("is-visible"); }); }, 4000);
  }

  /* ---------- Accordion ---------- */
  function initAccordions() {
    $$(".accordion__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-open", !open);
      });
    });
  }
  BR.initAccordions = initAccordions;

  /* ---------- Footer year ---------- */
  function initMisc() {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$("[data-contact-email]").forEach(function (el) { el.textContent = BR.CONFIG.contact.email; el.href = "mailto:" + BR.CONFIG.contact.email; });
    $$("[data-contact-phone]").forEach(function (el) { el.textContent = BR.CONFIG.contact.phone; el.href = "tel:" + BR.CONFIG.contact.phoneHref; });
    $$("[data-instagram]").forEach(function (el) { el.href = BR.CONFIG.contact.instagram; });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader(); initNewsletter(); initReveal(); initAccordions(); initMisc();
    if (typeof BR.onReady === "function") BR.onReady();
  });
})();
