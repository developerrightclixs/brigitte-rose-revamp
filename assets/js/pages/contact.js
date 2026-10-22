/* Contact page form */
BR.onReady = function () {
  var form = BR.$("#contact-form"); if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = BR.$("#c-name"), email = BR.$("#c-email"), subject = BR.$("#c-subject"), msg = BR.$("#c-message"), consent = BR.$("#c-consent");
    var ok = true, first = null;
    function bad(el, m) { BR.setFieldError(el, m); if (m) { ok = false; first = first || el; } }
    bad(name, name.value.trim().length >= 2 ? "" : "Please enter your name.");
    bad(email, BR.isEmail(email.value) ? "" : "Please enter a valid email address.");
    bad(msg, msg.value.trim().length >= 10 ? "" : "Tell us a little more (at least 10 characters).");
    bad(consent, consent.checked ? "" : "Please agree so we can reply to you.");
    if (!ok) { first.focus(); return; }
    // Honeypot
    if (BR.$("#c-company").value) { form.reset(); return; }
    var btn = form.querySelector('button[type="submit"]'); btn.classList.add("is-loading");
    // No backend in this static build: simulate delivery, then offer a mailto fallback.
    setTimeout(function () {
      btn.classList.remove("is-loading");
      BR.showFormMsg(form, "success", "Thank you, " + BR.escape(name.value.trim().split(" ")[0]) + ". Your message is on its way — we’ll reply within 1–2 business days.");
      var body = encodeURIComponent("Name: " + name.value + "\nEmail: " + email.value + "\n\n" + msg.value);
      BR.$("#contact-mailto").href = "mailto:" + BR.CONFIG.contact.email + "?subject=" + encodeURIComponent("[" + subject.value + "] Website enquiry") + "&body=" + body;
      form.reset();
      form.querySelector(".form-msg").scrollIntoView({ behavior: "smooth", block: "center" });
    }, 800);
  });
  form.addEventListener("input", function (e) { if (e.target.closest(".field")) BR.setFieldError(e.target, ""); });
};
