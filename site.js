/* Pat's Handyman LLC — site behavior
   Content loads from content/settings.json + content/services.json so Pat can
   edit everything via /admin (Decap CMS) without touching code.            */

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });

  /* ---------- Service icons (inline SVG, stroke style) ---------- */
  var ICONS = {
    wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    fence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V8l2-2v15M10 21V5l2-2v18M16 21v-9l2-2v11M2 10h20M4 15h16"/></svg>',
    saw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l9-9 4 4-9 9H3v-4z"/><path d="M14 5l5 5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    spray: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8h6v12H9z"/><path d="M10 8V5h4v3M12 2v1M5 4l1.5 1.5M19 4l-1.5 1.5"/></svg>',
    roller: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="13" height="5" rx="1"/><path d="M16 6.5h3a1 1 0 0 1 1 1V11h-8v3M12 14v7"/></svg>',
    tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></svg>'
  };

  /* ---------- Fallback content (used if JSON can't load, e.g. file:// preview) ---------- */
  var FALLBACK_SERVICES = [
    { title: "General Repairs", icon: "wrench", description: "Fix leaky faucets, broken doors & windows, drywall, light fixtures." },
    { title: "Plumbing", icon: "droplet", description: "Replace faucets, sinks, toilets, unclog drains, install disposals." },
    { title: "Outdoor Work", icon: "fence", description: "Fence repair, deck maintenance, minor landscaping, outdoor structures." },
    { title: "Carpentry", icon: "saw", description: "Install shelves & cabinets, repair decks, trim/moldings, custom projects." },
    { title: "Electrical", icon: "bolt", description: "Install/replace light fixtures, outlets, switches, security lighting." },
    { title: "Home Maintenance", icon: "spray", description: "Pressure washing, seasonal maintenance, detector installation." },
    { title: "Painting", icon: "roller", description: "Interior/exterior painting, drywall patching, wallpaper removal." },
    { title: "Assembly & Mounting", icon: "tv", description: "Furniture, home gym equipment, TV/mirror mounting, playsets." }
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderServices(services) {
    var grid = document.getElementById("servicesGrid");
    if (!grid || !services || !services.length) return;
    grid.innerHTML = services.map(function (s) {
      var icon = ICONS[s.icon] || ICONS.wrench;
      return (
        '<article class="service-card">' +
          '<div class="service-icon" aria-hidden="true">' + icon + "</div>" +
          "<h3>" + esc(s.title) + "</h3>" +
          "<p>" + esc(s.description) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function applySettings(s) {
    if (!s) return;
    if (s.heroTitle) document.getElementById("heroTitle").textContent = s.heroTitle;
    if (s.heroSubtitle) document.getElementById("heroSubtitle").textContent = s.heroSubtitle;
    if (s.aboutTitle) document.getElementById("aboutTitle").textContent = s.aboutTitle;
    if (s.phone) {
      var tel = "tel:" + s.phone.replace(/[^+\d]/g, "");
      document.getElementById("headerPhone").href = tel;
      var disp = s.phoneDisplay || s.phone;
      document.getElementById("headerPhoneText").textContent = disp;
      var cp = document.getElementById("contactPhone");
      if (cp) { cp.textContent = disp; cp.parentElement.href = tel; }
    }
    if (s.email) {
      var ce = document.getElementById("contactEmail");
      if (ce) { ce.textContent = s.email; ce.parentElement.href = "mailto:" + s.email; }
    }
    if (s.hours && s.hours.length) {
      var dl = document.getElementById("hoursList");
      dl.innerHTML = s.hours.map(function (h) {
        return "<div><dt>" + esc(h.days) + "</dt><dd>" + esc(h.time) + "</dd></div>";
      }).join("");
    }
  }

  /* Load CMS-managed content; fall back to hardcoded defaults on failure. */
  fetch("content/services.json").then(function (r) {
    if (!r.ok) throw new Error("no services json");
    return r.json();
  }).then(function (d) {
    renderServices(d.services);
  }).catch(function () {
    renderServices(FALLBACK_SERVICES);
  });

  fetch("content/settings.json").then(function (r) {
    if (!r.ok) throw new Error("no settings json");
    return r.json();
  }).then(applySettings).catch(function () { /* defaults already in HTML */ });

  /* ---------- Quote form (Web3Forms) ---------- */
  var form = document.getElementById("quoteForm");
  var note = document.getElementById("formNote");
  var submitBtn = document.getElementById("quoteSubmit");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    note.className = "form-note";
    note.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var key = form.querySelector('input[name="access_key"]').value;
    if (!key || key === "YOUR_ACCESS_KEY_HERE") {
      note.className = "form-note err";
      note.textContent = "Thanks! The form isn't connected yet — please call (602) 402-6690 and we'll help right away.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    fetch(form.action, { method: "POST", body: new FormData(form) })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          note.className = "form-note ok";
          note.textContent = "Request sent! We'll be in touch shortly.";
          form.reset();
        } else {
          throw new Error(data.message || "send failed");
        }
      })
      .catch(function () {
        note.className = "form-note err";
        note.textContent = "Something went wrong sending — please call (602) 402-6690 instead.";
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Quote Request";
      });
  });
})();
