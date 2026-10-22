/* Gallery page: masonry + lightbox + load more */
BR.onReady = function () {
  var grid = BR.$("#gallery-grid"), more = BR.$("#gallery-more");
  var items = BR.GALLERY.slice(8).concat(BR.GALLERY.slice(0, 8)); // campaign shots first, editorial strip last
  var shown = 0, PAGE = 12;
  function renderMore() {
    var next = items.slice(shown, shown + PAGE);
    grid.insertAdjacentHTML("beforeend", next.map(function (g, i) {
      return '<a class="gallery-item reveal" href="' + BR.galleryImg(g.src) + '" data-lightbox-group="gallery" data-full="' + BR.galleryImg(g.src) + '"><img src="' + BR.galleryImg(g.src, "sm") + '" srcset="' + BR.galleryImg(g.src, "sm") + ' 800w, ' + BR.galleryImg(g.src) + ' 1600w" sizes="(max-width: 900px) 50vw, 33vw" alt="' + BR.escape(g.alt) + '" loading="' + (shown + i < 6 ? "eager" : "lazy") + '" width="' + g.w + '" height="' + g.h + '"></a>';
    }).join(""));
    shown += next.length;
    BR.$$(".gallery-item.reveal:not(.is-visible)").forEach(function (el) { requestAnimationFrame(function () { el.classList.add("is-visible"); }); });
    more.hidden = shown >= items.length;
    BR.$("#gallery-count").textContent = "Showing " + shown + " of " + items.length;
  }
  more.addEventListener("click", renderMore);
  renderMore();
};
