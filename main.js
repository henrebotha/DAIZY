(function () {
  var stage = document.getElementById("scroll-stage");
  var slot = document.getElementById("hero-slot");
  var wrap = document.getElementById("hero-wrap");
  var img = document.getElementById("hero-img");
  var placeholder = document.getElementById("placeholder-block");
  var header = document.getElementById("site-header");
  var daizyOuter = document.getElementById("daizy-outer");
  var compassPanel = document.getElementById("compass-panel");

  if (!stage || !wrap || !slot) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ticking = false;
  var phase2Anchor = null;

  var COMPACT_TOP_GAP = 60;

  function easeInOutCubic(t) {
    t = Math.min(1, Math.max(0, t));
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function headerHeight() {
    return header ? header.offsetHeight : 56;
  }

  /** 第一段：到顶栏下 60px 为止 */
  function morphPhase1Distance() {
    return Math.max(520, window.innerHeight * 0.88);
  }

  /** 第二段：占位消失 + 贴右侧半屏 + 左半图；略长更顺滑 */
  function morphPhase2Distance() {
    return Math.max(640, window.innerHeight * 0.95);
  }

  function metrics() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var hh = headerHeight();
    stage.style.setProperty("--header-measured", hh + "px");
    return {
      hh: hh,
      vh: vh,
      vw: vw,
      heroW: Math.min(960, vw * 0.88),
      compactW: Math.min(420, vw * 0.52),
    };
  }

  function displayImgHeight(widthPx) {
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
      return (widthPx / img.naturalWidth) * img.naturalHeight;
    }
    if (img && img.offsetHeight > 0) {
      return img.offsetHeight;
    }
    return widthPx * 0.56;
  }

  function setDarkFallbackClass(q) {
    if (!stage) return;
    if (
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("background-color", "color-mix(in srgb, white 50%, black)")
    ) {
      stage.classList.remove("is-dark-body");
      return;
    }
    stage.classList.toggle("is-dark-body", q > 0.55);
  }

  function clearDockStyles() {
    if (!slot) return;
    slot.classList.remove("is-docked");
    slot.style.position = "";
    slot.style.left = "";
    slot.style.right = "";
    slot.style.top = "";
    slot.style.bottom = "";
    slot.style.width = "";
    slot.style.marginLeft = "";
    slot.style.marginRight = "";
    wrap.style.width = "";
    wrap.style.maxWidth = "";
  }

  function applyScroll() {
    var y = window.scrollY || window.pageYOffset;
    var D1 = morphPhase1Distance();
    var D2 = morphPhase2Distance();

    var p1 = Math.min(1, Math.max(0, D1 <= 0 ? 0 : y / D1));
    var p1e = easeInOutCubic(p1);
    var y2 = Math.max(0, y - D1);
    var qRaw = Math.min(1, Math.max(0, D2 <= 0 ? 0 : y2 / D2));
    var qe = easeInOutCubic(qRaw);

    var m = metrics();
    var bandH = m.vh - m.hh;
    var vw = m.vw;
    var targetW = vw * 0.5;
    var targetLeft = vw * 0.5;

    stage.style.setProperty("--p", String(p1e));
    stage.style.setProperty("--q", String(qe));
    setDarkFallbackClass(qe);

    if (qRaw <= 0.0001) {
      phase2Anchor = null;
      clearDockStyles();
    }

    if (qRaw > 0.0001) {
      if (!phase2Anchor) {
        var r = slot.getBoundingClientRect();
        phase2Anchor = {
          left: r.left,
          bottom: m.vh - r.bottom,
          w: r.width,
        };
      }

      slot.classList.add("is-docked");
      var curW = phase2Anchor.w + (targetW - phase2Anchor.w) * qe;
      var curLeft = phase2Anchor.left + (targetLeft - phase2Anchor.left) * qe;
      var curBottom = phase2Anchor.bottom * (1 - qe);

      slot.style.position = "fixed";
      slot.style.left = curLeft + "px";
      slot.style.right = "auto";
      slot.style.bottom = curBottom + "px";
      slot.style.top = "auto";
      slot.style.width = curW + "px";

      wrap.style.setProperty("--img-w", curW + "px");
      wrap.style.width = "100%";
      wrap.style.maxWidth = "none";
      wrap.style.marginTop = "0";
    } else {
      var baseW = m.compactW + (m.heroW - m.compactW) * (1 - p1e);
      var imgH = displayImgHeight(baseW);
      var mt0 = Math.max(0, (bandH - imgH) / 2);
      var mt1 = COMPACT_TOP_GAP;
      var mtCompact = mt0 * (1 - p1e) + mt1 * p1e;

      wrap.style.setProperty("--img-w", baseW + "px");
      wrap.style.marginTop = mtCompact + "px";
    }

    if (daizyOuter) {
      daizyOuter.classList.toggle("is-split-phase", qRaw > 0.02);
    }

    if (compassPanel) {
      compassPanel.style.pointerEvents = qe > 0.04 ? "auto" : "none";
    }

    var phVis = p1e * (1 - qe);
    if (placeholder) {
      placeholder.classList.toggle("is-interactive", phVis > 0.88 && qRaw < 0.06);
    }
  }

  function onScrollOrResize() {
    if (reduceMotion.matches) return;
    applyScroll();
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      onScrollOrResize();
    });
  }

  function initReducedMotion() {
    var m = metrics();
    var targetW = m.vw * 0.5;
    slot.classList.add("is-docked");
    slot.style.position = "fixed";
    slot.style.left = targetW + "px";
    slot.style.right = "auto";
    slot.style.bottom = "0";
    slot.style.top = "auto";
    slot.style.width = targetW + "px";

    wrap.style.setProperty("--img-w", targetW + "px");
    wrap.style.width = "100%";
    wrap.style.maxWidth = "none";
    wrap.style.marginTop = "0";

    stage.style.setProperty("--p", "1");
    stage.style.setProperty("--q", "1");
    setDarkFallbackClass(1);

    if (daizyOuter) {
      daizyOuter.classList.add("is-split-phase");
    }
    if (placeholder) {
      placeholder.classList.remove("is-interactive");
    }
    if (compassPanel) {
      compassPanel.style.pointerEvents = "auto";
    }
  }

  function onResize() {
    phase2Anchor = null;
    if (!reduceMotion.matches) {
      clearDockStyles();
      applyScroll();
    } else {
      initReducedMotion();
    }
  }

  if (img && !img.complete) {
    img.addEventListener("load", requestTick, { once: true });
  }

  if (reduceMotion.matches) {
    initReducedMotion();
  } else {
    applyScroll();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", onResize);
  }

  reduceMotion.addEventListener("change", function () {
    if (reduceMotion.matches) {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", onResize);
      phase2Anchor = null;
      initReducedMotion();
    } else {
      clearDockStyles();
      window.addEventListener("scroll", requestTick, { passive: true });
      window.addEventListener("resize", onResize);
      requestTick();
    }
  });
})();
