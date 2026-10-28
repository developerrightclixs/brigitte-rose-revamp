/* ==========================================================================
   Brigitte Rose - WooCommerce behaviour
   Size buttons generated from the variation <select>, quick add from the
   product cards, the bag drawer opening after an add, and mini-cart quantity
   changes. Everything goes through WooCommerce's own endpoints and events.
   ========================================================================== */
(function ($) {
  "use strict";

  var BR = window.BR || {};
  var D = window.BR_DATA || {};
  var T = D.i18n || {};

  /* ----------------------------------------------------------------------
   * Size buttons from the variation select
   * -------------------------------------------------------------------- */
  // The select stays in the DOM (hidden by CSS) and remains the source of
  // truth, so WooCommerce's variation script keeps working untouched.
  function buildSizeButtons($form) {
    $form.find("select.br-variation-select, .variations select").each(function () {
      var $select = $(this);
      var $row = $select.closest("td, .value, .woo-variation-items-wrapper, .variations tr, .variation-select");
      var $cell = $row.length ? $row : $select.parent();

      var $grid = $cell.find(".size-grid");
      if (!$grid.length) {
        $grid = $('<div class="size-grid" role="radiogroup"></div>');
        $cell.append($grid);
      }

      var selected = $select.val();
      var html = "";

      $select.find("option").each(function () {
        var value = $(this).attr("value");
        if (!value) return; // The "Choose an option" placeholder.
        var on = value === selected;
        html += '<button type="button" class="size-btn" role="radio"' +
          ' aria-checked="' + on + '" aria-pressed="' + on + '"' +
          ' data-value="' + BR.escape(value) + '">' + BR.escape($(this).text()) + "</button>";
      });

      $grid.html(html);

      // Label beside the attribute name, as in the design.
      var $label = $cell.closest("tr, .variation").find(".opt__label strong, [data-size-label]");
      if ($label.length) {
        $label.text(selected ? $select.find('option[value="' + selected + '"]').text() : "");
      }
    });
  }

  $(document).on("click", ".size-grid .size-btn", function (e) {
    e.preventDefault();
    var $btn = $(this);
    var $form = $btn.closest("form.cart");
    var $select = $btn.closest("td, .value, .variations tr, .variation-select").find("select").first();
    if (!$select.length) $select = $form.find("select").first();
    if (!$select.length) return;

    $select.val($btn.data("value")).trigger("change");
    $form.removeClass("is-invalid");
  });

  // WooCommerce fires this whenever it rebuilds the available options.
  $(document).on("woocommerce_update_variation_values wc_variation_form check_variations", "form.cart", function () {
    buildSizeButtons($(this));
  });

  $(document).on("found_variation reset_data", "form.cart", function () {
    buildSizeButtons($(this));
  });

  /* ----------------------------------------------------------------------
   * Add to bag: open the drawer, never leave the page
   * -------------------------------------------------------------------- */
  $(document.body).on("added_to_cart", function (event, fragments, cartHash, $button) {
    if (BR.openCart) BR.openCart();

    var name = $button && $button.data("br-name");
    if (name && BR.toast) {
      BR.toast(name + " " + (T.added || "added to your bag."));
    }
    if (BR.paintWishlist) BR.paintWishlist();
  });

  // The single product form is a normal POST, so give it feedback and let it go.
  $(document).on("submit", "form.cart", function () {
    var $form = $(this);
    var $select = $form.find("select").first();

    // Variable product with nothing chosen: stop and point at the size row.
    if ($form.hasClass("variations_form") && $select.length && !$select.val()) {
      var $opt = $form.find(".size-grid").closest("tr, .variations, .variation-select");
      $opt.addClass("is-invalid");
      if (BR.toast) BR.toast(T.pickSize || "Please select a size first.", { type: "error" });
      $form.find(".size-btn").first().trigger("focus");
      return false;
    }

    $form.find('button[type="submit"]').addClass("is-loading");
    return true;
  });

  /* ----------------------------------------------------------------------
   * Quick add from a product card
   * -------------------------------------------------------------------- */
  $(document).on("click", "[data-quick-add]", function (e) {
    e.preventDefault();

    var $btn = $(this);
    if ($btn.prop("disabled") || $btn.hasClass("is-loading")) return;

    var productId = parseInt($btn.attr("data-quick-add"), 10);
    var variationId = parseInt($btn.attr("data-variation"), 10) || 0;
    if (!productId) return;

    var $card = $btn.closest(".product-card");
    var name = $card.find(".product-card__title").text().trim();

    $btn.addClass("is-loading").prop("disabled", true);

    var payload = {
      product_id: variationId ? productId : productId,
      quantity: 1
    };
    if (variationId) {
      payload.variation_id = variationId;
      payload.product_id = productId;
    }

    $.post(wcAjaxUrl("add_to_cart"), payload)
      .done(function (response) {
        $btn.removeClass("is-loading").prop("disabled", false);

        if (!response) return;

        if (response.error && response.product_url) {
          window.location = response.product_url;
          return;
        }

        $(document.body).trigger("wc_fragment_refresh");
        $(document.body).trigger("added_to_cart", [response.fragments, response.cart_hash, $btn]);

        if (name && BR.toast) {
          var size = $btn.attr("data-size");
          BR.toast(name + (size ? " (" + size + ")" : "") + " " + (T.added || "added to your bag."));
        }
      })
      .fail(function () {
        $btn.removeClass("is-loading").prop("disabled", false);
        if (BR.toast) BR.toast(T.genericError || "Something went wrong.", { type: "error" });
      });
  });

  /** WooCommerce's own AJAX endpoint URL. */
  function wcAjaxUrl(endpoint) {
    if (window.wc_add_to_cart_params && window.wc_add_to_cart_params.wc_ajax_url) {
      return window.wc_add_to_cart_params.wc_ajax_url.toString().replace("%%endpoint%%", endpoint);
    }
    return "/?wc-ajax=" + endpoint;
  }

  /* ----------------------------------------------------------------------
   * Mini-cart quantity
   * -------------------------------------------------------------------- */
  var qtyTimer = null;

  document.addEventListener("br:qty", function (e) {
    var key = e.detail && e.detail.key;
    var qty = e.detail && e.detail.qty;
    if (!key) return;

    // Only the drawer needs AJAX; the cart page has its own Update button.
    if (!$("#cart-drawer").find('[data-qty="' + key + '"]').length) return;

    clearTimeout(qtyTimer);
    qtyTimer = setTimeout(function () {
      $("#cart-drawer").addClass("is-busy");

      $.post(D.ajaxUrl, {
        action: "br_update_qty",
        nonce: D.nonce,
        key: key,
        qty: qty
      }).done(function (response) {
        $("#cart-drawer").removeClass("is-busy");
        if (response && response.fragments) {
          $.each(response.fragments, function (selector, html) {
            $(selector).replaceWith(html);
          });
          $(document.body).trigger("wc_fragments_refreshed");
        }
      }).fail(function () {
        $("#cart-drawer").removeClass("is-busy");
        if (BR.toast) BR.toast(T.genericError || "Something went wrong.", { type: "error" });
      });
    }, 350);
  });

  /* ----------------------------------------------------------------------
   * Keep the drawer markup wired after a fragment refresh
   * -------------------------------------------------------------------- */
  $(document.body).on("wc_fragments_refreshed wc_fragments_loaded", function () {
    var drawer = document.getElementById("cart-drawer");
    if (!drawer) return;

    drawer.querySelectorAll("[data-close-drawer]").forEach(function (btn) {
      if (btn.dataset.brBound) return;
      btn.dataset.brBound = "1";
      btn.addEventListener("click", function () { if (BR.closeDrawers) BR.closeDrawers(); });
    });
  });

  /* ----------------------------------------------------------------------
   * Shop page: shadow under the sticky filter bar
   * -------------------------------------------------------------------- */
  $(function () {
    var bar = document.getElementById("shop-bar");
    if (!bar || !("IntersectionObserver" in window)) return;

    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;height:1px;width:1px;";
    bar.parentNode.insertBefore(sentinel, bar);

    var headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 80;

    new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }, { rootMargin: "-" + (headerHeight + 1) + "px 0px 0px 0px" }).observe(sentinel);

    // Slide the active-filter indicator under the pressed chip.
    var seg = document.getElementById("filter-seg");
    if (!seg) return;
    var indicator = seg.querySelector(".filter-seg__indicator");
    var active = seg.querySelector('[aria-pressed="true"]');

    function move() {
      if (!indicator || !active) return;
      indicator.style.width = active.offsetWidth + "px";
      indicator.style.transform = "translateX(" + active.offsetLeft + "px)";
      requestAnimationFrame(function () { indicator.classList.add("is-ready"); });
    }

    move();
    window.addEventListener("resize", move);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(move);
  });

  /* ----------------------------------------------------------------------
   * Boot
   * -------------------------------------------------------------------- */
  $(function () {
    $("form.cart").each(function () { buildSizeButtons($(this)); });
  });
})(window.jQuery);
