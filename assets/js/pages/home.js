/* Home page: featured collection grid + gallery strip */
BR.onReady = function () {
  var grid = BR.$("#home-products");
  if (grid) grid.innerHTML = BR.PRODUCTS.map(function (p, i) { return BR.productCardHTML(p, { eager: i < 3 }); }).join("");

  var strip = BR.$("#home-gallery");
  if (strip) {
    strip.innerHTML = BR.GALLERY.slice(0, 8).map(function (g) {
      return '<a class="gallery-item" href="' + BR.galleryImg(g.src) + '" data-lightbox-group="home" data-full="' + BR.galleryImg(g.src) + '">' +
        '<img src="' + BR.galleryImg(g.src, "sm") + '" srcset="' + BR.galleryImg(g.src, "sm") + ' 800w, ' + BR.galleryImg(g.src) + ' 1600w" sizes="(max-width: 767px) 50vw, 25vw" alt="' + BR.escape(g.alt) + '" loading="lazy" width="' + g.w + '" height="' + g.h + '"></a>';
    }).join("");
  }
};
