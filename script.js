/* =========================================================
   COMMANDER Q
   Simplified homepage interactions
   ========================================================= */

"use strict";


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
   Header shadow
------------------------------ */

const siteHeader = document.querySelector(".site-header");

function updateHeaderShadow() {
  if (!siteHeader) {
    return;
  }

  siteHeader.style.boxShadow =
    window.scrollY > 16
      ? "0 12px 28px rgba(0, 0, 0, 0.24)"
      : "none";
}

window.addEventListener(
  "scroll",
  updateHeaderShadow,
  { passive: true }
);

updateHeaderShadow();


/* -----------------------------
   Starfield and occasional comet
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
  let comet = null;
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

  class Comet {
    constructor() {
      this.reset();
    }

    reset() {
      this.active = false;

      this.x = -180;
      this.y = Math.random() * canvasHeight * 0.45 + 20;

      this.length = Math.random() * 100 + 120;
      this.speed = Math.random() * 0.18 + 0.22;
      this.angle = Math.random() * 0.16 + 0.22;
      this.opacity = 0;

      this.delay = Math.random() * 14000 + 9000;
      this.lastReset = performance.now();
    }

    update(deltaTime, currentTime) {
      if (!this.active) {
        if (currentTime - this.lastReset >= this.delay) {
          this.active = true;
          this.opacity = 0.72;
        }

        return;
      }

      this.x += this.speed * deltaTime;
      this.y += this.speed * this.angle * deltaTime;

      if (this.x > canvasWidth + this.length) {
        this.reset();
      }
    }

    draw() {
      if (!this.active) {
        return;
      }

      const tailX = this.x - this.length;
      const tailY = this.y - this.length * this.angle;

      const gradient = context.createLinearGradient(
        this.x,
        this.y,
        tailX,
        tailY
      );

      gradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${this.opacity})`
      );

      gradient.addColorStop(
        0.18,
        `rgba(220, 184, 255, ${this.opacity * 0.8})`
      );

      gradient.addColorStop(
        1,
        "rgba(158, 104, 216, 0)"
      );

      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(tailX, tailY);

      context.strokeStyle = gradient;
      context.lineWidth = 1.4;
      context.lineCap = "round";
      context.stroke();

      context.beginPath();

      context.arc(
        this.x,
        this.y,
        1.7,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        `rgba(255, 255, 255, ${this.opacity})`;

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

  function createSky() {
    stars = Array.from(
      { length: getStarCount() },
      () => new Star()
    );

    comet = new Comet();
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

    createSky();
  }

  function drawStaticSky() {
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

  function animateSky(currentTime) {
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

    if (comet) {
      comet.update(deltaTime, currentTime);
      comet.draw();
    }

    animationFrameId =
      requestAnimationFrame(animateSky);
  }

  function startSky() {
    resizeCanvas();

    if (prefersReducedMotion) {
      drawStaticSky();
      return;
    }

    animationFrameId =
      requestAnimationFrame(animateSky);
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      resizeCanvas();

      if (prefersReducedMotion) {
        drawStaticSky();
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
          requestAnimationFrame(animateSky);
      }
    }
  );

  startSky();
}