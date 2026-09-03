const rail = document.querySelector("#portfolioRail");
const panels = Array.from(document.querySelectorAll(".panel"));
const navDots = Array.from(document.querySelectorAll(".nav-dot"));
const progressBar = document.querySelector("#progressBar");
const currentPanel = document.querySelector("#currentPanel");
const root = document.documentElement;

let maxHorizontal = 0;
let maxScroll = 0;
let ticking = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setScrollSpace() {
  maxHorizontal = Math.max(0, rail.scrollWidth - window.innerWidth);
  document.body.style.height = `${maxHorizontal + window.innerHeight}px`;
  maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
  updateScene();
}

function setActivePanel(progress) {
  const activeIndex = clamp(Math.round(progress * (panels.length - 1)), 0, panels.length - 1);

  panels.forEach((panel, index) => {
    panel.classList.toggle("is-active", index === activeIndex);
  });

  navDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
    dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
  });

  currentPanel.textContent = String(activeIndex + 1).padStart(2, "0");
}

function updateScene() {
  const progress = clamp(window.scrollY / maxScroll, 0, 1);
  const x = progress * maxHorizontal;

  rail.style.transform = `translate3d(${-x}px, 0, 0)`;
  root.style.setProperty("--progress", progress.toFixed(4));
  progressBar.style.width = `${progress * 100}%`;
  setActivePanel(progress);
  ticking = false;
}

function requestSceneUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScene);
    ticking = true;
  }
}

function scrollToPanel(index) {
  const targetProgress = index / Math.max(1, panels.length - 1);
  window.scrollTo({
    top: targetProgress * maxScroll,
    behavior: "smooth",
  });
}

navDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    scrollToPanel(Number(dot.dataset.panel));
  });
});

document.querySelectorAll("[data-jump]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToPanel(Number(link.dataset.jump));
  });
});

window.addEventListener("scroll", requestSceneUpdate, { passive: true });
window.addEventListener("resize", setScrollSpace);

window.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
    return;
  }

  const activeIndex = navDots.findIndex((dot) => dot.classList.contains("is-active"));
  const direction = event.key === "ArrowRight" ? 1 : -1;
  scrollToPanel(clamp(activeIndex + direction, 0, panels.length - 1));
});

setScrollSpace();
