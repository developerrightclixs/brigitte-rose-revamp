/* ==========================================================================
   Brigitte Rose — Cart, wishlist, promo & order state (localStorage)
   Emits "br:cart", "br:wishlist" events on window when state changes.
   ========================================================================== */
(function () {
  var KEY_CART = "br_cart_v1";
  var KEY_WISH = "br_wishlist_v1";
  var KEY_PROMO = "br_promo_v1";
  var KEY_ORDERS = "br_orders_v1";
  var KEY_CHECKOUT = "br_checkout_v1";
  var KEY_NEWS = "br_newsletter_v1";
  var KEY_REVIEWS = "br_reviews_v1";
  var KEY_RECENT = "br_recent_v1";
  var KEY_HELPFUL = "br_helpful_v1";

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }
  function emit(name, detail) {
    try { window.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) { /* ignore */ }
  }

  var fmt = new Intl.NumberFormat(BR.CONFIG.locale, { style: "currency", currency: BR.CONFIG.currency });

  var Store = {
    /* ---------- Money ---------- */
    money: function (n) { return fmt.format(Math.round((n || 0) * 100) / 100); },

    /* ---------- Cart ---------- */
    getCart: function () {
      var items = read(KEY_CART, []);
      // Drop lines whose product no longer exists
      return items.filter(function (l) { return !!BR.getProduct(l.id); });
    },
    saveCart: function (items) { write(KEY_CART, items); emit("br:cart", { items: items }); },
    lineKey: function (id, size) { return id + "::" + size; },
    addToCart: function (id, size, qty) {
      qty = Math.max(1, parseInt(qty || 1, 10));
      var product = BR.getProduct(id);
      if (!product) return null;
      if (BR.CONFIG.sizes.indexOf(size) === -1) return null;
      var items = this.getCart();
      var key = this.lineKey(id, size);
      var line = items.find(function (l) { return l.key === key; });
      if (line) { line.qty = Math.min(10, line.qty + qty); }
      else { line = { key: key, id: id, size: size, qty: Math.min(10, qty), added: Date.now() }; items.push(line); }
      this.saveCart(items);
      return line;
    },
    updateQty: function (key, qty) {
      qty = parseInt(qty, 10);
      var items = this.getCart();
      if (isNaN(qty) || qty < 1) { return this.removeLine(key); }
      items.forEach(function (l) { if (l.key === key) l.qty = Math.min(10, qty); });
      this.saveCart(items);
    },
    removeLine: function (key) {
      var items = this.getCart().filter(function (l) { return l.key !== key; });
      this.saveCart(items);
    },
    clearCart: function () { this.saveCart([]); },
    cartCount: function () { return this.getCart().reduce(function (n, l) { return n + l.qty; }, 0); },
    cartSubtotal: function () {
      return this.getCart().reduce(function (n, l) { var p = BR.getProduct(l.id); return n + (p ? p.price * l.qty : 0); }, 0);
    },

    /* ---------- Promo ---------- */
    getPromo: function () { var code = read(KEY_PROMO, null); return code && BR.CONFIG.promoCodes[code] ? code : null; },
    applyPromo: function (code) {
      code = (code || "").trim().toUpperCase();
      if (!code) return { ok: false, msg: "Enter a promo code." };
      if (!BR.CONFIG.promoCodes[code]) return { ok: false, msg: "That code isn’t valid." };
      write(KEY_PROMO, code); emit("br:cart", {});
      return { ok: true, msg: BR.CONFIG.promoCodes[code].label + " applied." };
    },
    removePromo: function () { write(KEY_PROMO, null); emit("br:cart", {}); },

    /* ---------- Totals ---------- */
    // opts: { shippingId, state }
    totals: function (opts) {
      opts = opts || {};
      var cfg = BR.CONFIG;
      var subtotal = this.cartSubtotal();
      var promoCode = this.getPromo();
      var promo = promoCode ? cfg.promoCodes[promoCode] : null;
      var discount = 0;
      if (promo && promo.type === "percent") discount = subtotal * (promo.value / 100);
      var afterDiscount = Math.max(0, subtotal - discount);

      var method = cfg.shippingMethods.find(function (m) { return m.id === (opts.shippingId || "standard"); }) || cfg.shippingMethods[0];
      var shipping = method.price;
      var freeStandard = afterDiscount >= cfg.freeShippingThreshold || (promo && promo.type === "shipping");
      if (method.id === "standard" && freeStandard) shipping = 0;
      if (subtotal === 0) shipping = 0;

      var taxRate = opts.state && cfg.taxRates[opts.state] ? cfg.taxRates[opts.state] : 0;
      var tax = afterDiscount * taxRate;
      var total = afterDiscount + shipping + tax;
      return {
        subtotal: subtotal, discount: discount, promoCode: promoCode, promo: promo,
        shipping: shipping, shippingMethod: method, freeStandard: freeStandard,
        tax: tax, taxRate: taxRate, total: total,
        remainingForFree: Math.max(0, cfg.freeShippingThreshold - afterDiscount)
      };
    },

    /* ---------- Wishlist ---------- */
    getWishlist: function () { return read(KEY_WISH, []).filter(function (id) { return !!BR.getProduct(id); }); },
    inWishlist: function (id) { return this.getWishlist().indexOf(id) !== -1; },
    toggleWishlist: function (id) {
      var list = this.getWishlist(); var i = list.indexOf(id); var added;
      if (i === -1) { list.push(id); added = true; } else { list.splice(i, 1); added = false; }
      write(KEY_WISH, list); emit("br:wishlist", { items: list });
      return added;
    },
    removeFromWishlist: function (id) {
      var list = this.getWishlist().filter(function (x) { return x !== id; });
      write(KEY_WISH, list); emit("br:wishlist", { items: list });
    },

    /* ---------- Checkout draft (persists form between visits) ---------- */
    getCheckoutDraft: function () { return read(KEY_CHECKOUT, {}); },
    saveCheckoutDraft: function (data) { write(KEY_CHECKOUT, data); },
    clearCheckoutDraft: function () { write(KEY_CHECKOUT, {}); },

    /* ---------- Orders ---------- */
    createOrder: function (data) {
      var items = this.getCart().map(function (l) {
        var p = BR.getProduct(l.id);
        return { id: l.id, name: p.name, size: l.size, qty: l.qty, price: p.price, image: p.images[0] };
      });
      var totals = this.totals({ shippingId: data.shippingId, state: data.shipping.state });
      var number = "BR-" + String(Date.now()).slice(-6) + String(Math.floor(Math.random() * 90 + 10));
      var order = {
        number: number, placedAt: new Date().toISOString(), items: items,
        email: data.email, shipping: data.shipping, billing: data.billing,
        shippingMethod: totals.shippingMethod.name, payment: data.payment, totals: {
          subtotal: totals.subtotal, discount: totals.discount, promoCode: totals.promoCode,
          shipping: totals.shipping, tax: totals.tax, total: totals.total
        },
        notes: data.notes || ""
      };
      var orders = read(KEY_ORDERS, []); orders.unshift(order); write(KEY_ORDERS, orders.slice(0, 20));
      this.clearCart(); this.removePromo(); this.clearCheckoutDraft();
      return order;
    },
    getOrder: function (number) { return read(KEY_ORDERS, []).find(function (o) { return o.number === number; }) || null; },
    getOrders: function () { return read(KEY_ORDERS, []); },

    /* ---------- Reviews (seeded from data.js + customer-written, stored locally) ---------- */
    getReviews: function (productId) {
      var p = BR.getProduct(productId); var seeded = (p && p.reviews) || [];
      var local = (read(KEY_REVIEWS, {})[productId]) || [];
      return local.concat(seeded).map(function (r, i) { return Object.assign({ id: r.id || ("r" + i) }, r); });
    },
    addReview: function (productId, review) {
      var all = read(KEY_REVIEWS, {}); all[productId] = all[productId] || [];
      review.id = "u" + Date.now(); review.date = new Date().toISOString(); review.helpful = 0;
      all[productId].unshift(review); write(KEY_REVIEWS, all); emit("br:reviews", { productId: productId });
      return review;
    },
    reviewStats: function (productId) {
      var list = this.getReviews(productId); var n = list.length;
      var dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }; var sum = 0, rec = 0, fit = 0, fitN = 0, comfort = 0, comfortN = 0, quality = 0, qualityN = 0;
      list.forEach(function (r) { dist[r.rating] = (dist[r.rating] || 0) + 1; sum += r.rating; if (r.recommend) rec++; if (r.fit) { fit += r.fit; fitN++; } if (r.comfort) { comfort += r.comfort; comfortN++; } if (r.quality) { quality += r.quality; qualityN++; } });
      return { count: n, average: n ? Math.round((sum / n) * 10) / 10 : 0, dist: dist, recommendPct: n ? Math.round((rec / n) * 100) : 0,
        fit: fitN ? fit / fitN : null, comfort: comfortN ? comfort / comfortN : null, quality: qualityN ? quality / qualityN : null };
    },
    toggleHelpful: function (reviewId) {
      var v = read(KEY_HELPFUL, {}); v[reviewId] = !v[reviewId]; write(KEY_HELPFUL, v); return v[reviewId];
    },
    isHelpful: function (reviewId) { return !!read(KEY_HELPFUL, {})[reviewId]; },

    /* ---------- Recently viewed ---------- */
    trackView: function (productId) {
      var list = read(KEY_RECENT, []).filter(function (id) { return id !== productId; });
      list.unshift(productId); write(KEY_RECENT, list.slice(0, 8));
    },
    getRecent: function (excludeId) { return read(KEY_RECENT, []).filter(function (id) { return id !== excludeId && !!BR.getProduct(id); }); },

    /* ---------- Newsletter ---------- */
    subscribe: function (email) {
      var list = read(KEY_NEWS, []);
      var e = email.trim().toLowerCase();
      if (list.indexOf(e) !== -1) return { ok: true, already: true };
      list.push(e); write(KEY_NEWS, list);
      return { ok: true, already: false };
    }
  };

  BR.store = Store;
})();
