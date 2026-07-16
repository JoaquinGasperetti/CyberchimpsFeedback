(function () {
  "use strict";

  var form = document.getElementById("surveyForm");
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var totalSteps = steps.length;
  var current = 1;

  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var submitBtn = document.getElementById("submitBtn");
  var navButtons = document.getElementById("navButtons");
  var stepError = document.getElementById("stepError");
  var progressFill = document.getElementById("progressFill");
  var progressText = document.getElementById("progressText");
  var progressPct = document.getElementById("progressPct");

  // ---- widgets de rating 1-5 ----
  document.querySelectorAll(".rating").forEach(function (wrap) {
    var name = wrap.dataset.name;
    var btns = document.createElement("div");
    btns.className = "rating-btns";

    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = name;

    for (var i = 1; i <= 5; i++) {
      (function (val) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "rating-btn";
        b.textContent = val;
        b.setAttribute("aria-label", name + ": " + val + " de 5");
        b.addEventListener("click", function () {
          hidden.value = String(val);
          btns.querySelectorAll(".rating-btn").forEach(function (x, idx) {
            x.classList.toggle("selected", idx < val);
          });
          clearInvalid(wrap.closest(".field"));
        });
        btns.appendChild(b);
      })(i);
    }

    var legend = document.createElement("div");
    legend.className = "rating-legend";
    legend.innerHTML =
      "<span>" + (wrap.dataset.low || "") + "</span><span>" + (wrap.dataset.high || "") + "</span>";

    wrap.appendChild(btns);
    wrap.appendChild(legend);
    wrap.appendChild(hidden);
  });

  // ---- slider de puntuación ----
  var slider = document.getElementById("scoreSlider");
  var scoreValue = document.getElementById("scoreValue");
  var puntuacionHidden = document.getElementById("puntuacionHidden");
  var sliderTouched = false;

  function syncScore() {
    scoreValue.textContent = slider.value;
    puntuacionHidden.value = slider.value;
    var pct = (slider.value - 1) / 9;
    var hue = 140 * pct + 340 * (1 - pct); // magenta -> verde
    scoreValue.style.color = "hsl(" + hue + ", 80%, 60%)";
  }
  slider.addEventListener("input", function () {
    sliderTouched = true;
    syncScore();
    clearInvalid(slider.closest(".field"));
  });
  scoreValue.textContent = slider.value;

  // ---- limpiar error al responder ----
  form.addEventListener("change", function (e) {
    var field = e.target.closest(".field");
    if (field) clearInvalid(field);
  });

  function clearInvalid(field) {
    if (field) field.classList.remove("invalid");
    stepError.textContent = "";
  }

  // ---- navegación ----
  function requiredFieldsOf(stepEl) {
    var missing = [];
    stepEl.querySelectorAll(".field").forEach(function (field) {
      var label = field.querySelector(".q");
      if (!label || !label.querySelector(".req")) return;

      var radios = field.querySelectorAll('input[type="radio"]');
      if (radios.length) {
        var any = Array.prototype.some.call(radios, function (r) { return r.checked; });
        if (!any) missing.push(field);
        return;
      }
      var hidden = field.querySelector('input[type="hidden"]');
      if (hidden && field.querySelector(".rating")) {
        if (!hidden.value) missing.push(field);
        return;
      }
      if (field.querySelector("#scoreSlider")) {
        if (!sliderTouched) missing.push(field);
      }
    });
    return missing;
  }

  function validateStep(n) {
    var stepEl = steps[n - 1];
    var missing = requiredFieldsOf(stepEl);
    stepEl.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });
    if (missing.length) {
      missing.forEach(function (f) { f.classList.add("invalid"); });
      stepError.textContent = "⚠ Te faltan " + missing.length + " respuesta(s) obligatoria(s) en este paso.";
      missing[0].scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    stepError.textContent = "";
    return true;
  }

  function showStep(n) {
    current = n;
    steps.forEach(function (s, i) {
      s.classList.toggle("active", i === n - 1);
    });
    navButtons.classList.toggle("first", n === 1);
    navButtons.classList.toggle("last", n === totalSteps);

    var pct = Math.round((n / totalSteps) * 100);
    progressFill.style.width = pct + "%";
    progressText.textContent = "PASO " + n + " / " + totalSteps;
    progressPct.textContent = pct + "%";

    document.getElementById("progressWrap").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  nextBtn.addEventListener("click", function () {
    if (!validateStep(current)) return;
    if (current < totalSteps) showStep(current + 1);
  });

  prevBtn.addEventListener("click", function () {
    if (current > 1) showStep(current - 1);
  });

  showStep(1);

  // ---- envío ----
  function collectData() {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (value, key) {
      if (key === "website" || key === "puntuacion_slider") return; // honeypot / duplicado
      if (data[key] !== undefined) {
        data[key] += " | " + value;
      } else {
        data[key] = value;
      }
    });
    data.puntuacion = puntuacionHidden.value || slider.value;
    data.idioma = navigator.language || "";
    data.pantalla = window.screen.width + "x" + window.screen.height;
    return data;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(current)) return;

    // honeypot: si un bot lo llenó, fingimos éxito sin enviar
    if (document.getElementById("website").value) {
      showSuccess();
      return;
    }

    var email = form.elements["contacto"].value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      stepError.textContent = "⚠ El email no parece válido (o dejalo vacío).";
      form.elements["contacto"].closest(".field").classList.add("invalid");
      return;
    }

    var data = collectData();

    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ TRANSMITIENDO…";

    if (!SURVEY_ENDPOINT) {
      console.warn("[CyberChimps] SURVEY_ENDPOINT vacío: respuesta NO enviada (modo demo).", data);
      setTimeout(showSuccess, 800);
      return;
    }

    // Apps Script acepta POST text/plain sin preflight CORS
    fetch(SURVEY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
      redirect: "follow"
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showSuccess();
      })
      .catch(function (err) {
        console.error("[CyberChimps] Error enviando feedback:", err);
        submitBtn.disabled = false;
        submitBtn.textContent = "🐒 TRANSMITIR FEEDBACK";
        stepError.textContent = "⚠ Error de conexión al enviar. Probá de nuevo en unos segundos.";
      });
  });

  function showSuccess() {
    form.classList.add("hidden");
    document.getElementById("successScreen").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
})();
