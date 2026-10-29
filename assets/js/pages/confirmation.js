/* Order confirmation page */
BR.onReady = function () {
  var store = BR.store;
  var root = BR.$("#confirm-root");
  var num = new URLSearchParams(location.search).get("order");
  var order = num ? store.getOrder(num) : (store.getOrders()[0] || null);

  if (!order) {
    root.innerHTML = '<div class="confirm"><h1>No order found</h1><p class="muted" style="margin-bottom:24px">We couldn’t locate that order in this browser.</p><a class="btn" href="products.html">Continue Shopping</a></div>';
    return;
  }
  var d = new Date(order.placedAt);
  var dateStr = d.toLocaleDateString(BR.CONFIG.locale, { year: "numeric", month: "long", day: "numeric" });
  function addrHTML(a) { return BR.escape(a.first + " " + a.last) + "<br>" + BR.escape(a.address) + (a.apt ? ", " + BR.escape(a.apt) : "") + "<br>" + BR.escape(a.city + ", " + a.state + " " + a.zip) + "<br>" + BR.escape(a.phone); }

  root.innerHTML =
    '<div class="confirm">' +
      '<div class="confirm__icon">' + BR.icons.check + '</div>' +
      '<h1>Thank you, ' + BR.escape(order.shipping.first) + '.</h1>' +
      '<div class="confirm__order">Order ' + BR.escape(order.number) + ' · ' + dateStr + '</div>' +
      '<p class="lead">Your order is confirmed. A receipt has been sent to <strong>' + BR.escape(order.email) + '</strong>. Your set will be carefully packaged and shipped within 5–10 days.</p>' +
      '<p class="muted" style="font-size:.9rem">A portion of this order supports fire-relief efforts benefiting Pacific Palisades and Altadena. Thank you for being part of that.</p>' +
      '<div class="confirm__card">' +
        '<div class="checkout__items" style="max-height:none">' +
          order.items.map(function (it) { return '<div class="checkout__item"><div class="checkout__item-img"><img src="' + BR.img(it.image, "sm") + '" alt="" width="56" height="84"><span class="checkout__item-qty">' + it.qty + '</span></div><div><div class="checkout__item-title">' + BR.escape(it.name) + '</div><div class="checkout__item-meta">Size ' + BR.escape(it.size) + '</div></div><div class="checkout__item-price">' + store.money(it.price * it.qty) + '</div></div>'; }).join("") +
        '</div>' +
        '<div style="margin-top:16px;border-top:1px solid var(--c-line);padding-top:12px">' +
          '<div class="summary__row"><span>Subtotal</span><span>' + store.money(order.totals.subtotal) + '</span></div>' +
          (order.totals.discount > 0 ? '<div class="summary__row summary__row--discount"><span>Discount (' + BR.escape(order.totals.promoCode) + ')</span><span>−' + store.money(order.totals.discount) + '</span></div>' : "") +
          '<div class="summary__row"><span>' + BR.escape(order.shippingMethod) + '</span><span>' + (order.totals.shipping === 0 ? "Complimentary" : store.money(order.totals.shipping)) + '</span></div>' +
          '<div class="summary__row"><span>Sales tax</span><span>' + store.money(order.totals.tax) + '</span></div>' +
          '<div class="summary__row summary__row--total"><span>Total paid</span><span>' + store.money(order.totals.total) + '</span></div>' +
        '</div>' +
        '<div class="confirm__grid">' +
          '<div><h3>Shipping to</h3><p>' + addrHTML(order.shipping) + '</p></div>' +
          '<div><h3>Payment</h3><p>' + BR.escape(order.payment.brand) + ' ending in ' + BR.escape(order.payment.last4) + '<br>' + BR.escape(order.payment.name) + '</p><h3 style="margin-top:16px">Billing</h3><p>' + addrHTML(order.billing) + '</p></div>' +
          (order.notes ? '<div style="grid-column:1/-1"><h3>Order notes</h3><p>' + BR.escape(order.notes) + '</p></div>' : "") +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px"><a class="btn" href="products.html">Continue Shopping</a><button type="button" class="btn btn--outline" onclick="window.print()">Print Receipt</button></div>' +
    '</div>';
};
