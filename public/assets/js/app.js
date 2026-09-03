const panels = Array.from(document.querySelectorAll(".panel"));
const navDots = Array.from(document.querySelectorAll(".nav-dot"));
const progressBar = document.querySelector("#progressBar");
const currentPanel = document.querySelector("#currentPanel");
const root = document.documentElement;

let ticking = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getPageProgress() {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return clamp(window.scrollY / scrollable, 0, 1);
}

function getActivePanelIndex() {
  const viewportFocus = window.innerHeight * 0.42;

  return panels.reduce(
    (closest, panel, index) => {
      const rect = panel.getBoundingClientRect();
      const distance = Math.abs(rect.top - viewportFocus);
      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: 0, distance: Number.POSITIVE_INFINITY },
  ).index;
}

function setActivePanel(activeIndex) {
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
  const progress = getPageProgress();

  root.style.setProperty("--progress", progress.toFixed(4));
  progressBar.style.width = `${progress * 100}%`;
  setActivePanel(getActivePanelIndex());
  ticking = false;
}

function requestSceneUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScene);
    ticking = true;
  }
}

function scrollToPanel(index) {
  panels[index].scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function setPointerDepth(event) {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  root.style.setProperty("--tilt-x", (x * 4).toFixed(2));
  root.style.setProperty("--tilt-y", (y * -3).toFixed(2));
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
window.addEventListener("resize", requestSceneUpdate);
window.addEventListener("pointermove", setPointerDepth, { passive: true });
window.addEventListener("pointerleave", () => {
  root.style.setProperty("--tilt-x", "0");
  root.style.setProperty("--tilt-y", "0");
});

window.addEventListener("keydown", (event) => {
  const forwardKeys = ["ArrowDown", "ArrowRight", "PageDown"];
  const backKeys = ["ArrowUp", "ArrowLeft", "PageUp"];

  if (!forwardKeys.includes(event.key) && !backKeys.includes(event.key)) {
    return;
  }

  const activeIndex = navDots.findIndex((dot) => dot.classList.contains("is-active"));
  const direction = forwardKeys.includes(event.key) ? 1 : -1;

  event.preventDefault();
  scrollToPanel(clamp(activeIndex + direction, 0, panels.length - 1));
});

updateScene();
