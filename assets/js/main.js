const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const revealItems = document.querySelectorAll(".reveal");
const primaryNavigation = document.querySelector("#primary-navigation");
const brandHomeLink =
  document.querySelector(".site-header .brand")?.getAttribute("href") || "index.html";
const mainScript =
  document.currentScript ||
  Array.from(document.scripts).find((script) => script.src.includes("assets/js/main.js"));
const mainScriptSrc = mainScript?.src || window.location.href;
const loaderCyanSrc = new URL("../images/logo/loader-cyan.png", mainScriptSrc).href;
const loaderMagentaSrc = new URL("../images/logo/loader-magenta.png", mainScriptSrc).href;
const loaderYellowSrc = new URL("../images/logo/loader-yellow.png", mainScriptSrc).href;
const loaderDarkSrc = new URL("../images/logo/loader-dark.png", mainScriptSrc).href;
const loaderWhiteSrc = new URL("../images/logo/loader-white.png", mainScriptSrc).href;
const loaderWord1Src = new URL("../images/logo/logo word 1.png", mainScriptSrc).href;
const loaderWord2Src = new URL("../images/logo/logo word 2.png", mainScriptSrc).href;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const navigationEntry =
  performance.getEntriesByType && performance.getEntriesByType("navigation")
    ? performance.getEntriesByType("navigation")[0]
    : null;
const navigationEntryType = navigationEntry?.type || "";
const previousLoaderMode = sessionStorage.getItem("app-loader-mode");
const previousLoaderTimestamp = Number(sessionStorage.getItem("app-loader-timestamp") || 0);
const arrivedFromPageTransition =
  previousLoaderMode === "page-transition" && Date.now() - previousLoaderTimestamp < 5000;
const arrivedFromServiceTransition =
  previousLoaderMode === "service-subpage-transition" &&
  Date.now() - previousLoaderTimestamp < 5000;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (arrivedFromPageTransition) {
  window.scrollTo(0, 0);
}

const setupHeaderColorLine = () => {
  if (!header) return;

  document.querySelector(".hero-color-line")?.remove();
  document.querySelector(".header-cmyk-badge")?.remove();

  header.classList.toggle("is-homepage", Boolean(document.querySelector(".video-hero")));

  if (header.querySelector(".site-color-line")) return;

  const colorLine = document.createElement("div");
  colorLine.className = "site-color-line";
  colorLine.setAttribute("aria-hidden", "true");
  colorLine.innerHTML = "<i></i><i></i><i></i><i></i>";
  header.prepend(colorLine);
};

const createPageLoader = () => {
  const existingLoader = document.querySelector(".page-loader");
  if (existingLoader) return existingLoader;

  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = `
    <div class="page-loader__inner">
      <div class="page-loader__brand">
        <div class="page-loader__mark-wrap">
          <div class="page-loader__mark-stage" aria-hidden="true">
            <img class="page-loader__layer page-loader__layer--cyan" src="${loaderCyanSrc}" alt="">
            <img class="page-loader__layer page-loader__layer--magenta" src="${loaderMagentaSrc}" alt="">
            <img class="page-loader__layer page-loader__layer--yellow" src="${loaderYellowSrc}" alt="">
            <img class="page-loader__layer page-loader__layer--dark" src="${loaderDarkSrc}" alt="">
            <img class="page-loader__layer page-loader__layer--white" src="${loaderWhiteSrc}" alt="">
          </div>
        </div>
        <div class="page-loader__wordmark-wrap">
          <div class="page-loader__wordmark-mask page-loader__wordmark-mask--primary">
            <img class="page-loader__wordmark-image" src="${loaderWord1Src}" alt="Ali Print Pack (PVT.) Ltd.">
          </div>
          <div class="page-loader__wordmark-mask page-loader__wordmark-mask--secondary">
            <img class="page-loader__wordmark-image" src="${loaderWord2Src}" alt="House of Printing & Packaging">
          </div>
        </div>
      </div>
      <span class="page-loader__line"></span>
    </div>
  `;

  document.body.append(loader);
  return loader;
};

