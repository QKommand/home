/* =========================================================
   COMMANDER Q
   Simplified homepage interactions
   ========================================================= */

"use strict";


/* -----------------------------
   Mobile navigation
------------------------------ */

const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");
const navigationLinks = document.querySelectorAll(".site-nav a");

function openMenu() {
  if (!menuToggle || !siteNavigation) {
    return;
  }

  menuToggle.classList.add("is-open");
  siteNavigation.classList.add("is-open");
  document.body.classList.add("menu-open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation");
}

function closeMenu() {
  if (!menuToggle || !siteNavigation) {
    return;
  }

  menuToggle.classList.remove("is-open");
  siteNavigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

function toggleMenu() {
  if (!siteNavigation) {
    return;
  }

  const isOpen = siteNavigation.classList.contains("is-open");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuToggle && siteNavigation) {
  menuToggle.addEventListener("click", toggleMenu);

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedMenu =
      siteNavigation.contains(event.target);

    const clickedToggle =
      menuToggle.contains(event.target);

    if (
      siteNavigation.classList.contains("is-open") &&
      !clickedMenu &&
      !clickedToggle
    ) {
      closeMenu();
    }
  });
}


/* -----------------------------
   Reduced motion preference
------------------------------ */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* -----------------------------
   Scroll reveal
------------------------------ */

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}


/* -----------------------------
   Smooth internal navigation
------------------------------ */

const internalLinks = document.querySelectorAll(
  'a[href^="#"]'
);

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });
});


/* -----------------------------
   Subtle header shadow
------------------------------ */

const siteHeader = document.querySelector(".site-header");

function updateHeaderShadow() {
  if (!siteHeader) {
    return;
  }

  if (window.scrollY > 16) {
    siteHeader.style.boxShadow =
      "0 12px 28px rgba(0, 0, 0, 0.24)";
  } else {
    siteHeader.style.boxShadow = "none";
  }
}

window.addEventListener(
  "scroll",
  updateHeaderShadow,
  { passive: true }
);

updateHeaderShadow();


/* -----------------------------
   Animated starfield
------------------------------ */

const starfieldCanvas = document.getElementById("starfield");

if (starfieldCanvas) {
  const context = starfieldCanvas.getContext("2d");

  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  let stars = [];
  let animationFrameId;
  let previousTime = performance.now();
  let resizeTimer;

  const STAR_DENSITY = 0.00009;
  const MIN_STARS = 45;
  const MAX_STARS = 150;

  class Star {
    constructor() {
      this.reset(true);
    }

    reset(initialPlacement = false) {
      this.x = Math.random() * canvasWidth;

      this.y = initialPlacement
        ? Math.random() * canvasHeight
        : canvasHeight + 8;

      this.radius = Math.random() * 1 + 0.25;
      this.speed = Math.random() * 0.018 + 0.006;
      this.opacity = Math.random() * 0.5 + 0.16;
      this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      this.fadeSpeed = Math.random() * 0.0007 + 0.0002;

      this.color =
        Math.random() > 0.86
          ? "199, 156, 255"
          : "255, 255, 255";
    }

    update(deltaTime) {
      this.y -= this.speed * deltaTime;

      this.opacity +=
        this.fadeDirection *
        this.fadeSpeed *
        deltaTime;

      if (this.opacity >= 0.72) {
        this.opacity = 0.72;
        this.fadeDirection = -1;
      }

      if (this.opacity <= 0.12) {
        this.opacity = 0.12;
        this.fadeDirection = 1;
      }

      if (this.y < -6) {
        this.reset();
      }
    }

    draw() {
      context.beginPath();

      context.arc(
        this.x,
        this.y,
        this.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        `rgba(${this.color}, ${this.opacity})`;

      context.fill();
    }
  }

  function getStarCount() {
    const estimatedCount =
      canvasWidth *
      canvasHeight *
      STAR_DENSITY;

    return Math.min(
      Math.max(Math.floor(estimatedCount), MIN_STARS),
      MAX_STARS
    );
  }

  function createStars() {
    stars = Array.from(
      { length: getStarCount() },
      () => new Star()
    );
  }

  function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    starfieldCanvas.width =
      canvasWidth * pixelRatio;

    starfieldCanvas.height =
      canvasHeight * pixelRatio;

    starfieldCanvas.style.width =
      `${canvasWidth}px`;

    starfieldCanvas.style.height =
      `${canvasHeight}px`;

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    createStars();
  }

  function drawStaticStarfield() {
    context.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    stars.forEach((star) => {
      star.draw();
    });
  }

  function animateStarfield(currentTime) {
    const deltaTime = Math.min(
      currentTime - previousTime,
      40
    );

    previousTime = currentTime;

    context.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    stars.forEach((star) => {
      star.update(deltaTime);
      star.draw();
    });

    animationFrameId =
      requestAnimationFrame(animateStarfield);
  }

  function startStarfield() {
    resizeCanvas();

    if (prefersReducedMotion) {
      drawStaticStarfield();
      return;
    }

    animationFrameId =
      requestAnimationFrame(animateStarfield);
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      resizeCanvas();

      if (prefersReducedMotion) {
        drawStaticStarfield();
      }
    }, 160);
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (prefersReducedMotion) {
        return;
      }

      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        previousTime = performance.now();

        animationFrameId =
          requestAnimationFrame(animateStarfield);
      }
    }
  );

  startStarfield();
}