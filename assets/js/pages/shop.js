/* Shop page: sticky filter bar with sliding indicator, per-filter counts, sort, animated grid switches */
BR.onReady = function () {
  var $ = BR.$, $$ = BR.$$;
  var grid = $("#shop-grid"), count = $("#shop-count"), sort = $("#shop-sort"), seg = $("#filter-seg"), indicator = $(".filter-seg__indicator"), active = $("#shop-active"), bar = $("#shop-bar");
  var chips = $$("[data-filter-fabric]");
  var LABELS = { all: "All", modal: "Modal", rayon: "Rayon", polyester: "Stretch Poly" };
  var state = { fabric: "all", sort: "featured" };
  var first = true;

  // Restore from URL (?fabric=modal&sort=price-asc)
  var qs = new URLSearchParams(location.search);
  if (qs.get("fabric") && LABELS[qs.get("fabric")]) state.fabric = qs.get("fabric");
  if (qs.get("sort")) state.sort = qs.get("sort");
  if (sort) sort.value = state.sort;

  // Per-filter counts
  $$("[data-count]").forEach(function (el) {
    var k = el.getAttribute("data-count");
    el.textContent = k === "all" ? BR.PRODUCTS.length : BR.PRODUCTS.filter(function (p) { return p.fabricKey === k; }).length;
  });

  function moveIndicator() {
    var btn = chips.find(function (c) { return c.getAttribute("aria-pressed") === "true"; });
    if (!btn || !indicator) return;
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.transform = "translateX(" + btn.offsetLeft + "px)";
    requestAnimationFrame(function () { indicator.classList.add("is-ready"); });
    if (btn.scrollIntoView && seg.scrollWidth > seg.clientWidth) btn.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function list() {
    var l = BR.PRODUCTS.slice();
    if (state.fabric !== "all") l = l.filter(function (p) { return p.fabricKey === state.fabric; });
    if (state.sort === "price-asc") l.sort(function (a, b) { return a.price - b.price || a.name.localeCompare(b.name); });
    if (state.sort === "price-desc") l.sort(function (a, b) { return b.price - a.price || a.name.localeCompare(b.name); });
    if (state.sort === "name") l.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return l;
  }

  function paint(l) {
    if (!l.length) {
      grid.innerHTML = '<div class="empty-state card-in" style="grid-column:1/-1">' + BR.icons.search + '<p>No sets match that filter yet.</p><button type="button" class="btn btn--outline btn--sm" id="shop-reset-inline">Show all</button></div>';
      $("#shop-reset-inline").addEventListener("click", function () { setFabric("all"); });
    } else {
      grid.innerHTML = l.map(function (p, i) { return BR.productCardHTML(p, { eager: i < 3 }); }).join("");
      $$(".product-card", grid).forEach(function (c, i) { c.classList.add("card-in"); c.style.animationDelay = (i * 70) + "ms"; });
    }
    var n = l.length;
    count.innerHTML = "<strong>" + n + "</strong> " + (n === 1 ? "set" : "sets");
    var strong = count.querySelector("strong"); strong.classList.remove("pop"); void strong.offsetWidth; strong.classList.add("pop");
    if (state.fabric !== "all" || state.sort !== "featured") {
      active.hidden = false;
      active.innerHTML = "Showing <strong>" + BR.escape(LABELS[state.fabric]) + "</strong>" + (state.sort !== "featured" ? " · sorted by <strong>" + BR.escape(sort.options[sort.selectedIndex].text) + "</strong>" : "") +
        '<button type="button" id="shop-reset">' + BR.icons.close + ' Clear</button>';
      $("#shop-reset").addEventListener("click", function () { state.sort = "featured"; sort.value = "featured"; setFabric("all"); });
    } else { active.hidden = true; active.innerHTML = ""; }
  }

  function render() {
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-filter-fabric") === state.fabric)); });
    moveIndicator();
    var params = new URLSearchParams();
    if (state.fabric !== "all") params.set("fabric", state.fabric);
    if (state.sort !== "featured") params.set("sort", state.sort);
    history.replaceState(null, "", location.pathname + (params.toString() ? "?" + params.toString() : ""));
    var l = list();
    if (first || !grid.children.length) { first = false; paint(l); return; }
    grid.classList.add("is-switching");
    setTimeout(function () { grid.classList.remove("is-switching"); paint(l); }, 190);
  }
  function setFabric(f) { if (state.fabric === f) return; state.fabric = f; render(); }

  chips.forEach(function (c) { c.addEventListener("click", function () { setFabric(c.getAttribute("data-filter-fabric")); }); });
  if (sort) sort.addEventListener("change", function () { state.sort = sort.value; render(); });
  window.addEventListener("resize", moveIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

  // Shadow when the bar is stuck under the header
  if ("IntersectionObserver" in window && bar) {
    var sentinel = document.createElement("div"); sentinel.style.cssText = "position:absolute;height:1px;width:1px;"; bar.parentNode.insertBefore(sentinel, bar);
    new IntersectionObserver(function (en) { bar.classList.toggle("is-stuck", !en[0].isIntersecting); }, { rootMargin: "-" + (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) + 1) + "px 0px 0px 0px" }).observe(sentinel);
  }
  render();
};