const pageLoader = createPageLoader();

const createServiceTransitionOverlay = () => {
  const existingOverlay = document.querySelector(".service-transition");
  if (existingOverlay) return existingOverlay;

  const overlay = document.createElement("div");
  overlay.className = "service-transition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="service-transition__inner">
      <div class="service-transition__pill">
        <span class="service-transition__segment service-transition__segment--cyan"></span>
        <span class="service-transition__segment service-transition__segment--magenta"></span>
        <span class="service-transition__segment service-transition__segment--yellow"></span>
        <span class="service-transition__segment service-transition__segment--black"></span>
      </div>
    </div>
  `;

  document.body.append(overlay);
  return overlay;
};

const serviceTransitionOverlay = createServiceTransitionOverlay();

const showPageLoader = (animate = true) => {
  if (!pageLoader) return;
  pageLoader.classList.add("is-instant");
  document.body.classList.add("page-loader-active");
  pageLoader.classList.toggle("is-cover", !animate);
  pageLoader.classList.add("is-visible");
  void pageLoader.offsetWidth;
  document.documentElement.classList.remove("page-preload");
  pageLoader.classList.remove("is-animating");
  if (animate) {
    void pageLoader.offsetWidth;
    pageLoader.classList.add("is-animating");
  }
  window.requestAnimationFrame(() => {
    pageLoader.classList.remove("is-instant");
  });
};

const hidePageLoader = () => {
  if (!pageLoader) return;
  document.documentElement.classList.remove("page-preload");
  pageLoader.classList.remove("is-visible", "is-animating", "is-cover", "is-instant");
  document.body.classList.remove("page-loader-active");
};

const showServiceTransition = () => {
  if (!serviceTransitionOverlay) return;
  serviceTransitionOverlay.classList.add("is-instant");
  document.body.classList.add("service-transition-active");
  serviceTransitionOverlay.classList.add("is-visible");
  void serviceTransitionOverlay.offsetWidth;
  document.documentElement.classList.remove("page-preload");
  serviceTransitionOverlay.classList.remove("is-animating");
  void serviceTransitionOverlay.offsetWidth;
  serviceTransitionOverlay.classList.add("is-animating");
  window.requestAnimationFrame(() => {
    serviceTransitionOverlay.classList.remove("is-instant");
  });
};

const hideServiceTransition = () => {
  if (!serviceTransitionOverlay) return;
  document.documentElement.classList.remove("page-preload");
  serviceTransitionOverlay.classList.remove("is-visible", "is-animating", "is-instant");
  document.body.classList.remove("service-transition-active");
};

const normalizePagePath = (pathname) =>
  pathname.replace(/\/index\.html$/i, "/").replace(/\/{2,}/g, "/");

const isServiceAreaPath = (pathname) => normalizePagePath(pathname).includes("/services/");

const isServiceDetailPath = (pathname) => /\/services\/[^/]+\/$/i.test(normalizePagePath(pathname));

const arrivedFromServiceHistoryNavigation =
  navigationEntryType === "back_forward" && isServiceAreaPath(window.location.pathname);

const hasServiceAreaReferrer = () => {
  if (!document.referrer) return false;

  try {
    const referrerUrl = new URL(document.referrer, window.location.href);
    return (
      referrerUrl.origin === window.location.origin &&
      isServiceAreaPath(referrerUrl.pathname) &&
      referrerUrl.href !== window.location.href
    );
  } catch (error) {
    return false;
  }
};

const shouldUseServiceSubpageTransition = (currentUrl, destinationUrl) =>
  isServiceAreaPath(currentUrl.pathname) &&
  isServiceAreaPath(destinationUrl.pathname) &&
  (isServiceDetailPath(currentUrl.pathname) || isServiceDetailPath(destinationUrl.pathname));

const setupServiceBackButton = () => {
  if (!isServiceDetailPath(window.location.pathname)) return;
  if (document.querySelector(".service-back-button")) return;

  const fallbackUrl = new URL("../index.html", window.location.href);
  const button = document.createElement("a");
  button.className = "service-back-button";
  button.href = fallbackUrl.href;
  button.setAttribute("aria-label", "Back to Services & Products");
  button.innerHTML = `
    <span class="service-back-button__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="service-back-button__text">Back to Services</span>
  `;

  button.addEventListener("click", (event) => {
    if (hasServiceAreaReferrer()) {
      event.preventDefault();
      closeMenu();
      history.back();
    }
  });

  document.body.append(button);
};

const setupPageLoader = () => {
  sessionStorage.removeItem("app-loader-mode");
  sessionStorage.removeItem("app-loader-timestamp");

  if (arrivedFromServiceTransition) {
    document.documentElement.classList.remove("page-preload");

    window.addEventListener("load", () => {
      window.scrollTo(0, 0);
      updateHeader();
      hideServiceTransition();
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) hideServiceTransition();
    });

    return;
  }

  if (arrivedFromServiceHistoryNavigation) {
    showServiceTransition();

    const quickHideDelay = reducedMotionQuery.matches ? 80 : 340;

    window.addEventListener("load", () => {
      window.scrollTo(0, 0);
      updateHeader();
      window.setTimeout(hideServiceTransition, quickHideDelay);
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        window.scrollTo(0, 0);
        hideServiceTransition();
      }
    });

    return;
  }

  showPageLoader(true);

  const hideDelay = reducedMotionQuery.matches ? 120 : arrivedFromPageTransition ? 2920 : 2780;

  window.addEventListener("load", () => {
    if (arrivedFromPageTransition) {
      window.scrollTo(0, 0);
      updateHeader();
    }
    window.setTimeout(hidePageLoader, hideDelay);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) hidePageLoader();
  });
};

const setupPageTransitions = () => {
  let isNavigating = false;

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest("a[href]");
    if (!link || isNavigating) return;

    const rawHref = link.getAttribute("href");
    if (
      !rawHref ||
      rawHref.startsWith("#") ||
      rawHref.startsWith("mailto:") ||
      rawHref.startsWith("tel:") ||
      rawHref.startsWith("javascript:")
    ) {
      return;
    }

    if (link.hasAttribute("download")) return;
    if (link.target && link.target.toLowerCase() !== "_self") return;

    const destination = new URL(link.href, window.location.href);
    const current = new URL(window.location.href);

    if (destination.origin !== current.origin) return;
    if (destination.pathname === current.pathname && destination.search === current.search) {
      if (destination.hash) return;
      if (destination.href === current.href) return;
    }

    isNavigating = true;
    event.preventDefault();
    closeMenu();
    const useServiceTransition = shouldUseServiceSubpageTransition(current, destination);

    if (useServiceTransition) {
      showServiceTransition();
      sessionStorage.setItem("app-loader-mode", "service-subpage-transition");
    } else {
      showPageLoader(false);
      sessionStorage.setItem("app-loader-mode", "page-transition");
    }
    sessionStorage.setItem("app-loader-timestamp", String(Date.now()));

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, reducedMotionQuery.matches ? 60 : useServiceTransition ? 220 : 180);
  });
};

if (primaryNavigation && !primaryNavigation.querySelector(".nav-home")) {
  const homeLink = document.createElement("a");
  homeLink.className = "nav-home";
  homeLink.href = brandHomeLink;
  homeLink.setAttribute("aria-label", "Home");
  homeLink.innerHTML =
    '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z"/></svg><span>Home</span>';
  if (location.pathname.endsWith("/") || location.pathname.endsWith("/index.html")) {
    const normalizedPath = location.pathname.replace(/index\.html$/, "");
    if (normalizedPath === "/" || normalizedPath.endsWith("/ali-print-pack-website/")) {
      homeLink.classList.add("active");
    }
  }
  primaryNavigation.prepend(homeLink);
}

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

const setupBrandLoop = () => {
  const showcase = document.querySelector(".brand-loop-showcase");
  if (!showcase) return;

  const stage = showcase.querySelector(".brand-loop-stage");
  const track = showcase.querySelector(".brand-loop-track");
  const cards = Array.from(showcase.querySelectorAll(".brand-loop-card"));
  const controlButtons = Array.from(showcase.querySelectorAll("[data-brand-loop-dir]"));
  if (!stage || !track || !cards.length) return;

  const state = {
    frameId: 0,
    lastProgress: 0,
    lastTimestamp: 0,
    stepSpacing: 0,
    edgeLift: 0,
    sideTilt: 0,
    speed: 0.0009,
    resumeTimer: 0,
  };

  const updateMetrics = () => {
    const stageWidth = stage.clientWidth;
    state.stepSpacing = stageWidth < 760 ? 182 : 232;
    state.edgeLift = stageWidth < 760 ? 20 : 28;
    state.sideTilt = stageWidth < 760 ? 18 : 24;
    state.speed = stageWidth < 760 ? 0.00032 : 0.0004;
  };

  const normalizeProgress = (value) => {
    const count = cards.length;
    return ((value % count) + count) % count;
  };

  const pauseAutoMotion = () => {
    window.clearTimeout(state.resumeTimer);
    state.resumeTimer = window.setTimeout(() => {
      state.lastTimestamp = 0;
    }, 1400);
  };

  const nudgeProgress = (delta) => {
    state.lastProgress = normalizeProgress(state.lastProgress + delta);
    renderCards(state.lastProgress);
    pauseAutoMotion();
  };

  const wrapDistance = (value, count) => {
    let distance = value % count;
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    return distance;
  };

  const renderCards = (progress) => {
    const count = cards.length;

    cards.forEach((card, index) => {
      const relative = wrapDistance(index - progress, count);
      const absRelative = Math.abs(relative);
      let x = relative * state.stepSpacing;
      let y = 0;
      let scale = 0;
      let opacity = 0;
      let rotateY = 0;
      const direction = Math.sign(relative) || 1;

      if (absRelative <= 0.5) {
        const t = absRelative / 0.5;
        x = direction * absRelative * state.stepSpacing * 2.05;
        y = t * 6;
        scale = 1 - t * 0.18;
        opacity = 1;
        rotateY = -relative * 8;
      } else if (absRelative <= 1.5) {
        const t = absRelative - 0.5;
        x = direction * (state.stepSpacing * (1.02 + t * 0.9));
        y = 6 + t * state.edgeLift;
        scale = 0.82 - t * 0.24;
        opacity = 0.94 - t * 0.2;
        rotateY = -direction * (8 + t * state.sideTilt);
      } else if (absRelative <= 2.5) {
        const t = absRelative - 1.5;
        x = direction * (state.stepSpacing * (1.92 + t * 0.82));
        y = state.edgeLift + 6 + t * (state.edgeLift + 10);
        scale = 0.58 - t * 0.22;
        opacity = 0.74 - t * 0.46;
        rotateY = -direction * (state.sideTilt + 10 + t * 10);
      } else if (absRelative <= 3.7) {
        const t = absRelative - 2.5;
        x = direction * (state.stepSpacing * (2.74 + t * 0.64));
        y = state.edgeLift * 2 + 16 + t * 16;
        scale = 0.36 - t * 0.14;
        opacity = 0.28 - t * 0.16;
        rotateY = -direction * (state.sideTilt + 20 + t * 12);
      } else if (absRelative <= 4.6) {
        const t = absRelative - 3.7;
        x = direction * (state.stepSpacing * (3.5 + t * 0.6));
        y = state.edgeLift * 2 + 34 + t * 14;
        scale = 0.2 - t * 0.08;
        opacity = 0.12 - t * 0.07;
        rotateY = -direction * (state.sideTilt + 34 + t * 8);
      } else if (absRelative <= 5.25) {
        const t = (absRelative - 4.6) / 0.65;
        x = direction * (state.stepSpacing * (4.04 + t * 0.56));
        y = state.edgeLift * 2 + 46 + t * 12;
        scale = 0.12 - t * 0.05;
        opacity = 0.05 - t * 0.05;
        rotateY = -direction * (state.sideTilt + 42 + t * 6);
      }

      card.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${Math.max(scale, 0.01).toFixed(3)})`;
      card.style.opacity = Math.max(opacity, 0).toFixed(3);
      card.style.zIndex = String(Math.max(1, 100 - Math.round(absRelative * 20)));
      card.style.pointerEvents = opacity > 0.12 ? "auto" : "none";
    });
  };

  const animate = (timestamp) => {
    if (!state.lastTimestamp) state.lastTimestamp = timestamp;
    const delta = timestamp - state.lastTimestamp;
    state.lastTimestamp = timestamp;
    state.lastProgress = normalizeProgress(state.lastProgress + delta * state.speed);
    renderCards(state.lastProgress);
    if (!reducedMotionQuery.matches) {
      state.frameId = window.requestAnimationFrame(animate);
    }
  };

  const refresh = () => {
    updateMetrics();
    renderCards(state.lastProgress);
  };

  updateMetrics();
  renderCards(0);

  if (!reducedMotionQuery.matches) {
    state.frameId = window.requestAnimationFrame(animate);
  }

  const handleMotionChange = () => {
    window.cancelAnimationFrame(state.frameId);
    state.lastTimestamp = 0;
    refresh();
    if (!reducedMotionQuery.matches) {
      state.frameId = window.requestAnimationFrame(animate);
    }
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleMotionChange);
  }

  showcase.addEventListener(
    "wheel",
    (event) => {
      const scrollDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(scrollDelta) < 2) return;
      event.preventDefault();
      nudgeProgress(scrollDelta / 360);
    },
    { passive: false }
  );

  controlButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.brandLoopDir || 0);
      if (!direction) return;
      nudgeProgress(direction * 0.9);
    });
  });

  window.addEventListener("resize", refresh);
};

