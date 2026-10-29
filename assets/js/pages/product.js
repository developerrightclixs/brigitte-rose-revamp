/* Product detail page — Victoria's Secret-style layout */
BR.onReady = function () {
  var store = BR.store, $ = BR.$, $$ = BR.$$, esc = BR.escape, I = BR.icons;
  var id = new URLSearchParams(location.search).get("p") || "";
  var p = BR.getProduct(id);
  var root = $("#pdp-root");

  if (!p) {
    root.innerHTML = '<div class="empty-state">' + I.search + '<h1 style="font-size:1.8rem">We couldn’t find that set.</h1><p>It may have moved. Explore the full collection instead.</p><a class="btn" href="products.html">Shop the Collection</a></div>';
    ["related-section", "reviews", "recent-section", "sticky-bar"].forEach(function (s) { var el = document.getElementById(s); if (el) el.hidden = true; });
    document.title = "Set not found – Brigitte Rose";
    return;
  }

  document.title = p.name + " – Brigitte Rose";
  var meta = document.querySelector('meta[name="description"]'); if (meta) meta.setAttribute("content", p.description);
  $("#crumb-product").textContent = p.name;
  store.trackView(p.id);

  var current = 0, sizeSel = null, qty = 1;
  var wished = store.inWishlist(p.id);
  var cfg = BR.CONFIG;

  function ratingLine() {
    var st = store.reviewStats(p.id);
    if (!st.count) return '<a class="pdp2__rating" href="#reviews">' + BR.starsHTML(0) + '<span class="muted">Be the first to review</span></a>';
    return '<a class="pdp2__rating" href="#reviews">' + BR.starsHTML(st.average) + '<strong>' + st.average.toFixed(1) + '</strong><span class="muted">(' + st.count + (st.count === 1 ? " review" : " reviews") + ')</span></a>';
  }
  function fitScale() {
    var st = store.reviewStats(p.id);
    if (!st.fit) return "";
    var pct = ((st.fit - 1) / 4) * 100;
    var label = st.fit < 2.5 ? "Runs small" : st.fit > 3.5 ? "Runs large" : "True to size";
    return '<div class="fit-scale"><div class="fit-scale__title">Overall fit: <strong>' + label + '</strong> <span class="muted">· based on ' + st.count + ' review' + (st.count === 1 ? "" : "s") + '</span></div><div class="fit-scale__track"><span class="fit-scale__pin" style="left:' + pct + '%"></span></div><div class="fit-scale__labels"><span>Runs small</span><span>True to size</span><span>Runs large</span></div></div>';
  }
  var installments = cfg.installments && cfg.installments.enabled
    ? '<div class="pdp2__pay">' + I.sparkle + '<span>' + cfg.installments.count + ' interest-free payments of <strong>' + store.money(p.price / cfg.installments.count) + '</strong> with ' + esc(cfg.installments.provider) + '</span></div>' : "";

  root.innerHTML =
    '<div class="pdp2">' +
      '<div class="pdp2__media">' +
        '<div class="pdp2__thumbs" role="tablist" aria-label="Product images">' +
          p.images.map(function (im, i) { return '<button type="button" class="pdp2__thumb' + (i === 0 ? " is-active" : "") + '" role="tab" aria-selected="' + (i === 0) + '" data-thumb="' + i + '" aria-label="View image ' + (i + 1) + '"><img src="' + BR.img(im, "sm") + '" alt="" width="76" height="114" loading="' + (i < 5 ? "eager" : "lazy") + '"></button>'; }).join("") +
        '</div>' +
        '<div class="pdp2__stage">' +
          '<div class="pdp2__badges">' + (p.badges || []).map(function (b) { return '<span class="badge badge--red">' + esc(b) + '</span>'; }).join("") + (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : "") + '</div>' +
          '<div class="pdp2__main" id="pdp-main"><img id="pdp-main-img" src="' + BR.img(p.images[0]) + '" alt="' + esc(p.name) + '" width="1024" height="1536" fetchpriority="high"></div>' +
          (p.images.length > 1 ? '<button type="button" class="pdp2__nav pdp2__nav--prev" data-nav="-1" aria-label="Previous image">' + I.chevronLeft + '</button><button type="button" class="pdp2__nav pdp2__nav--next" data-nav="1" aria-label="Next image">' + I.chevronRight + '</button>' : "") +
          '<span class="pdp2__counter" id="pdp-counter">1 / ' + p.images.length + '</span>' +
          '<span class="pdp2__zoomcue">' + I.search + ' Hover to zoom · Click to expand</span>' +
          '<div class="pdp2__dots" aria-hidden="true">' + p.images.map(function (_, i) { return '<button type="button" class="' + (i === 0 ? "is-active" : "") + '" data-thumb="' + i + '" tabindex="-1"></button>'; }).join("") + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="pdp2__buy" id="buybox">' +
        '<div class="pdp2__brand">Brigitte Rose · Debut Collection</div>' +
        '<h1 class="pdp2__title">' + esc(p.name) + '</h1>' +
        '<div id="rating-line">' + ratingLine() + '</div>' +
        '<div class="pdp2__price"><span>' + store.money(p.price) + '</span></div>' +
        '<div class="pdp2__promo">' + I.gift + '<span>A portion of proceeds supports The California Community Foundation Wildfire Recovery Fund.</span></div>' +

        '<div class="opt"><div class="opt__head"><span class="opt__label">Print: <strong>' + esc(p.color || p.name) + '</strong></span><span class="muted" style="font-size:var(--fs-xs)">' + BR.PRODUCTS.length + ' prints</span></div>' +
          '<div class="swatches">' + BR.PRODUCTS.map(function (x) { return '<a class="swatch' + (x.id === p.id ? " is-active" : "") + '" href="product.html?p=' + x.id + '" aria-label="' + esc(x.name) + '" title="' + esc(x.color || x.name) + '"' + (x.id === p.id ? ' aria-current="true"' : "") + '><img src="' + BR.img(x.images[0], "sm") + '" alt="" width="56" height="75" loading="lazy"></a>'; }).join("") + '</div></div>' +

        '<div class="opt" id="size-opt"><div class="opt__head"><span class="opt__label">Size: <strong id="size-label">Select a size</strong></span><button type="button" class="opt__link" id="size-guide">' + I.search + ' Size Guide</button></div>' +
          '<div class="size-grid" role="radiogroup" aria-label="Size">' + cfg.sizes.map(function (s) { return '<button type="button" class="size-btn" role="radio" aria-checked="false" aria-pressed="false" data-size="' + s + '">' + s + '</button>'; }).join("") + '</div>' +
          '<div class="opt__err" role="alert">Please select a size to continue.</div></div>' +
        '<div id="fit-scale">' + fitScale() + '</div>' +

        '<div class="pdp2__buyrow">' +
          '<label class="sr-only" for="pdp-qty">Quantity</label><select class="select" id="pdp-qty" aria-label="Quantity">' + [1,2,3,4,5,6,7,8,9,10].map(function (n) { return '<option value="' + n + '">Qty ' + n + '</option>'; }).join("") + '</select>' +
          '<button type="button" class="btn btn--black" id="add-to-cart">Add to Bag</button>' +
          '<button type="button" class="pdp2__fav' + (wished ? " is-active" : "") + '" id="pdp-wish" aria-pressed="' + wished + '" aria-label="' + (wished ? "Remove from" : "Add to") + ' favorites">' + I.heart + '</button>' +
        '</div>' +
        '<div class="pdp2__stock">In stock · Ships in 5–10 days</div>' +
        installments +

        '<div class="delivery" role="tablist" aria-label="Delivery and giving">' +
          '<button type="button" class="delivery__opt is-active" role="tab" aria-selected="true">' + I.truck + '<div><div class="delivery__title">Ship To You <em>' + (cfg.freeShippingThreshold ? "Free over " + store.money(cfg.freeShippingThreshold) : "") + '</em></div><div class="delivery__desc">Enjoy the convenience of shopping from home! Your favorite Brigitte Rose pieces will be carefully packaged and shipped directly to your doorstep, making your shopping experience simple and effortless.</div></div></button>' +
          '<button type="button" class="delivery__opt" role="tab" aria-selected="false">' + I.sparkle + '<div><div class="delivery__title">Delivery <em>5–10 days</em></div><div class="delivery__desc">5–10 days, arriving at your doorstep.</div></div></button>' +
          '<button type="button" class="delivery__opt" role="tab" aria-selected="false">' + I.gift + '<div><div class="delivery__title">A Portion of Proceeds</div><div class="delivery__desc">A portion of proceeds supports The California Community Foundation Wildfire Recovery Fund.</div></div></button>' +
        '</div>' +

        '<div class="accordion pdp2__details">' +
          '<div class="accordion__item"><button type="button" class="accordion__btn" aria-expanded="true" aria-controls="acc-details">Details ' + I.plus + '</button><div class="accordion__panel is-open" id="acc-details"><div><div class="accordion__content">' +
            '<p>' + esc(p.description) + '</p>' +
            '<ul>' + ['Fabric: ' + p.fabric].concat(p.bullets || [p.design]).concat(['Designed in Pacific Palisades, California']).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") + '</ul>' +
            '<div class="pdp2__meta">Style # ' + esc(p.style || p.id.toUpperCase()) + '</div>' +
          '</div></div></div></div>' +
          '<div class="accordion__item"><button type="button" class="accordion__btn" aria-expanded="false" aria-controls="acc-care">Fabric &amp; Care ' + I.plus + '</button><div class="accordion__panel" id="acc-care"><div><div class="accordion__content"><p><strong>Fabric:</strong> ' + esc(p.fabric) + '</p><p><strong>Care:</strong> ' + esc(p.care) + '</p></div></div></div></div>' +
          '<div class="accordion__item"><button type="button" class="accordion__btn" aria-expanded="false" aria-controls="acc-ship">Shipping &amp; Returns ' + I.plus + '</button><div class="accordion__panel" id="acc-ship"><div><div class="accordion__content"><p>Orders ship within 5–10 days. Complimentary standard shipping on orders over ' + store.money(cfg.freeShippingThreshold) + '; express delivery available at checkout.</p><p>Not completely happy? <a class="text-link" href="contact.html">Contact us</a> within 14 days of delivery for returns and exchanges. See our <a class="text-link" href="terms.html#shipping">Shipping &amp; Returns policy</a>.</p></div></div></div></div>' +
        '</div>' +
        '<div class="pdp2__share"><span>Share</span><button type="button" id="share-copy">' + I.check + ' Copy link</button><a data-instagram href="' + esc(cfg.contact.instagram) + '" target="_blank" rel="noopener">Instagram</a></div>' +
      '</div>' +
    '</div>';

  BR.initAccordions();

  /* ---------- Gallery ---------- */
  var mainWrap = $("#pdp-main"), mainImg = $("#pdp-main-img");
  function show(i) {
    current = (i + p.images.length) % p.images.length;
    mainImg.style.animation = "none"; void mainImg.offsetWidth; mainImg.style.animation = "";
    mainImg.src = BR.img(p.images[current]); mainImg.alt = p.name + " – image " + (current + 1);
    $("#pdp-counter").textContent = (current + 1) + " / " + p.images.length;
    $$("[data-thumb]").forEach(function (b) { var on = parseInt(b.getAttribute("data-thumb"), 10) === current; b.classList.toggle("is-active", on); if (b.hasAttribute("aria-selected")) b.setAttribute("aria-selected", String(on)); });
    var t = $('.pdp2__thumb[data-thumb="' + current + '"]'); if (t && t.scrollIntoView) t.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }
  $$("[data-thumb]").forEach(function (b) { b.addEventListener("click", function () { show(parseInt(b.getAttribute("data-thumb"), 10)); }); });
  $$("[data-nav]").forEach(function (b) { b.addEventListener("click", function () { show(current + parseInt(b.getAttribute("data-nav"), 10)); }); });
  // Hover zoom (desktop) + click to expand
  var canHover = window.matchMedia("(hover: hover) and (min-width: 901px)").matches;
  if (canHover) {
    mainWrap.addEventListener("mousemove", function (e) {
      var r = mainWrap.getBoundingClientRect();
      mainImg.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      mainImg.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      mainWrap.classList.add("is-zooming");
    });
    mainWrap.addEventListener("mouseleave", function () { mainWrap.classList.remove("is-zooming"); });
  }
  mainWrap.addEventListener("click", function () {
    BR.openLightbox(p.images.map(function (im, i) { return { src: BR.img(im), alt: p.name + " – image " + (i + 1) }; }), current);
  });
  var sx = 0, sy = 0;
  mainWrap.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  mainWrap.addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1)); }, { passive: true });
  document.addEventListener("keydown", function (e) {
    if (document.querySelector(".lightbox.is-open, .modal.is-open, .drawer.is-open") || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") show(current + 1); if (e.key === "ArrowLeft") show(current - 1);
  });

  /* ---------- Size ---------- */
  var sizeOpt = $("#size-opt");
  function setSize(s) {
    sizeSel = s;
    $$(".size-btn").forEach(function (x) { var on = x.getAttribute("data-size") === s; x.setAttribute("aria-pressed", on); x.setAttribute("aria-checked", on); });
    $("#size-label").textContent = s; sizeOpt.classList.remove("is-invalid");
    var sb = $("#sticky-size"); if (sb) sb.value = s;
  }
  $$(".size-btn").forEach(function (b) { b.addEventListener("click", function () { setSize(b.getAttribute("data-size")); }); });
  $("#size-guide").addEventListener("click", function () {
    BR.openModal('<h2 class="modal__title">Size Guide</h2><p class="muted" style="font-size:var(--fs-sm)">Each set has an easy, relaxed fit with a long-sleeve top and full-length pant. Measurements in inches.</p>' +
      '<table class="size-table"><thead><tr><th>Size</th><th>US</th><th>Bust</th><th>Waist</th><th>Hips</th></tr></thead><tbody>' +
      cfg.sizeGuide.map(function (r) { return '<tr><td>' + r.size + '</td><td>' + r.us + '</td><td>' + r.bust + '</td><td>' + r.waist + '</td><td>' + r.hips + '</td></tr>'; }).join("") +
      '</tbody></table><p style="font-size:var(--fs-xs);color:var(--c-muted)">Standard US sizing. Between sizes? We suggest sizing up for a looser, lounge-ready fit. Still unsure? <a class="text-link" href="contact.html">Ask us</a>.</p>' +
      '<div class="size-grid" style="margin-top:16px">' + cfg.sizes.map(function (s) { return '<button type="button" class="size-btn" data-pick-size="' + s + '">' + s + '</button>'; }).join("") + '</div>', { label: "Size guide" });
    $$("[data-pick-size]").forEach(function (b) { b.addEventListener("click", function () { setSize(b.getAttribute("data-pick-size")); BR.closeModal(); }); });
  });

  /* ---------- Qty / add / wishlist ---------- */
  var qtySel = $("#pdp-qty"); qtySel.addEventListener("change", function () { qty = parseInt(qtySel.value, 10) || 1; var sq = $("#sticky-qty"); if (sq) sq.value = qty; });
  function addToBag(btn) {
    if (!sizeSel) {
      sizeOpt.classList.add("is-invalid"); sizeOpt.scrollIntoView({ behavior: "smooth", block: "center" }); $(".size-btn").focus();
      BR.toast("Please select a size first.", { type: "error" }); return;
    }
    btn.classList.add("is-loading");
    var visible = function (el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 60 && r.top < window.innerHeight - 40; };
    var source = [mainImg, $(".pdp2__thumb.is-active img"), $(".sticky-bar__img"), btn].filter(visible)[0] || btn;
    BR.flyToBag(source, function () {
      store.addToCart(p.id, sizeSel, qty);
      btn.classList.remove("is-loading");
      var orig = btn.textContent; btn.textContent = "Added to Bag ✓"; setTimeout(function () { btn.textContent = orig; }, 1600);
      BR.renderMiniCart(); BR.openDrawer($("#cart-drawer"));
    }, BR.img(p.images[current], "sm"));
  }
  $("#add-to-cart").addEventListener("click", function () { addToBag(this); });
  var wishBtn = $("#pdp-wish");
  wishBtn.addEventListener("click", function () {
    var added = store.toggleWishlist(p.id);
    wishBtn.classList.toggle("is-active", added); wishBtn.setAttribute("aria-pressed", added); wishBtn.setAttribute("aria-label", (added ? "Remove from" : "Add to") + " favorites");
    BR.toast(added ? p.name + " saved to your favorites." : "Removed from your favorites.", added ? { action: { label: "View", href: "wishlist.html" } } : {});
  });
  $("#share-copy").addEventListener("click", function () {
    var url = location.href;
    var done = function () { BR.toast("Link copied to clipboard."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done); else done();
  });

  /* ---------- Delivery tabs ---------- */
  $$(".delivery__opt").forEach(function (b) { b.addEventListener("click", function () { $$(".delivery__opt").forEach(function (x) { var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", String(on)); }); }); });

  /* ---------- Sticky add-to-bag bar ---------- */
  var bar = $("#sticky-bar");
  bar.innerHTML = '<div class="sticky-bar__inner"><img class="sticky-bar__img" src="' + BR.img(p.images[0], "sm") + '" alt="" width="44" height="66"><div class="sticky-bar__meta"><div class="sticky-bar__name">' + esc(p.name) + '</div><div class="sticky-bar__price">' + store.money(p.price) + '</div></div>' +
    '<label class="sr-only" for="sticky-size">Size</label><select class="select" id="sticky-size"><option value="">Select size</option>' + cfg.sizes.map(function (s) { return '<option value="' + s + '">Size ' + s + '</option>'; }).join("") + '</select>' +
    '<button type="button" class="btn btn--black" id="sticky-add">Add to Bag</button></div>';
  $("#sticky-size").addEventListener("change", function () { if (this.value) setSize(this.value); });
  $("#sticky-add").addEventListener("click", function () { addToBag(this); });
  var buyBtn = $("#add-to-cart");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      var past = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      bar.classList.toggle("is-visible", past); bar.setAttribute("aria-hidden", String(!past));
    }, { threshold: 0 }).observe(buyBtn);
  }

  /* ---------- Carousels ---------- */
  var related = BR.PRODUCTS.filter(function (x) { return x.id !== p.id; });
  var rc = $("#related-carousel"); rc.innerHTML = BR.carouselHTML(related.map(function (x) { return BR.productCardHTML(x); }).join(""), "You may also love"); BR.initCarousel(rc);
  var recent = store.getRecent(p.id);
  if (recent.length) { $("#recent-section").hidden = false; var rec = $("#recent-carousel"); rec.innerHTML = BR.carouselHTML(recent.map(function (rid) { return BR.productCardHTML(BR.getProduct(rid)); }).join(""), "Recently viewed"); BR.initCarousel(rec); }

  /* ---------- Reviews ---------- */
  var rroot = $("#reviews-root"); var rstate = { sort: "newest", filter: 0 };
  var FIT = { 1: "Runs small", 2: "Slightly small", 3: "True to size", 4: "Slightly large", 5: "Runs large" };
  var QUAL = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very good", 5: "Excellent" };
  function label(map, v) { return v ? map[Math.round(v)] : "—"; }
  function renderReviews() {
    var st = store.reviewStats(p.id); var list = store.getReviews(p.id);
    $("#rating-line").innerHTML = ratingLine(); $("#fit-scale").innerHTML = fitScale();
    if (!st.count) {
      rroot.innerHTML = '<div class="reviews__empty">' + BR.starsHTML(0, "stars--lg") + '<h3>No reviews yet</h3><p>Own the ' + esc(p.name) + '? Share how it fits, feels and sparkles.</p><button type="button" class="btn" data-write-review>Write the First Review</button></div>';
      return;
    }
    var shown = list.filter(function (r) { return !rstate.filter || r.rating === rstate.filter; });
    shown.sort(function (a, b) {
      if (rstate.sort === "highest") return b.rating - a.rating || new Date(b.date) - new Date(a.date);
      if (rstate.sort === "lowest") return a.rating - b.rating || new Date(b.date) - new Date(a.date);
      if (rstate.sort === "helpful") return (b.helpful || 0) - (a.helpful || 0);
      return new Date(b.date) - new Date(a.date);
    });
    rroot.innerHTML =
      '<div class="reviews__summary">' +
        '<div class="reviews__score"><div class="big">' + st.average.toFixed(1) + '<span> / 5</span></div>' + BR.starsHTML(st.average, "stars--lg") + '<p>' + st.count + (st.count === 1 ? " review" : " reviews") + ' · <strong style="color:var(--c-red)">' + st.recommendPct + '%</strong> would recommend</p><button type="button" class="btn btn--sm" data-write-review>Write a Review</button></div>' +
        '<div class="dist" role="group" aria-label="Filter by rating">' + [5,4,3,2,1].map(function (n) { var c = st.dist[n] || 0; return '<button type="button" class="dist__row" data-filter="' + n + '" aria-pressed="' + (rstate.filter === n) + '"><span>' + n + ' ' + BR.starIcon.replace('<svg', '<svg style="width:11px;height:11px;vertical-align:-1px;color:var(--c-red)"') + '</span><span class="dist__bar"><span class="dist__fill" style="width:' + (st.count ? Math.round(c / st.count * 100) : 0) + '%"></span></span><span>' + c + '</span></button>'; }).join("") + '</div>' +
        '<div class="facets"><div><div class="facet__label">Overall fit</div><div class="facet__value"><strong>' + label(FIT, st.fit) + '</strong></div></div><div><div class="facet__label">Comfort</div><div class="facet__value">' + label(QUAL, st.comfort) + '</div></div><div><div class="facet__label">Quality</div><div class="facet__value">' + label(QUAL, st.quality) + '</div></div></div>' +
      '</div>' +
      '<div class="reviews__toolbar"><div class="toolbar__count">' + (rstate.filter ? 'Showing ' + shown.length + ' of ' + st.count + ' · <button type="button" class="text-link" data-filter="0" style="font-size:inherit">Clear filter</button>' : st.count + (st.count === 1 ? " review" : " reviews")) + '</div><div><label class="sr-only" for="review-sort">Sort reviews</label><select class="select" id="review-sort"><option value="newest">Most recent</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option><option value="helpful">Most helpful</option></select></div></div>' +
      (shown.length ? shown.map(reviewHTML).join("") : '<p class="muted" style="padding:24px 0">No reviews match this filter.</p>');
    $("#review-sort").value = rstate.sort;
    $("#review-sort").addEventListener("change", function () { rstate.sort = this.value; renderReviews(); });
    $$("[data-filter]", rroot).forEach(function (b) { b.addEventListener("click", function () { var n = parseInt(b.getAttribute("data-filter"), 10); rstate.filter = rstate.filter === n ? 0 : n; renderReviews(); }); });
    $$("[data-helpful]", rroot).forEach(function (b) { b.addEventListener("click", function () { var on = store.toggleHelpful(b.getAttribute("data-helpful")); b.classList.toggle("is-on", on); var n = b.querySelector("span"); n.textContent = parseInt(n.textContent, 10) + (on ? 1 : -1); }); });
  }
  function reviewHTML(r) {
    var d = r.date ? new Date(r.date).toLocaleDateString(cfg.locale, { year: "numeric", month: "short", day: "numeric" }) : "";
    var helpfulOn = store.isHelpful(r.id); var helpfulCount = (r.helpful || 0) + (helpfulOn ? 1 : 0);
    return '<article class="review">' +
      '<div class="review__who"><strong>' + esc(r.name || "Anonymous") + '</strong>' + (r.location ? esc(r.location) : "") + (r.verified ? '<div class="verified">' + I.check + ' Verified purchaser</div>' : "") +
        '<dl>' + (r.size ? '<dt>Size purchased</dt><dd>' + esc(r.size) + '</dd>' : "") + (r.fit ? '<dt>Fit</dt><dd>' + FIT[r.fit] + '</dd>' : "") + (r.height ? '<dt>Height</dt><dd>' + esc(r.height) + '</dd>' : "") + '</dl></div>' +
      '<div><div class="review__head">' + BR.starsHTML(r.rating, "stars--sm") + '<span class="review__title">' + esc(r.title) + '</span><span class="review__date">' + d + '</span></div>' +
        '<p class="review__body">' + esc(r.body) + '</p>' +
        '<div class="review__foot">' + (r.recommend ? '<span class="review__rec">✓ Recommends this product</span>' : "") + '<span>Was this helpful?</span><button type="button" data-helpful="' + esc(r.id) + '" class="' + (helpfulOn ? "is-on" : "") + '">' + I.check + ' Yes (<span>' + helpfulCount + '</span>)</button></div>' +
      '</div></article>';
  }
  function openReviewForm() {
    var star = function (n) { return '<input type="radio" name="rv-rating" id="rv-star' + n + '" value="' + n + '"><label for="rv-star' + n + '" title="' + n + ' star' + (n > 1 ? "s" : "") + '">' + BR.starIcon + '</label>'; };
    BR.openModal('<h2 class="modal__title">Write a Review</h2><p class="muted" style="font-size:var(--fs-sm);margin-bottom:18px">' + esc(p.name) + '</p>' +
      '<form id="review-form" novalidate><div class="form-grid">' +
        '<div class="field"><span class="field__label">Overall rating</span><div class="star-input" id="rv-stars">' + [5,4,3,2,1].map(star).join("") + '</div><span class="field__error" id="rv-rating-err"></span></div>' +
        '<div class="field"><label for="rv-title">Review title</label><input class="input" id="rv-title" maxlength="80" placeholder="Sum it up in a few words" required><span class="field__error"></span></div>' +
        '<div class="field"><label for="rv-body">Your review</label><textarea class="textarea" id="rv-body" rows="4" maxlength="1500" placeholder="How does it fit, feel and sparkle?" required></textarea><span class="field__error"></span></div>' +
        '<div class="form-grid form-grid--2">' +
          '<div class="field"><label for="rv-name">Nickname</label><input class="input" id="rv-name" maxlength="40" placeholder="e.g. Ava R." required><span class="field__error"></span></div>' +
          '<div class="field"><label for="rv-location">Location <span class="opt">(optional)</span></label><input class="input" id="rv-location" maxlength="40" placeholder="City, State"></div>' +
          '<div class="field"><label for="rv-size">Size purchased</label><select class="select" id="rv-size"><option value="">Select</option>' + cfg.sizes.map(function (s) { return '<option>' + s + '</option>'; }).join("") + '</select></div>' +
          '<div class="field"><label for="rv-height">Height <span class="opt">(optional)</span></label><input class="input" id="rv-height" maxlength="12" placeholder="5\'6&quot;"></div>' +
        '</div>' +
        '<div class="field"><span class="field__label">How does it fit?</span><div class="seg">' + [1,2,3,4,5].map(function (n) { return '<input type="radio" name="rv-fit" id="rv-fit' + n + '" value="' + n + '"' + (n === 3 ? " checked" : "") + '><label for="rv-fit' + n + '">' + FIT[n] + '</label>'; }).join("") + '</div></div>' +
        '<div class="form-grid form-grid--2">' +
          '<div class="field"><span class="field__label">Comfort</span><div class="seg">' + [1,2,3,4,5].map(function (n) { return '<input type="radio" name="rv-comfort" id="rv-comfort' + n + '" value="' + n + '"' + (n === 4 ? " checked" : "") + '><label for="rv-comfort' + n + '">' + n + '</label>'; }).join("") + '</div></div>' +
          '<div class="field"><span class="field__label">Quality</span><div class="seg">' + [1,2,3,4,5].map(function (n) { return '<input type="radio" name="rv-quality" id="rv-quality' + n + '" value="' + n + '"' + (n === 4 ? " checked" : "") + '><label for="rv-quality' + n + '">' + n + '</label>'; }).join("") + '</div></div>' +
        '</div>' +
        '<label class="check"><input type="checkbox" id="rv-recommend" checked><span>I would recommend this product to a friend</span></label>' +
        '<div class="form-msg form-msg--error" id="rv-err" role="alert"></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="submit" class="btn">Submit Review</button><button type="button" class="btn btn--outline" id="rv-cancel">Cancel</button></div>' +
      '</div></form>', { label: "Write a review" });
    var form = $("#review-form");
    $("#rv-cancel").addEventListener("click", BR.closeModal);
    form.addEventListener("input", function (e) { if (e.target.closest(".field")) BR.setFieldError(e.target, ""); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var rating = (form.querySelector('input[name="rv-rating"]:checked') || {}).value;
      var ok = true;
      var err = $("#rv-rating-err"); err.textContent = rating ? "" : "Please choose a star rating."; err.style.display = rating ? "none" : "block"; if (!rating) ok = false;
      [["rv-title", 3, "Please add a short title."], ["rv-body", 10, "Please write at least 10 characters."], ["rv-name", 2, "Please add a nickname."]].forEach(function (f) { var el = $("#" + f[0]); var bad = el.value.trim().length < f[1]; BR.setFieldError(el, bad ? f[2] : ""); if (bad) ok = false; });
      if (!ok) return;
      var val = function (n) { var c = form.querySelector('input[name="' + n + '"]:checked'); return c ? parseInt(c.value, 10) : null; };
      store.addReview(p.id, { rating: parseInt(rating, 10), title: $("#rv-title").value.trim(), body: $("#rv-body").value.trim(), name: $("#rv-name").value.trim(), location: $("#rv-location").value.trim(), size: $("#rv-size").value, height: $("#rv-height").value.trim(), fit: val("rv-fit"), comfort: val("rv-comfort"), quality: val("rv-quality"), recommend: $("#rv-recommend").checked, verified: store.getOrders().some(function (o) { return o.items.some(function (it) { return it.id === p.id; }); }) });
      BR.closeModal(); renderReviews(); BR.toast("Thank you — your review has been posted.");
      $("#reviews").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  document.addEventListener("click", function (e) { if (e.target.closest("[data-write-review]")) openReviewForm(); });
  renderReviews();
};
