/* Pan-Asia Supermarket — shared site behaviour */
(function () {
  "use strict";

  /* Mobile nav */
  var toggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-nav-mobile]");
  var mobileClose = document.querySelector("[data-nav-close]");

  function openNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  if (toggle) toggle.addEventListener("click", openNav);
  if (mobileClose) mobileClose.addEventListener("click", closeNav);

  /* Dropdown (touch support: tap to open on mobile-width but nav-mobile handles that separately) */
  var dropdowns = document.querySelectorAll(".nav-item-dropdown > .nav-link");
  dropdowns.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 860) return;
      // allow normal navigation on click, dropdown opens via hover on desktop
    });
  });

  /* Hero slideshow */
  var slidesWrap = document.querySelector("[data-hero-slides]");
  if (slidesWrap) {
    var slides = Array.prototype.slice.call(slidesWrap.querySelectorAll(".hero-slide"));
    var dotsWrap = document.querySelector("[data-hero-dots]");
    var current = 0;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "hero-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Show slide " + (i + 1));
        dot.addEventListener("click", function () { show(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function show(index) {
      slides[current].classList.remove("is-active");
      if (dotsWrap) dotsWrap.children[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      if (dotsWrap) dotsWrap.children[current].classList.add("is-active");
    }

    if (slides.length > 1) {
      setInterval(function () { show(current + 1); }, 5500);
    }
  }

  /* Reveal-on-scroll (progressive enhancement — never allowed to leave content hidden) */
  var revealEls = document.querySelectorAll("[data-reveal]");
  function revealAll() {
    revealEls.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity 0.6s ease " + (i % 4) * 0.08 + "s, transform 0.6s ease " + (i % 4) * 0.08 + "s";
      io.observe(el);
    });
    /* Safety net: guarantee nothing stays invisible even if observation
       timing misses an element (e.g. zero-height at observe time). */
    window.addEventListener("load", function () { setTimeout(revealAll, 1200); });
    setTimeout(revealAll, 2500);
  }

  /* Contact form — delivers straight to the store's inbox via FormSubmit.co
     (no backend required). Set data-store-email="store@example.com" on the
     <form> to route it; falls back to admin@panasiamarket.com if omitted. */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-status]");
      var submitBtn = form.querySelector("button[type=submit]");
      var targetEmail = form.getAttribute("data-store-email") || "admin@panasiamarket.com";
      var pageLabel = form.getAttribute("data-store-label") || document.title;

      var nameEl = form.querySelector("input[type=text]");
      var emailEl = form.querySelector("input[type=email]");
      var msgEl = form.querySelector("textarea");

      var payload = {
        name: nameEl ? nameEl.value : "",
        email: emailEl ? emailEl.value : "",
        message: msgEl ? msgEl.value : "",
        _subject: "New website message — " + pageLabel,
        _template: "table",
        _captcha: "false"
      };

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      if (note) { note.style.color = ""; note.textContent = "Sending your message…"; }

      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(targetEmail), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().catch(function () { return {}; }); })
        .then(function () {
          if (note) {
            note.textContent = "Thank you for reaching out! We'll be in touch soon. If you need immediate assistance, please call the store directly.";
            note.style.color = "var(--green-700)";
          }
          form.reset();
        })
        .catch(function () {
          if (note) {
            note.textContent = "Something went wrong sending your message — please email us directly at " + targetEmail + ".";
            note.style.color = "var(--red-600)";
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send Message"; }
        });
    });
  }

  /* Footer year */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* WeChat QR popup — WeChat contacts are added by scanning, not by
     following a link, so the WeChat social badge opens a modal with
     that store's QR code instead of navigating away. */
  var qrModal = document.querySelector("[data-qr-modal]");
  if (qrModal) {
    var qrImage = qrModal.querySelector("[data-qr-image]");
    var qrCaption = qrModal.querySelector("[data-qr-caption]");

    function openQrModal(src, label) {
      if (qrImage) qrImage.src = src;
      if (qrCaption) qrCaption.textContent = "Scan to add " + label + " on WeChat";
      qrModal.classList.add("is-open");
      qrModal.setAttribute("aria-hidden", "false");
    }
    function closeQrModal() {
      qrModal.classList.remove("is-open");
      qrModal.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll("[data-qr-trigger]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openQrModal(btn.getAttribute("data-qr"), btn.getAttribute("data-store-name") || "us");
      });
    });
    qrModal.querySelectorAll("[data-qr-close]").forEach(function (el) {
      el.addEventListener("click", closeQrModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeQrModal();
    });
  }
})();