const setupCopyButtons = () => {
  const copyButtons = document.querySelectorAll("[data-copy-text]");
  if (!copyButtons.length) return;

  copyButtons.forEach((button) => {
    let resetTimer = 0;

    button.addEventListener("click", async () => {
      const copyText = button.dataset.copyText;
      if (!copyText) return;

      try {
        await navigator.clipboard.writeText(copyText);
        const textTarget = button.querySelector("span");
        if (!textTarget) return;

        window.clearTimeout(resetTimer);
        textTarget.textContent = button.dataset.copySuccess || "Copied";
        button.classList.add("is-copied");

        resetTimer = window.setTimeout(() => {
          textTarget.textContent = button.dataset.copyDefault || copyText;
          button.classList.remove("is-copied");
        }, 1800);
      } catch (error) {
        console.error("Copy failed", error);
      }
    });
  });
};

const buildFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return "";
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};

const setupQuoteCountryPhone = () => {
  const countrySelect = document.querySelector("[data-country-select]");
  const phoneCodeInput = document.querySelector("[data-phone-code-input]");
  const phoneLocalInput = document.querySelector("[data-phone-local-input]");
  const phoneFullInput = document.querySelector("[data-phone-full-input]");
  if (!countrySelect || !phoneCodeInput || !phoneLocalInput || !phoneFullInput) return;

  const countryApi =
    window.intlTelInput && typeof window.intlTelInput.getCountryData === "function"
      ? window.intlTelInput
      : window.intlTelInputGlobals &&
          typeof window.intlTelInputGlobals.getCountryData === "function"
        ? window.intlTelInputGlobals
        : null;
  if (!countryApi) return;

  const countryNameInput = document.querySelector("[data-country-name]");
  const countryIsoInput = document.querySelector("[data-country-iso]");
  const countryDialCodeInput = document.querySelector("[data-country-dial-code]");
  const countries = countryApi
    .getCountryData()
    .filter((country) => country.iso2 && country.dialCode && country.name);

  const phonePlaceholders = {
    pk: "XXXXXXXXXX",
    us: "XXXXXXXXXX",
    gb: "XXXXXXXXXX",
    ae: "XXXXXXXXX",
    sa: "XXXXXXXXX",
    qa: "XXXXXXXX",
    kw: "XXXXXXXX",
    om: "XXXXXXXX",
    bh: "XXXXXXXX",
    de: "XXXXXXXXXX",
    fr: "XXXXXXXXX",
    it: "XXXXXXXXXX",
    es: "XXXXXXXXX",
    cn: "XXXXXXXXXXX",
    in: "XXXXXXXXXX",
  };

  countrySelect.innerHTML = "";

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.name;
    option.textContent = `${buildFlagEmoji(country.iso2)} ${country.name} (+${country.dialCode})`;
    option.dataset.iso2 = country.iso2;
    option.dataset.dialCode = country.dialCode;
    countrySelect.append(option);
  });

  const applyCountry = (iso2, forcePrefix = false) => {
    const selectedCountry =
      countries.find((country) => country.iso2 === iso2) ||
      countries.find((country) => country.iso2 === "pk") ||
      countries[0];
    if (!selectedCountry) return;

    const selectedOption = Array.from(countrySelect.options).find(
      (option) => option.dataset.iso2 === selectedCountry.iso2
    );
    if (selectedOption) countrySelect.value = selectedOption.value;

    if (countryNameInput) countryNameInput.value = selectedCountry.name;
    if (countryIsoInput) countryIsoInput.value = selectedCountry.iso2;
    if (countryDialCodeInput) countryDialCodeInput.value = `+${selectedCountry.dialCode}`;
    phoneCodeInput.value = `+${selectedCountry.dialCode}`;
    phoneLocalInput.placeholder = phonePlaceholders[selectedCountry.iso2] || "XXXXXXXXXX";
    if (forcePrefix && !phoneLocalInput.value.trim()) {
      phoneFullInput.value = `+${selectedCountry.dialCode}`;
    } else {
      phoneFullInput.value = phoneLocalInput.value.trim()
        ? `+${selectedCountry.dialCode} ${phoneLocalInput.value.trim()}`
        : `+${selectedCountry.dialCode}`;
    }
  };

  const initialIso =
    countryIsoInput?.value?.toLowerCase() ||
    countrySelect.getAttribute("value") ||
    countrySelect.dataset.initialCountry ||
    "pk";

  applyCountry(initialIso, false);

  countrySelect.addEventListener("change", () => {
    const selectedIso = countrySelect.selectedOptions[0]?.dataset.iso2 || "pk";
    applyCountry(selectedIso, true);
    phoneLocalInput.focus();
  });

  phoneLocalInput.addEventListener("input", () => {
    phoneLocalInput.value = phoneLocalInput.value.replace(/[^\d\s-]/g, "");
    const currentDialCode = countryDialCodeInput?.value || phoneCodeInput.value;
    phoneFullInput.value = phoneLocalInput.value.trim()
      ? `${currentDialCode} ${phoneLocalInput.value.trim()}`
      : currentDialCode;
  });
};

