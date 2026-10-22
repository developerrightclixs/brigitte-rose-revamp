import sys, os, json, time
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://127.0.0.1:8765/"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
os.makedirs(OUT, exist_ok=True)
PAGES = ["index.html", "about.html", "products.html", "product.html?p=black-sparkle-set", "gallery.html", "contact.html", "cart.html", "checkout.html", "wishlist.html", "terms.html", "privacy.html", "404.html", "order-confirmation.html"]
WIDTHS = [1440, 1024, 768, 390, 320]
issues = []

def check_overflow(page, label):
    sw, cw = page.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
    if sw > cw + 1:
        # find offenders
        bad = page.evaluate("""() => { const cw=document.documentElement.clientWidth; const out=[]; document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect(); if(r.right>cw+1 && r.width>0) out.push(el.tagName+'.'+(el.className||'').toString().split(' ').slice(0,2).join('.')+' right='+Math.round(r.right));}); return out.slice(0,6); }""")
        issues.append(f"OVERFLOW {label}: scrollWidth {sw} > {cw} :: {bad}")

with sync_playwright() as p:
    browser = p.chromium.launch()
    # ---------- Visual + overflow + console audit ----------
    for w in WIDTHS:
        ctx = browser.new_context(viewport={"width": w, "height": 900}, device_scale_factor=1)
        page = ctx.new_page()
        errs = []
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
        for u in PAGES:
            page.goto(BASE + u, wait_until="networkidle")
            page.evaluate("async () => { document.documentElement.style.scrollBehavior='auto'; for (let y=0; y<document.body.scrollHeight; y+=600) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,40)); } window.scrollTo(0,0); }")
            page.wait_for_timeout(500)
            name = u.replace(".html", "").replace("?p=", "-")
            check_overflow(page, f"{name}@{w}")
            if w in (1440, 390, 768):
                page.screenshot(path=os.path.join(OUT, f"{name}-{w}.png"), full_page=True)
        if errs:
            issues.append(f"CONSOLE@{w}: {errs[:5]}")
        ctx.close()

    # ---------- Functional flow ----------
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    errs = []
    page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
    log = []

    # Home renders products + gallery
    page.goto(BASE, wait_until="networkidle")
    log.append(("home product cards", page.locator("#home-products .product-card").count()))
    log.append(("home gallery items", page.locator("#home-gallery .gallery-item").count()))

    # Quick add from shop
    page.goto(BASE + "products.html", wait_until="networkidle")
    log.append(("shop cards", page.locator("#shop-grid .product-card").count()))
    page.click('[data-filter-fabric="modal"]'); page.wait_for_timeout(100)
    log.append(("modal filter count", page.locator("#shop-grid .product-card").count()))
    page.click('[data-filter-fabric="all"]')
    card = page.locator("#shop-grid .product-card").first
    card.hover()
    card.locator('[data-quick-add][data-size="M"]').click()
    page.wait_for_timeout(350)
    log.append(("fly ghost mid-flight", page.locator(".fly-img").count() == 1))
    page.wait_for_timeout(1000)
    log.append(("cart count after quick add", page.locator("[data-cart-count]").first.inner_text()))
    log.append(("toast shown", page.locator(".toast").count() > 0))
    log.append(("drawer opened after quick add", page.locator("#cart-drawer.is-open").count() == 1))
    page.keyboard.press("Escape"); page.wait_for_timeout(400)

    # Wishlist toggle
    card.locator("[data-wish]").click(); page.wait_for_timeout(150)
    log.append(("wish count", page.locator("[data-wish-count]").first.inner_text()))

    # PDP: size required validation then add
    page.goto(BASE + "product.html?p=leopard-sparkle-set", wait_until="networkidle")
    log.append(("pdp title", page.locator(".pdp2__title").inner_text()))
    page.click("#add-to-cart"); page.wait_for_timeout(100)
    log.append(("size error visible", page.locator("#size-opt.is-invalid").count() == 1))
    page.click('.size-btn[data-size="S"]')
    page.select_option("#pdp-qty", "2")
    page.click("#add-to-cart"); page.wait_for_timeout(1600)
    log.append(("mini cart open", page.locator("#cart-drawer.is-open").count() == 1))
    log.append(("mini cart lines", page.locator("#cart-drawer .cart-line").count()))
    log.append(("cart count", page.locator("[data-cart-count]").first.inner_text()))
    # thumbnails
    page.keyboard.press("Escape"); page.wait_for_timeout(300)
    page.click('.pdp2__thumb[data-thumb="2"]'); page.wait_for_timeout(100)
    log.append(("main img switched", "IMG_1193" in page.locator("#pdp-main-img").get_attribute("src")))
    page.click("#pdp-main-img"); page.wait_for_timeout(300)
    log.append(("lightbox open", page.locator(".lightbox.is-open").count() == 1))
    page.keyboard.press("Escape"); page.wait_for_timeout(300)
    # swatches, size guide, delivery tabs, sticky bar, carousel, reviews
    log.append(("swatches", page.locator(".swatch").count()))
    page.click("#size-guide"); page.wait_for_timeout(300)
    log.append(("size guide table rows", page.locator(".modal.is-open .size-table tbody tr").count()))
    page.click('.modal.is-open [data-pick-size="M"]'); page.wait_for_timeout(300)
    log.append(("size picked from guide", page.locator("#size-label").inner_text()))
    page.locator(".delivery__opt").nth(2).click()
    log.append(("delivery tab 3 active", page.locator(".delivery__opt").nth(2).get_attribute("aria-selected")))
    page.evaluate("window.scrollTo(0, 1800)"); page.wait_for_timeout(500)
    log.append(("sticky bar visible", page.locator("#sticky-bar.is-visible").count() == 1))
    page.evaluate("window.scrollTo(0, 0)"); page.wait_for_timeout(400)
    log.append(("related carousel cards", page.locator("#related-carousel .product-card").count()))
    log.append(("reviews empty state", page.locator(".reviews__empty").count() == 1))
    page.click(".reviews__empty [data-write-review]"); page.wait_for_timeout(300)
    page.click("#review-form button[type=submit]"); page.wait_for_timeout(100)
    log.append(("review validation errors", page.locator("#review-form .field.is-invalid").count()))
    page.click("label[for=rv-star5]"); page.fill("#rv-title", "So soft and sparkly"); page.fill("#rv-body", "The sequin pocket is gorgeous and the fabric is incredibly soft. Fits true to size.")
    page.fill("#rv-name", "Ava R."); page.fill("#rv-location", "Los Angeles, CA"); page.select_option("#rv-size", "S")
    page.click("#review-form button[type=submit]"); page.wait_for_timeout(500)
    log.append(("review posted", page.locator(".review").count()))
    log.append(("rating line", " ".join(page.locator("#rating-line").inner_text().split())))
    log.append(("fit scale shown", page.locator(".fit-scale").count() == 1))
    page.locator('.dist__row[data-filter="4"]').click(); page.wait_for_timeout(100)
    log.append(("filter 4 stars shows none", page.locator(".review").count()))
    page.locator('.dist__row[data-filter="4"]').click(); page.wait_for_timeout(100)
    page.click("[data-helpful]"); log.append(("helpful toggled", page.locator("[data-helpful].is-on").count() == 1))
    page.goto(BASE + "product.html?p=navy-sparkle-set", wait_until="networkidle")
    log.append(("recently viewed shown", page.locator("#recent-section:not([hidden]) .product-card").count()))
    page.goto(BASE + "product.html?p=leopard-sparkle-set", wait_until="networkidle"); page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(OUT, "flow-pdp.png"), full_page=True)

    # Cart page: qty change, promo
    page.goto(BASE + "cart.html", wait_until="networkidle")
    log.append(("cart rows", page.locator(".cart-row").count()))
    page.locator(".cart-row").first.locator("[data-qty-inc]").click(); page.wait_for_timeout(200)
    total_text = page.locator(".summary__row--total span").last.inner_text()
    log.append(("cart total before promo", total_text))
    page.fill("#promo-input", "bogus"); page.click("#promo-form button"); page.wait_for_timeout(100)
    log.append(("bad promo msg", page.locator("#promo-msg").inner_text()))
    page.fill("#promo-input", "sparkle10"); page.click("#promo-form button"); page.wait_for_timeout(300)
    log.append(("promo applied", page.locator(".promo-applied").count() == 1))
    log.append(("cart total after promo", page.locator(".summary__row--total span").last.inner_text()))
    page.screenshot(path=os.path.join(OUT, "flow-cart.png"), full_page=True)

    # Checkout: validation then success
    page.goto(BASE + "checkout.html", wait_until="networkidle")
    page.click("#place-order"); page.wait_for_timeout(300)
    log.append(("checkout invalid fields", page.locator(".field.is-invalid").count()))
    page.fill("#email", "test@example.com")
    page.fill("#ship-first", "Ava"); page.fill("#ship-last", "Rose"); page.fill("#ship-address", "1 Sunset Blvd")
    page.fill("#ship-city", "Pacific Palisades"); page.select_option("#ship-state", "CA"); page.fill("#ship-zip", "90272"); page.fill("#ship-phone", "3105551234")
    page.wait_for_timeout(200)
    log.append(("tax row shows CA", page.locator("#totals").inner_text().replace("\n", " | ")))
    page.check('input[name="shipping"][value="express"]'); page.wait_for_timeout(200)
    page.fill("#card-number", "4242424242424242"); page.fill("#card-name", "Ava Rose"); page.fill("#card-exp", "1229"); page.fill("#card-cvc", "123")
    log.append(("card formatted", page.input_value("#card-number")))
    log.append(("card brand", page.locator("#card-brand").inner_text()))
    log.append(("expiry formatted", page.input_value("#card-exp")))
    page.screenshot(path=os.path.join(OUT, "flow-checkout.png"), full_page=True)
    page.click("#place-order")
    try:
        page.wait_for_url("**/order-confirmation.html?order=*", timeout=15000)
    except Exception:
        print("ORDER NAV FAILED", page.url)
        print(page.evaluate("[...document.querySelectorAll('.field.is-invalid')].map(f=>f.querySelector('label') && f.querySelector('label').textContent)"))
        print("btn loading:", page.locator("#place-order.is-loading").count())
        for k, v in log: print(k, ":", v)
        raise
    page.wait_for_timeout(300)
    log.append(("confirmation h1", page.locator(".confirm h1").inner_text()))
    log.append(("order number", page.locator(".confirm__order").inner_text()))
    log.append(("cart empty after order", page.locator("[data-cart-count]").first.inner_text()))
    page.screenshot(path=os.path.join(OUT, "flow-confirmation.png"), full_page=True)

    # Wishlist page
    page.goto(BASE + "wishlist.html", wait_until="networkidle")
    log.append(("wishlist cards", page.locator(".wishlist-grid .product-card").count()))

    # Contact form validation + success
    page.goto(BASE + "contact.html", wait_until="networkidle")
    page.click("#contact-form button[type=submit]"); page.wait_for_timeout(100)
    log.append(("contact invalid", page.locator("#contact-form .field.is-invalid").count()))
    page.fill("#c-name", "Ava"); page.fill("#c-email", "ava@example.com"); page.fill("#c-message", "Hello there, question about sizing."); page.check("#c-consent")
    page.click("#contact-form button[type=submit]"); page.wait_for_timeout(1200)
    log.append(("contact success", page.locator("#contact-form .form-msg.is-visible").inner_text()[:60]))

    # Newsletter
    page.fill("#news-email-contact", "nope"); page.click("form[data-newsletter] button"); page.wait_for_timeout(100)
    log.append(("newsletter error", page.locator("form[data-newsletter] .field__error").inner_text()))
    page.fill("#news-email-contact", "ava@example.com"); page.click("form[data-newsletter] button"); page.wait_for_timeout(1000)
    log.append(("newsletter success", page.locator("form[data-newsletter] .form-msg.is-visible").inner_text()[:50]))

    # Gallery lightbox + load more
    page.goto(BASE + "gallery.html", wait_until="networkidle")
    n1 = page.locator("#gallery-grid .gallery-item").count(); page.click("#gallery-more"); page.wait_for_timeout(200)
    log.append(("gallery load more", (n1, page.locator("#gallery-grid .gallery-item").count())))
    page.locator("#gallery-grid .gallery-item").first.click(); page.wait_for_timeout(300)
    log.append(("gallery lightbox", page.locator(".lightbox.is-open").count() == 1))
    page.keyboard.press("ArrowRight"); page.wait_for_timeout(100)
    log.append(("lightbox count", page.locator(".lightbox__count").inner_text()))
    page.keyboard.press("Escape")

    # Mobile menu
    ctx2 = browser.new_context(viewport={"width": 390, "height": 844})
    m = ctx2.new_page(); m.goto(BASE, wait_until="networkidle")
    m.click("[data-open-menu]"); m.wait_for_timeout(400)
    log.append(("mobile menu open", m.locator("#menu-drawer.is-open").count() == 1))
    log.append(("body scroll locked", m.evaluate("document.body.classList.contains('no-scroll')")))
    m.screenshot(path=os.path.join(OUT, "flow-mobile-menu.png"))
    m.keyboard.press("Escape"); m.wait_for_timeout(300)
    log.append(("menu closed", m.locator("#menu-drawer.is-open").count() == 0))
    # mobile pdp + cart drawer
    m.goto(BASE + "product.html?p=grey-sparkle-set", wait_until="networkidle")
    m.click('.size-btn[data-size="L"]'); m.click("#add-to-cart"); m.wait_for_timeout(1600)
    m.screenshot(path=os.path.join(OUT, "flow-mobile-cart.png"))
    m.keyboard.press("Escape")
    m.goto(BASE + "checkout.html", wait_until="networkidle"); m.wait_for_timeout(300)
    m.screenshot(path=os.path.join(OUT, "flow-mobile-checkout.png"), full_page=True)

    if errs: issues.append(f"FLOW CONSOLE: {errs[:5]}")
    browser.close()

print("=== FLOW LOG ===")
for k, v in log: print(f"{k}: {v}")
print("=== ISSUES ===")
print("\n".join(issues) if issues else "none")
