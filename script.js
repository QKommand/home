/* =========================================================
   COMMANDER Q HOMEPAGE
   Main JavaScript
   ========================================================= */

"use strict";


/* -----------------------------
   1. Mobile navigation
------------------------------ */

const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");
const navigationLinks = document.querySelectorAll(".site-nav a");

function openMenu() {
  menuToggle.classList.add("is-open");
  siteNavigation.classList.add("is-open");
  document.body.classList.add("menu-open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation");
}

function closeMenu() {
  menuToggle.classList.remove("is-open");
  siteNavigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

function toggleMenu() {
  const menuIsOpen = siteNavigation.classList.contains("is-open");

  if (menuIsOpen) {
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
    const clickedInsideNavigation =
      siteNavigation.contains(event.target);

    const clickedMenuButton =
      menuToggle.contains(event.target);

    if (
      siteNavigation.classList.contains("is-open") &&
      !clickedInsideNavigation &&
      !clickedMenuButton
    ) {
      closeMenu();
    }
  });
}


/* -----------------------------
   2. Scroll reveal animations
------------------------------ */

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

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
   3. Animated starfield
------------------------------ */

const starfieldCanvas = document.getElementById("starfield");

if (starfieldCanvas) {
  const context = starfieldCanvas.getContext("2d");

  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let devicePixelRatio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  let animationFrameId;
  let stars = [];
  let shootingStars = [];

  const STAR_DENSITY = 0.00013;
  const MAX_STARS_MOBILE = 100;
  const MAX_STARS_DESKTOP = 220;

  class Star {
    constructor() {
      this.reset(true);
    }

    reset(initialPlacement = false) {
      this.x = Math.random() * canvasWidth;

      this.y = initialPlacement
        ? Math.random() * canvasHeight
        : canvasHeight + Math.random() * 30;

      this.radius = Math.random() * 1.25 + 0.25;

      this.speed = Math.random() * 0.055 + 0.012;

      this.opacity = Math.random() * 0.65 + 0.18;

      this.twinkleSpeed =
        Math.random() * 0.012 + 0.003;

      this.twinkleDirection =
        Math.random() > 0.5 ? 1 : -1;

      this.color =
        Math.random() > 0.82
          ? "190, 143, 255"
          : "255, 255, 255";
    }

    update(deltaTime) {
      this.y -= this.speed * deltaTime;

      this.opacity +=
        this.twinkleSpeed *
        this.twinkleDirection *
        deltaTime *
        0.05;

      if (this.opacity >= 0.9) {
        this.opacity = 0.9;
        this.twinkleDirection = -1;
      }

      if (this.opacity <= 0.12) {
        this.opacity = 0.12;
        this.twinkleDirection = 1;
      }

      if (this.y < -10) {
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

      if (this.radius > 1.1) {
        context.beginPath();

        context.arc(
          this.x,
          this.y,
          this.radius * 3,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          `rgba(${this.color}, ${this.opacity * 0.06})`;

        context.fill();
      }
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x =
        Math.random() * canvasWidth * 0.75;

      this.y =
        Math.random() * canvasHeight * 0.35;

      this.length =
        Math.random() * 90 + 70;

      this.speed =
        Math.random() * 0.28 + 0.18;

      this.opacity =
        Math.random() * 0.35 + 0.25;

      this.active = false;

      this.delay =
        Math.random() * 14000 + 7000;

      this.lastReset = performance.now();
    }

    update(deltaTime, currentTime) {
      if (!this.active) {
        if (currentTime - this.lastReset > this.delay) {
          this.active = true;
        }

        return;
      }

      this.x += this.speed * deltaTime;
      this.y += this.speed * 0.38 * deltaTime;
      this.opacity -= deltaTime * 0.00035;

      if (
        this.opacity <= 0 ||
        this.x > canvasWidth + this.length ||
        this.y > canvasHeight
      ) {
        this.reset();
      }
    }

    draw() {
      if (!this.active) {
        return;
      }

      const gradient = context.createLinearGradient(
        this.x,
        this.y,
        this.x - this.length,
        this.y - this.length * 0.38
      );

      gradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${this.opacity})`
      );

      gradient.addColorStop(
        0.35,
        `rgba(198, 150, 255, ${this.opacity * 0.7})`
      );

      gradient.addColorStop(
        1,
        "rgba(198, 150, 255, 0)"
      );

      context.beginPath();

      context.moveTo(this.x, this.y);

      context.lineTo(
        this.x - this.length,
        this.y - this.length * 0.38
      );

      context.strokeStyle = gradient;
      context.lineWidth = 1.2;
      context.stroke();
    }
  }

  function calculateStarCount() {
    const calculatedCount =
      canvasWidth *
      canvasHeight *
      STAR_DENSITY;

    const isMobile = canvasWidth < 700;

    const maximumCount = isMobile
      ? MAX_STARS_MOBILE
      : MAX_STARS_DESKTOP;

    return Math.min(
      Math.max(Math.floor(calculatedCount), 65),
      maximumCount
    );
  }

  function createStars() {
    const starCount = calculateStarCount();

    stars = Array.from(
      { length: starCount },
      () => new Star()
    );

    shootingStars = [
      new ShootingStar(),
      new ShootingStar()
    ];
  }

  function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    starfieldCanvas.width =
      canvasWidth * devicePixelRatio;

    starfieldCanvas.height =
      canvasHeight * devicePixelRatio;

    starfieldCanvas.style.width =
      `${canvasWidth}px`;

    starfieldCanvas.style.height =
      `${canvasHeight}px`;

    context.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );

    createStars();
  }

  let previousTime = performance.now();

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

    shootingStars.forEach((shootingStar) => {
      shootingStar.update(
        deltaTime,
        currentTime
      );

      shootingStar.draw();
    });

    animationFrameId =
      requestAnimationFrame(animateStarfield);
  }

  function startStarfield() {
    resizeCanvas();

    if (!prefersReducedMotion) {
      animationFrameId =
        requestAnimationFrame(animateStarfield);
    } else {
      stars.forEach((star) => star.draw());
    }
  }

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      resizeCanvas();
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


/* -----------------------------
   4. Demo music player
------------------------------ */

const playButton = document.querySelector(".play-button");
const progressBar = document.querySelector(".progress span");

let isPlaying = false;
let progressValue = 48;
let playbackTimer;

function updatePlayer() {
  if (!playButton) {
    return;
  }

  if (isPlaying) {
    playButton.textContent = "❚❚";
    playButton.setAttribute(
      "aria-label",
      "Pause featured track"
    );
  } else {
    playButton.textContent = "▶";
    playButton.setAttribute(
      "aria-label",
      "Play featured track"
    );
  }
}

function startDemoPlayback() {
  clearInterval(playbackTimer);

  playbackTimer = setInterval(() => {
    if (!isPlaying) {
      return;
    }

    progressValue += 0.25;

    if (progressValue >= 100) {
      progressValue = 0;
    }

    if (progressBar) {
      progressBar.style.width =
        `${progressValue}%`;
    }
  }, 250);
}

if (playButton) {
  playButton.addEventListener("click", () => {
    isPlaying = !isPlaying;

    updatePlayer();

    if (isPlaying) {
      startDemoPlayback();
    } else {
      clearInterval(playbackTimer);
    }
  });
}


/* -----------------------------
   5. Header shadow on scroll
------------------------------ */

const siteHeader = document.querySelector(".site-header");

function updateHeader() {
  if (!siteHeader) {
    return;
  }

  const hasScrolled = window.scrollY > 20;

  siteHeader.style.boxShadow = hasScrolled
    ? "0 14px 35px rgba(0, 0, 0, 0.28)"
    : "none";
}

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();


/* -----------------------------
   6. Gentle card tilt on desktop
------------------------------ */

const interactiveCards = document.querySelectorAll(
  ".feature-card, .content-card"
);

const supportsHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

if (supportsHover && !prefersReducedMotion) {
  interactiveCards.forEach((card) => {
    card.addEventListener(
      "mousemove",
      (event) => {
        const bounds =
          card.getBoundingClientRect();

        const mouseX =
          event.clientX - bounds.left;

        const mouseY =
          event.clientY - bounds.top;

        const centerX =
          bounds.width / 2;

        const centerY =
          bounds.height / 2;

        const rotationX =
          ((mouseY - centerY) / centerY) * -1.2;

        const rotationY =
          ((mouseX - centerX) / centerX) * 1.2;

        card.style.transform =
          `translateY(-5px)
           perspective(900px)
           rotateX(${rotationX}deg)
           rotateY(${rotationY}deg)`;
      }
    );

    card.addEventListener(
      "mouseleave",
      () => {
        card.style.transform = "";
      }
    );
  });
}


/* -----------------------------
   7. Smooth internal links
------------------------------ */

const internalLinks = document.querySelectorAll(
  'a[href^="#"]'
);

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId =
      link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const targetElement =
      document.querySelector(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion
        ? "auto"
        : "smooth",

      block: "start"
    });
  });
});