const setupFutureServicesModal = () => {
  const modal = document.querySelector("[data-future-modal]");
  if (!modal) return;

  const title = modal.querySelector("#future-service-title");
  const copy = modal.querySelector("[data-future-modal-copy]");
  const triggers = document.querySelectorAll("[data-future-service]");
  const closeControls = modal.querySelectorAll("[data-future-modal-close]");

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  const openModal = (serviceName, serviceCopy) => {
    if (title) title.textContent = serviceName;
    if (copy) copy.textContent = serviceCopy;
    modal.hidden = false;
    document.body.classList.add("modal-open");
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(
        trigger.getAttribute("data-future-service") || "Upcoming capability",
        trigger.getAttribute("data-future-copy") ||
          "We are currently developing this capability as part of our future production expansion."
      );
    });
  });

  closeControls.forEach((control) => {
    control.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
};

const closeMenu = () => {
  if (!menuButton || !menu) return;
  menuButton.setAttribute("aria-expanded", "false");
  menu.classList.remove("open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menu?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) closeMenu();
});

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

setupHeaderColorLine();
updateHeader();
setupPageLoader();
setupPageTransitions();
setupBrandLoop();
setupServiceBackButton();
setupCopyButtons();
setupQuoteCountryPhone();
setupFutureServicesModal();
