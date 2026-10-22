/* Checkout page: contact, shipping, delivery, payment, review */
BR.onReady = function () {
  var store = BR.store;
  var root = BR.$("#checkout-root");
  var items = store.getCart();

  if (!items.length) {
    root.innerHTML = '<div class="checkout__empty">' + BR.icons.bag + '<h1 style="font-size:2rem;margin-top:12px">Your bag is empty</h1><p class="muted" style="margin-bottom:24px">Add a set to your bag before checking out.</p><a class="btn" href="products.html">Shop the Collection</a></div>';
    return;
  }

  var draft = store.getCheckoutDraft();
  var state = { shippingId: draft.shippingId || "standard", state: draft.state || "", billingSame: draft.billingSame !== false };
  var statesHTML = '<option value="">Select state</option>' + BR.US_STATES.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + '</option>'; }).join("");

  function addrFields(prefix) {
    return '<div class="form-grid form-grid--2">' +
      '<div class="field"><label for="' + prefix + '-first">First name</label><input class="input" id="' + prefix + '-first" name="' + prefix + '-first" autocomplete="given-name" required><span class="field__error"></span></div>' +
      '<div class="field"><label for="' + prefix + '-last">Last name</label><input class="input" id="' + prefix + '-last" name="' + prefix + '-last" autocomplete="family-name" required><span class="field__error"></span></div>' +
      '<div class="field field--span"><label for="' + prefix + '-address">Address</label><input class="input" id="' + prefix + '-address" name="' + prefix + '-address" autocomplete="address-line1" placeholder="Street address" required><span class="field__error"></span></div>' +
      '<div class="field field--span"><label for="' + prefix + '-apt">Apartment, suite, etc. <span class="opt">(optional)</span></label><input class="input" id="' + prefix + '-apt" name="' + prefix + '-apt" autocomplete="address-line2"><span class="field__error"></span></div>' +
      '<div class="field"><label for="' + prefix + '-city">City</label><input class="input" id="' + prefix + '-city" name="' + prefix + '-city" autocomplete="address-level2" required><span class="field__error"></span></div>' +
      '<div class="field"><label for="' + prefix + '-state">State</label><select class="select" id="' + prefix + '-state" name="' + prefix + '-state" autocomplete="address-level1" required>' + statesHTML + '</select><span class="field__error"></span></div>' +
      '<div class="field"><label for="' + prefix + '-zip">ZIP code</label><input class="input" id="' + prefix + '-zip" name="' + prefix + '-zip" inputmode="numeric" autocomplete="postal-code" maxlength="10" required><span class="field__error"></span></div>' +
      '<div class="field"><label for="' + prefix + '-phone">Phone</label><input class="input" id="' + prefix + '-phone" name="' + prefix + '-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="For delivery updates" required><span class="field__error"></span></div>' +
    '</div>';
  }

  root.innerHTML =
    '<form class="checkout" id="checkout-form" novalidate>' +
      '<div class="checkout__main">' +
        '<section class="checkout__step" aria-labelledby="st1"><div class="checkout__step-head"><span class="checkout__num">1</span><h2 id="st1">Contact</h2></div>' +
          '<div class="form-grid"><div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><span class="field__error"></span><span class="field__hint">Your order confirmation will be sent here.</span></div>' +
          '<label class="check"><input type="checkbox" id="news-opt" name="news-opt"><span>Email me with news, launches and offers from Brigitte Rose.</span></label></div>' +
        '</section>' +
        '<section class="checkout__step" aria-labelledby="st2"><div class="checkout__step-head"><span class="checkout__num">2</span><h2 id="st2">Shipping address</h2></div>' + addrFields("ship") + '</section>' +
        '<section class="checkout__step" aria-labelledby="st3"><div class="checkout__step-head"><span class="checkout__num">3</span><h2 id="st3">Delivery</h2></div><div id="ship-methods"></div></section>' +
        '<section class="checkout__step" aria-labelledby="st4"><div class="checkout__step-head"><span class="checkout__num">4</span><h2 id="st4">Payment</h2></div>' +
          '<div class="form-grid">' +
            '<div class="field"><label for="card-number">Card number</label><div class="card-input"><input class="input" id="card-number" name="card-number" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23" required><span class="card-input__brand" id="card-brand"></span></div><span class="field__error"></span></div>' +
            '<div class="form-grid form-grid--3">' +
              '<div class="field"><label for="card-name">Name on card</label><input class="input" id="card-name" name="card-name" autocomplete="cc-name" required><span class="field__error"></span></div>' +
              '<div class="field"><label for="card-exp">Expiry (MM/YY)</label><input class="input" id="card-exp" name="card-exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5" required><span class="field__error"></span></div>' +
              '<div class="field"><label for="card-cvc">Security code</label><input class="input" id="card-cvc" name="card-cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="CVC" maxlength="4" required><span class="field__error"></span></div>' +
            '</div>' +
            '<label class="check"><input type="checkbox" id="billing-same" name="billing-same"' + (state.billingSame ? " checked" : "") + '><span>Billing address is the same as shipping address</span></label>' +
            '<div id="billing-fields" ' + (state.billingSame ? 'hidden' : '') + '>' + addrFields("bill") + '</div>' +
          '</div>' +
          '<div class="secure-note">' + BR.icons.lock + ' Your payment details are encrypted and never stored on this site.</div>' +
        '</section>' +
        '<section class="checkout__step" aria-labelledby="st5"><div class="checkout__step-head"><span class="checkout__num">5</span><h2 id="st5">Notes</h2></div>' +
          '<div class="field"><label for="notes">Order notes <span class="opt">(optional)</span></label><textarea class="textarea" id="notes" name="notes" rows="3" placeholder="Gift message or delivery instructions"></textarea></div>' +
        '</section>' +
        '<div class="form-msg form-msg--error" id="form-error" role="alert"></div>' +
      '</div>' +
      '<aside class="checkout__summary"><div class="summary" aria-label="Order summary">' +
        '<h2>Your order</h2><div class="checkout__items">' +
          items.map(function (l) { var p = BR.getProduct(l.id); return '<div class="checkout__item"><div class="checkout__item-img"><img src="' + BR.img(p.images[0], "sm") + '" alt="" width="56" height="84"><span class="checkout__item-qty">' + l.qty + '</span></div><div><div class="checkout__item-title">' + BR.escape(p.name) + '</div><div class="checkout__item-meta">Size ' + BR.escape(l.size) + '</div></div><div class="checkout__item-price">' + store.money(p.price * l.qty) + '</div></div>'; }).join("") +
        '</div><div id="promo-area"></div><div id="totals"></div>' +
        '<button type="submit" class="btn btn--block btn--lg checkout__place" id="place-order">Place Order</button>' +
        '<p class="checkout__legal">By placing your order you agree to our <a href="terms.html">Terms &amp; Conditions</a> and <a href="privacy.html">Privacy Policy</a>.</p>' +
        '<div class="trust"><span>' + BR.icons.lock + ' SSL secure</span><span>' + BR.icons.truck + ' 24–48h dispatch</span></div>' +
      '</div></aside>' +
    '</form>';

  var form = BR.$("#checkout-form");
  // Mobile: pinned bar with live total + Place Order (submits the same form)
  var bar = document.createElement("div"); bar.className = "checkout-bar is-active"; bar.id = "checkout-bar";
  bar.innerHTML = '<div class="checkout-bar__inner"><div><div class="checkout-bar__label">Total</div><div class="checkout-bar__total" id="checkout-bar-total"></div></div><button type="submit" form="checkout-form" class="btn" id="place-order-mobile">Place Order</button></div>';
  document.body.appendChild(bar);

  /* ---------- Delivery methods ---------- */
  function renderShipping() {
    var t = store.totals({ shippingId: state.shippingId, state: state.state });
    BR.$("#ship-methods").innerHTML = BR.CONFIG.shippingMethods.map(function (m) {
      var free = m.id === "standard" && t.freeStandard;
      var price = free ? "Complimentary" : store.money(m.price);
      return '<label class="radio-card' + (state.shippingId === m.id ? " is-selected" : "") + '"><input type="radio" name="shipping" value="' + m.id + '"' + (state.shippingId === m.id ? " checked" : "") + '><div class="radio-card__body"><div class="radio-card__title">' + m.name + '</div><div class="radio-card__desc">' + m.desc + '</div></div><div class="radio-card__price">' + price + '</div></label>';
    }).join("");
    BR.$$('input[name="shipping"]').forEach(function (r) { r.addEventListener("change", function () { state.shippingId = r.value; saveDraft(); renderShipping(); renderTotals(); }); });
  }

  /* ---------- Totals + promo ---------- */
  function renderTotals() {
    var t = store.totals({ shippingId: state.shippingId, state: state.state });
    BR.$("#totals").innerHTML =
      '<div class="summary__row"><span>Subtotal</span><span>' + store.money(t.subtotal) + '</span></div>' +
      (t.discount > 0 ? '<div class="summary__row summary__row--discount"><span>Discount (' + BR.escape(t.promoCode) + ')</span><span>−' + store.money(t.discount) + '</span></div>' : "") +
      '<div class="summary__row"><span>' + t.shippingMethod.name + '</span><span>' + (t.shipping === 0 ? "Complimentary" : store.money(t.shipping)) + '</span></div>' +
      '<div class="summary__row"><span>Sales tax' + (t.taxRate ? " (" + (t.taxRate * 100).toFixed(2).replace(/\.?0+$/, "") + "%)" : "") + '</span><span>' + (state.state ? store.money(t.tax) : "Enter address") + '</span></div>' +
      '<div class="summary__row summary__row--total"><span>Total</span><span>' + store.money(t.total) + '</span></div>';
    var bt = BR.$("#checkout-bar-total"); if (bt) bt.textContent = store.money(t.total);
    BR.$("#promo-area").innerHTML = t.promoCode
      ? '<div class="promo-applied">' + BR.icons.check + ' ' + BR.escape(t.promoCode) + '<button type="button" data-remove-promo aria-label="Remove promo code">' + BR.icons.close + '</button></div>'
      : '<div class="promo"><label class="sr-only" for="promo-input">Promo code</label><input class="input" id="promo-input" type="text" placeholder="Promo code" autocomplete="off"><button class="btn btn--outline" type="button" id="promo-apply">Apply</button></div><div class="promo-msg" id="promo-msg" aria-live="polite"></div>';
    var apply = BR.$("#promo-apply");
    if (apply) {
      var doApply = function () { var r = store.applyPromo(BR.$("#promo-input").value); var m = BR.$("#promo-msg"); if (!r.ok) { m.textContent = r.msg; m.className = "promo-msg is-err"; } else { BR.toast(r.msg); renderShipping(); renderTotals(); } };
      apply.addEventListener("click", doApply);
      BR.$("#promo-input").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); doApply(); } });
    }
    var rp = BR.$("[data-remove-promo]"); if (rp) rp.addEventListener("click", function () { store.removePromo(); renderShipping(); renderTotals(); });
  }
  renderShipping(); renderTotals();

  /* ---------- Draft persistence ---------- */
  var draftFields = ["email", "ship-first", "ship-last", "ship-address", "ship-apt", "ship-city", "ship-state", "ship-zip", "ship-phone", "card-name", "notes"];
  draftFields.forEach(function (id) { var el = BR.$("#" + id); if (el && draft[id]) el.value = draft[id]; });
  if (draft["news-opt"]) BR.$("#news-opt").checked = true;
  function saveDraft() {
    var d = { shippingId: state.shippingId, state: state.state, billingSame: BR.$("#billing-same").checked, "news-opt": BR.$("#news-opt").checked };
    draftFields.forEach(function (id) { var el = BR.$("#" + id); if (el) d[id] = el.value; });
    store.saveCheckoutDraft(d);
  }
  form.addEventListener("input", function () { clearTimeout(form._t); form._t = setTimeout(saveDraft, 400); });

  BR.$("#ship-state").addEventListener("change", function () { state.state = this.value; renderShipping(); renderTotals(); saveDraft(); });
  state.state = BR.$("#ship-state").value;
  renderTotals();

  BR.$("#billing-same").addEventListener("change", function () {
    var bf = BR.$("#billing-fields"); bf.hidden = this.checked; saveDraft();
  });

  /* ---------- Card formatting ---------- */
  var cardNum = BR.$("#card-number"), cardExp = BR.$("#card-exp"), cardCvc = BR.$("#card-cvc"), brandEl = BR.$("#card-brand");
  function cardBrand(n) {
    if (/^4/.test(n)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "Amex";
    if (/^6(011|5)/.test(n)) return "Discover";
    return "";
  }
  cardNum.addEventListener("input", function () {
    var d = cardNum.value.replace(/\D/g, "").slice(0, 19);
    var brand = cardBrand(d); brandEl.textContent = brand;
    var groups = brand === "Amex" ? [4, 6, 5] : [4, 4, 4, 4, 3];
    var out = [], i = 0;
    groups.forEach(function (g) { if (i < d.length) { out.push(d.substr(i, g)); i += g; } });
    cardNum.value = out.join(" ");
    cardCvc.maxLength = brand === "Amex" ? 4 : 3;
  });
  cardExp.addEventListener("input", function () {
    var d = cardExp.value.replace(/\D/g, "").slice(0, 4);
    if (d.length >= 3) d = d.slice(0, 2) + "/" + d.slice(2);
    else if (d.length === 2 && cardExp.value.length === 2 && !cardExp._del) d = d + "/";
    cardExp.value = d;
  });
  cardExp.addEventListener("keydown", function (e) { cardExp._del = e.key === "Backspace"; });
  cardCvc.addEventListener("input", function () { cardCvc.value = cardCvc.value.replace(/\D/g, "").slice(0, 4); });
  BR.$$("#ship-zip, #bill-zip").forEach(function (z) { z.addEventListener("input", function () { z.value = z.value.replace(/[^\d-]/g, "").slice(0, 10); }); });

  function luhn(n) { var s = 0, alt = false; for (var i = n.length - 1; i >= 0; i--) { var d = parseInt(n[i], 10); if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return n.length >= 13 && s % 10 === 0; }
  function validExpiry(v) {
    var m = v.match(/^(\d{2})\/(\d{2})$/); if (!m) return false;
    var mm = parseInt(m[1], 10), yy = 2000 + parseInt(m[2], 10); if (mm < 1 || mm > 12) return false;
    var now = new Date(); var exp = new Date(yy, mm, 0, 23, 59, 59); return exp >= now;
  }

  /* ---------- Validation ---------- */
  function validate() {
    var ok = true, firstBad = null;
    function bad(el, msg) { BR.setFieldError(el, msg); if (msg) { ok = false; firstBad = firstBad || el; } }
    var email = BR.$("#email"); bad(email, BR.isEmail(email.value) ? "" : "Enter a valid email address.");
    var prefixes = ["ship"]; if (!BR.$("#billing-same").checked) prefixes.push("bill");
    prefixes.forEach(function (pre) {
      ["first", "last", "address", "city"].forEach(function (k) { var el = BR.$("#" + pre + "-" + k); bad(el, el.value.trim() ? "" : "This field is required."); });
      var st = BR.$("#" + pre + "-state"); bad(st, st.value ? "" : "Select a state.");
      var zip = BR.$("#" + pre + "-zip"); bad(zip, /^\d{5}(-\d{4})?$/.test(zip.value.trim()) ? "" : "Enter a valid ZIP code.");
      var ph = BR.$("#" + pre + "-phone"); bad(ph, ph.value.replace(/\D/g, "").length >= 10 ? "" : "Enter a valid phone number.");
    });
    if (!BR.$('input[name="shipping"]:checked')) { ok = false; }
    var num = cardNum.value.replace(/\s/g, ""); bad(cardNum, luhn(num) ? "" : "Enter a valid card number.");
    bad(BR.$("#card-name"), BR.$("#card-name").value.trim() ? "" : "Enter the name on the card.");
    bad(cardExp, validExpiry(cardExp.value) ? "" : "Enter a valid future expiry date.");
    var cvcLen = cardBrand(num) === "Amex" ? 4 : 3; bad(cardCvc, cardCvc.value.length === cvcLen ? "" : "Enter the " + cvcLen + "-digit code.");
    return { ok: ok, first: firstBad };
  }
  form.addEventListener("input", function (e) { if (e.target.closest(".field")) BR.setFieldError(e.target, ""); if (!form.querySelector(".field.is-invalid")) BR.$("#form-error").classList.remove("is-visible"); });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errBox = BR.$("#form-error"); errBox.classList.remove("is-visible");
    var v = validate();
    if (!v.ok) {
      errBox.className = "form-msg form-msg--error is-visible"; errBox.innerHTML = BR.icons.alert + "<span>Please review the highlighted fields.</span>";
      if (v.first) { v.first.focus({ preventScroll: true }); v.first.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }
    var btn = BR.$("#place-order"); btn.classList.add("is-loading"); btn.setAttribute("aria-busy", "true");
    var mbtn = BR.$("#place-order-mobile"); if (mbtn) { mbtn.classList.add("is-loading"); mbtn.setAttribute("aria-busy", "true"); }
    function addr(pre) { return { first: BR.$("#" + pre + "-first").value.trim(), last: BR.$("#" + pre + "-last").value.trim(), address: BR.$("#" + pre + "-address").value.trim(), apt: BR.$("#" + pre + "-apt").value.trim(), city: BR.$("#" + pre + "-city").value.trim(), state: BR.$("#" + pre + "-state").value, zip: BR.$("#" + pre + "-zip").value.trim(), phone: BR.$("#" + pre + "-phone").value.trim() }; }
    var shipping = addr("ship"); var billing = BR.$("#billing-same").checked ? shipping : addr("bill");
    var num = cardNum.value.replace(/\s/g, "");
    // Simulated payment processing (no real gateway). Replace with Stripe/PayPal integration for production.
    setTimeout(function () {
      var order = store.createOrder({
        email: BR.$("#email").value.trim(), shipping: shipping, billing: billing, shippingId: state.shippingId,
        payment: { brand: cardBrand(num) || "Card", last4: num.slice(-4), name: BR.$("#card-name").value.trim() },
        notes: BR.$("#notes").value.trim()
      });
      if (BR.$("#news-opt").checked) store.subscribe(BR.$("#email").value);
      location.href = "order-confirmation.html?order=" + encodeURIComponent(order.number);
    }, 1400);
  });
};
