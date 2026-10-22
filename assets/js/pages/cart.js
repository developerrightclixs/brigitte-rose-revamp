/* Cart page */
BR.onReady = function () {
  var store = BR.store;
  var root = BR.$("#cart-root");

  function promoHTML(t) {
    if (t.promoCode) {
      return '<div class="promo-applied">' + BR.icons.check + ' ' + BR.escape(t.promoCode) + ' — ' + BR.escape(t.promo.label) + '<button type="button" data-remove-promo aria-label="Remove promo code">' + BR.icons.close + '</button></div>';
    }
    return '<form class="promo" id="promo-form" novalidate><label class="sr-only" for="promo-input">Promo code</label><input class="input" id="promo-input" type="text" placeholder="Promo code" autocomplete="off"><button class="btn btn--outline" type="submit">Apply</button></form><div class="promo-msg" id="promo-msg" aria-live="polite"></div>';
  }

  function render() {
    var items = store.getCart();
    if (!items.length) {
      root.innerHTML = '<div class="empty-state" style="border:0;padding-block:var(--section)">' + BR.icons.bag + '<h2 style="font-size:1.8rem">Your bag is empty</h2><p>Discover our debut collection of luxury sparkle sets.</p><a class="btn" href="products.html">Shop the Collection</a></div>';
      return;
    }
    var t = store.totals();
    root.innerHTML =
      '<div class="cart-layout">' +
        '<div>' +
          '<div class="cart-table">' +
            '<div class="cart-table__head"><span>Product</span><span>Quantity</span><span style="text-align:right">Total</span><span></span></div>' +
            items.map(function (l) {
              var p = BR.getProduct(l.id);
              return '<div class="cart-row">' +
                '<div class="cart-row__product"><a class="cart-row__img" href="product.html?p=' + p.id + '"><img src="' + BR.img(p.images[0], "sm") + '" alt="' + BR.escape(p.name) + '" width="96" height="144"></a>' +
                '<div><h2 class="cart-row__title"><a href="product.html?p=' + p.id + '">' + BR.escape(p.name) + '</a></h2><div class="cart-row__meta">Size ' + BR.escape(l.size) + '</div><div class="cart-row__unit">' + store.money(p.price) + ' each</div></div></div>' +
                '<div class="cart-row__qty-wrap">' + BR.qtyHTML(l.key, l.qty) + '</div>' +
                '<div class="cart-row__total">' + store.money(p.price * l.qty) + '</div>' +
                '<button type="button" class="icon-btn cart-row__remove" data-remove="' + BR.escape(l.key) + '" aria-label="Remove ' + BR.escape(p.name) + '">' + BR.icons.trash + '</button>' +
              '</div>';
            }).join("") +
          '</div>' +
          '<div class="cart-actions"><a class="link-underline" href="products.html">← Continue shopping</a><button type="button" class="btn--ghost btn" id="clear-cart">Clear bag</button></div>' +
        '</div>' +
        '<aside class="summary" aria-label="Order summary">' +
          '<h2>Summary</h2>' + BR.shipProgressHTML(t) +
          '<div class="summary__row"><span>Subtotal</span><span>' + store.money(t.subtotal) + '</span></div>' +
          (t.discount > 0 ? '<div class="summary__row summary__row--discount"><span>Discount (' + BR.escape(t.promoCode) + ')</span><span>−' + store.money(t.discount) + '</span></div>' : "") +
          '<div class="summary__row"><span>Standard shipping</span><span>' + (t.shipping === 0 ? "Complimentary" : store.money(t.shipping)) + '</span></div>' +
          '<div class="summary__row"><span>Estimated tax</span><span>Calculated at checkout</span></div>' +
          '<div class="summary__row summary__row--total"><span>Estimated total</span><span>' + store.money(t.total) + '</span></div>' +
          promoHTML(t) +
          '<p class="summary__note">Express shipping and California sales tax are calculated at checkout.</p>' +
          '<a class="btn btn--block btn--lg" href="checkout.html">Proceed to Checkout</a>' +
          '<div class="trust"><span>' + BR.icons.lock + ' Secure checkout</span><span>' + BR.icons.truck + ' Ships in 24–48h</span><span>' + BR.icons.gift + ' Gives back</span></div>' +
        '</aside>' +
      '</div>';

    var pf = BR.$("#promo-form");
    if (pf) pf.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = store.applyPromo(BR.$("#promo-input").value);
      var m = BR.$("#promo-msg"); if (m) { m.textContent = r.msg; m.className = "promo-msg " + (r.ok ? "is-ok" : "is-err"); }
      if (r.ok) BR.toast(r.msg);
    });
    var rp = BR.$("[data-remove-promo]"); if (rp) rp.addEventListener("click", function () { store.removePromo(); BR.toast("Promo code removed."); });
    BR.$("#clear-cart").addEventListener("click", function () {
      BR.openModal('<h2 class="modal__title">Clear your bag?</h2><p class="muted">This removes every item from your bag.</p><div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap"><button type="button" class="btn" id="confirm-clear">Yes, clear bag</button><button type="button" class="btn btn--outline" id="cancel-clear">Keep items</button></div>', { label: "Clear bag" });
      BR.$("#confirm-clear").addEventListener("click", function () { store.clearCart(); BR.closeModal(); BR.toast("Your bag has been cleared."); });
      BR.$("#cancel-clear").addEventListener("click", BR.closeModal);
    });
  }
  render();
  window.addEventListener("br:cart", render);
};
