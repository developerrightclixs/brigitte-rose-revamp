/* Wishlist page */
BR.onReady = function () {
  var root = BR.$("#wishlist-root");
  function render() {
    var ids = BR.store.getWishlist();
    if (!ids.length) {
      root.innerHTML = '<div class="empty-state" style="border:0;padding-block:var(--section)">' + BR.icons.heart + '<h2 style="font-size:1.8rem">Your wishlist is empty</h2><p>Tap the heart on any set to save it here.</p><a class="btn" href="products.html">Shop the Collection</a></div>';
      return;
    }
    root.innerHTML = '<p class="toolbar__count" style="margin-bottom:24px">' + ids.length + (ids.length === 1 ? " saved set" : " saved sets") + '</p><div class="product-grid wishlist-grid">' + ids.map(function (id) { return BR.productCardHTML(BR.getProduct(id)); }).join("") + '</div>';
  }
  render();
  window.addEventListener("br:wishlist", render);
};
