import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const clamp = THREE.MathUtils.clamp;
const damp = THREE.MathUtils.damp;
const lerp = THREE.MathUtils.lerp;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const WORDS = ["INTRO", "ABOUT", "PROJECTS", "CERTS", "SKILLS", "CONTACT", "LETTER"];
const ROTATIONS = [0.16, 0.82, -0.5, 1.1, -0.86, 0.35, 0.72];
const DISTANCES = [12.2, 11.4, 12.0, 11.2, 11.8, 10.9, 11.5];
const ANCHORS = WORDS.length + 3;

const qs = (selector) => document.querySelector(selector);
const space = qs("#space");
const stage = qs("#stage");
const panels = Array.from(document.querySelectorAll(".panel"));
const panelNav = qs("#panelNav");
const iris = qs("#iris");
const irisText = qs("#irisText");
const actA = qs("#actA");
const scrollCue = qs("#scrollCue");
const toastEl = qs("#toast");
const loader = qs("#loader");
const loaderFill = qs("#loaderFill");
const loaderStatus = qs("#loaderStatus");
const terminal = qs("#terminal");
const terminalBody = qs("#terminalBody");
const terminalInput = qs("#terminalInput");

let idx = -1;
let smoothedScroll = 0;
let lastRawScroll = 0;
let lastUserTime = performance.now();
let termOpen = false;
let layoutMobile = false;
let statueScale = 1;
let statueYOffset = 0;
let focusX = -0.55;
let focusY = 3.6;
let zoomMul = 1;
let userRotation = 0;
let spinAngle = 0;
let idleSpin = prefersReducedMotion ? 0 : 0.0011;
let dragState = null;
let toastTimer;
let currentLabel = "";
let sectionWordProgress = 0;
let targetWordVisible = 0;
const mouse = { x: 0, y: 0 };
const rotation = { current: -1.15, target: 0 };

function smoothStep(a, b, value) {
  const x = clamp((value - a) / (b - a), 0, 1);
  return x * x * (3 - 2 * x);
}

function easeInOut(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function setSpace() {
  space.style.height = `${ANCHORS * window.innerHeight}px`;
}

function markUser() {
  lastUserTime = performance.now();
}

function navToY(y) {
  markUser();
  window.scrollTo({
    top: clamp(y, 0, ANCHORS * window.innerHeight - window.innerHeight),
    behavior: "smooth",
  });
}

WORDS.forEach((word, index) => {
  const dot = document.createElement("button");
  dot.className = "nav-dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to ${word.toLowerCase()}`);
  dot.addEventListener("click", () => navToY((index + 3) * window.innerHeight));
  panelNav.appendChild(dot);
});

const navDots = Array.from(panelNav.children);

qs("#brandBtn").addEventListener("click", () => navToY(0));

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove("is-visible"), 2400);
}

document.querySelectorAll("[data-toast]").forEach((element) => {
  element.addEventListener("click", () => showToast(element.dataset.toast));
});

document.querySelectorAll("[data-copy]").forEach((element) => {
  element.addEventListener("click", () => {
    const value = element.dataset.copy;
    if (!navigator.clipboard) {
      showToast(value);
      return;
    }

    navigator.clipboard.writeText(value).then(
      () => showToast(`COPIED - ${value}`),
      () => showToast(value),
    );
  });
});

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0b0a, 14, 46);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 160);
camera.position.set(0, 6, 17.5);

const hemi = new THREE.HemisphereLight(0x46504a, 0x0a0b0a, 0.2);
const key = new THREE.DirectionalLight(0xffe9d0, 0);
const rim = new THREE.DirectionalLight(0xbfd4e0, 0);
const accent = new THREE.PointLight(0x7ce3a3, 0, 9, 2);
key.position.set(3.5, 8, 6.5);
rim.position.set(-5, 7, -6);
accent.position.set(-1.6, 0.8, 2.6);
scene.add(hemi, key, rim, accent);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(42, 72),
  new THREE.MeshStandardMaterial({ color: 0x0e100e, roughness: 0.95 }),
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const grid = new THREE.GridHelper(90, 72, 0x1d211d, 0x141714);
grid.position.y = 0.012;
grid.material.transparent = true;
grid.material.opacity = 0;
scene.add(grid);

const statueRig = new THREE.Group();
const secondaryRig = new THREE.Group();
scene.add(statueRig, secondaryRig);

const loader3D = new THREE.TextureLoader();
let statueLoaded = 0;

function makeStatuePlane(url, width, height, opacity) {
  const material = new THREE.MeshBasicMaterial({
    color: 0xf1eee8,
    depthWrite: false,
    map: loader3D.load(url, () => {
      statueLoaded += 1;
    }),
    opacity,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.y = height / 2;
  return mesh;
}

const statue = makeStatuePlane("assets/images/Removal-953.png", 3.7, 8.6, 0.95);
const statueGlow = makeStatuePlane("assets/images/Removal-953.png", 4.1, 9.1, 0.16);
const statueBack = makeStatuePlane("assets/images/Removal-758.png", 3.5, 8.2, 0.32);
statueGlow.position.z = -0.05;
statueBack.position.set(0, 4.1, 0);
statueRig.add(statueGlow, statue);
secondaryRig.add(statueBack);

const base = new THREE.Mesh(
  new THREE.BoxGeometry(4.6, 0.4, 2.4),
  new THREE.MeshStandardMaterial({ color: 0xd4cec0, roughness: 0.68, metalness: 0.02 }),
);
base.position.y = 0.2;
statueRig.add(base);

const cityGroup = new THREE.Group();
scene.add(cityGroup);

const windowMaterials = [];
const beacons = [];

function makeWindowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#07090c";
  ctx.fillRect(0, 0, 64, 160);

  for (let row = 0; row < 16; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      if (Math.random() > 0.36) {
        const alpha = 0.28 + Math.random() * 0.55;
        ctx.fillStyle = `rgba(191, 232, 207, ${alpha})`;
        ctx.fillRect(4 + col * 12, 6 + row * 9.6, 8, 6);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildCity() {
  for (let i = 0; i < 4; i += 1) {
    windowMaterials.push(
      new THREE.MeshStandardMaterial({
        color: 0x0d1016,
        emissive: 0xffffff,
        emissiveIntensity: 0,
        emissiveMap: makeWindowTexture(),
        metalness: 0.25,
        roughness: 0.85,
      }),
    );
  }

  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);

  [
    { z: -22, h0: 6, h1: 14, step: 3 },
    { z: -17, h0: 4, h1: 9, step: 3.4 },
    { z: -13, h0: 2.5, h1: 6, step: 4.2 },
  ].forEach((row) => {
    for (let x = -36; x <= 36; x += row.step * (0.75 + Math.random() * 0.5)) {
      if (Math.random() < 0.18) {
        continue;
      }

      const bowl = 0.35 + 0.65 * THREE.MathUtils.smoothstep(Math.abs(x), 3, 16);
      const height = lerp(row.h0, row.h1, Math.random()) * bowl;
      const tower = new THREE.Mesh(geo, windowMaterials[(Math.random() * windowMaterials.length) | 0]);
      tower.position.set(x, 0, row.z + (Math.random() - 0.5) * 2.4);
      tower.scale.set(1.6 + Math.random() * 2.2, height, 1.6 + Math.random() * 2);
      cityGroup.add(tower);

      if (Math.random() < 0.3) {
        const beacon = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 10, 8),
          new THREE.MeshBasicMaterial({ color: 0x9df0bd, opacity: 0, transparent: true }),
        );
        beacon.position.set(tower.position.x, height + 1.15, tower.position.z);
        beacon.userData.offset = Math.random() * Math.PI * 2;
        cityGroup.add(beacon);
        beacons.push(beacon);
      }
    }
  });
}

buildCity();

const dustCount = 150;
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i += 1) {
  dustPositions[i * 3] = Math.random() * 16 - 8;
  dustPositions[i * 3 + 1] = Math.random() * 7 + 0.3;
  dustPositions[i * 3 + 2] = Math.random() * 10 - 7;
}

const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
const dust = new THREE.Points(
  dustGeo,
  new THREE.PointsMaterial({
    color: 0x9aa598,
    depthWrite: false,
    opacity: 0,
    size: 0.035,
    transparent: true,
  }),
);
scene.add(dust);

function wordTexture(word) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 560;
  const ctx = canvas.getContext("2d");
  let size = 330;

  ctx.fillStyle = "#232723";
  ctx.textAlign = "center";
  do {
    ctx.font = `500 ${size}px "Playfair Display", Georgia, serif`;
    size -= 10;
  } while (ctx.measureText(word).width > 1900 && size > 80);

  ctx.fillText(word, 1024, 415);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const wordTextures = WORDS.map(wordTexture);
const wordMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(15.5, 4.25),
  new THREE.MeshBasicMaterial({ map: wordTextures[0], opacity: 0, transparent: true }),
);
scene.add(wordMesh);

function layout3D() {
  layoutMobile = window.innerWidth / window.innerHeight < 0.95 || window.innerWidth < 760;

  if (layoutMobile) {
    statueScale = 0.76;
    statueYOffset = 0.9;
    focusX = 0;
    focusY = 4.15;
    secondaryRig.visible = false;
    wordMesh.scale.setScalar(0.72);
    wordMesh.userData.base = [0, 3.8, -9];
  } else {
    statueScale = 1;
    statueYOffset = 0;
    focusX = -0.55;
    focusY = 3.6;
    secondaryRig.visible = idx >= 0;
    wordMesh.scale.setScalar(1);
    wordMesh.userData.base = [0.35, 2.0, -7.6];
  }
}

function rotationAt(sectionFloat) {
  const start = Math.min(WORDS.length - 2, Math.floor(sectionFloat));
  return lerp(ROTATIONS[start], ROTATIONS[start + 1], sectionFloat - start);
}

function distanceAt(sectionFloat) {
  if (layoutMobile) {
    return 14.2;
  }

  const start = Math.min(WORDS.length - 2, Math.floor(sectionFloat));
  return lerp(DISTANCES[start], DISTANCES[start + 1], sectionFloat - start);
}

function setActiveSection(nextIndex) {
  if (idx === nextIndex) {
    return;
  }

  idx = nextIndex;
  if (idx >= 0) {
    document.body.classList.add("intro-done");
    panels.forEach((panel, index) => panel.classList.toggle("is-active", index === idx));
    navDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === idx);
      dot.setAttribute("aria-current", index === idx ? "true" : "false");
    });
    wordMesh.material.map = wordTextures[idx];
    wordMesh.material.needsUpdate = true;
    sectionWordProgress = 0;
  } else {
    document.body.classList.remove("intro-done");
    panels.forEach((panel) => panel.classList.remove("is-active"));
    navDots.forEach((dot) => {
      dot.classList.remove("is-active");
      dot.removeAttribute("aria-current");
    });
  }

  layout3D();
}

const canvas = renderer.domElement;

canvas.addEventListener("pointerdown", (event) => {
  dragState = { x: event.clientX, y: event.clientY, mode: undefined, dy: 0, velocity: 0 };
  canvas.setPointerCapture(event.pointerId);
  markUser();
});

canvas.addEventListener("pointermove", (event) => {
  if (!dragState) {
    return;
  }

  const dx = event.clientX - dragState.x;
  const dy = event.clientY - dragState.y;
  if (!dragState.mode) {
    if (Math.abs(dx) > Math.abs(dy) + 6) {
      dragState.mode = "rotate";
    } else if (Math.abs(dy) > Math.abs(dx) + 12 && event.pointerType === "mouse") {
      dragState.mode = "swipe";
    }
  }

  if (dragState.mode === "rotate") {
    userRotation += dx * 0.0062;
    dragState.velocity = dx * 0.0062;
    canvas.style.cursor = "grabbing";
    dragState.x = event.clientX;
    dragState.y = event.clientY;
    markUser();
  } else if (dragState.mode === "swipe") {
    dragState.dy += event.clientY - dragState.y;
    dragState.y = event.clientY;
  }
});

function endDrag() {
  if (dragState) {
    if (dragState.mode === "rotate") {
      userRotation += dragState.velocity * 9;
    } else if (dragState.mode === "swipe" && Math.abs(dragState.dy) > 80) {
      const section = clamp(
        Math.round(window.scrollY / window.innerHeight) + (dragState.dy < 0 ? 1 : -1),
        0,
        ANCHORS - 1,
      );
      navToY(section * window.innerHeight);
    }
  }

  dragState = null;
  canvas.style.cursor = "grab";
  markUser();
}

canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);
canvas.addEventListener("dblclick", () => {
  userRotation = 0;
  spinAngle = 0;
});

window.addEventListener(
  "pointermove",
  (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  },
  { passive: true },
);

window.addEventListener(
  "wheel",
  (event) => {
    if (termOpen) {
      event.preventDefault();
      return;
    }

    if (event.ctrlKey) {
      return;
    }

    markUser();
    const mult = event.deltaMode === 1 ? 33 : 1;
    window.scrollBy(0, event.deltaY * mult * 1.7);
  },
  { passive: false },
);

window.addEventListener("touchmove", markUser, { passive: true });

function printTerminal(text, className = "") {
  text.split("\n").forEach((line) => {
    const row = document.createElement("div");
    row.className = `terminal-line ${className}`;
    row.textContent = line || " ";
    terminalBody.appendChild(row);
  });
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function openTerminal() {
  terminal.classList.add("is-open");
  termOpen = true;
  terminalInput.focus();
  if (!terminalBody.childElementCount) {
    printTerminal("JOLINA OS v4.0 - one scroll, one figure.", "ok");
    printTerminal("scroll raises her. type 'help' for commands.", "dim");
  }
}

function closeTerminal() {
  terminal.classList.remove("is-open");
  termOpen = false;
  terminalInput.blur();
}

function toggleTerminal() {
  if (termOpen) {
    closeTerminal();
  } else {
    openTerminal();
  }
}

qs("#termBtn").addEventListener("click", toggleTerminal);
qs("#termClose").addEventListener("click", closeTerminal);

const aliases = {
  about: 1,
  certificates: 3,
  certs: 3,
  contact: 5,
  education: 3,
  intro: 0,
  projects: 2,
  letter: 6,
  resume: 1,
  skills: 4,
  work: 2,
};

const helpText = `AVAILABLE COMMANDS

  goto <section>     intro / about / projects / certs / skills / contact / letter
  next / prev        step along the scroll track
  replay             back to the top
  pose <1-7>         turn the figure to a catalogued angle
  spin <0-10>        idle turntable speed
  zoom <in|out>      dolly the camera
  about / projects / education / skills / resume / contact
  ls / pwd / whoami / date / echo <msg> / clear / exit`;

const projectDetails = [
  {
    name: "Natours Travel",
    url: "https://natours-travel.com/",
    summary: "Travel and tours website for flights, hotels, packages, cruises, and visa assistance.",
  },
  {
    name: "Broccobae",
    url: "https://broccobae.com",
    summary: "Vegan recipe website with friendly browsing, plant-based meals, and beginner-friendly recipes.",
  },
  {
    name: "CalDef",
    url: "https://github.com/jolina/Caldef",
    summary: "Calorie deficit guidance site focused on simple fitness, nutrition, and lifestyle education.",
  },
  {
    name: "Globetrone Bank App",
    url: "https://jolinajavier02.github.io/Globetrone-Bank-App/",
    summary: "Fintech UI/UX case study for international money transfer and banking flows.",
  },
  {
    name: "Coffee App",
    url: "https://jolinajavier02.github.io/Coffee-App/",
    summary: "Mobile ordering and delivery UI for browsing coffee, customizing orders, and checkout.",
  },
];

const educationDetails = [
  "Google UX Design Certificate - Coursera - Jul-Oct 2024",
  "Foundations of User Experience Design",
  "Start the UX Design Process: Empathize, Define, and Ideate",
  "Build Wireframes and Low-Fidelity Prototypes",
  "Conduct UX Research and Test Early Concepts",
  "Create High-Fidelity Designs and Prototypes in Figma",
  "Responsive Web Design in Adobe XD and Figma",
  "Design a User Experience for Social Good and Prepare for Jobs",
  "UI/UX Design Specialization - California Institute of the Arts / Coursera",
  "Visual Elements of User Interface Design",
  "UX Design Fundamentals",
  "Bachelor of Science in Hospitality Management - University of Eastern Philippines - 2020-2024",
];

const commands = {
  about: () =>
    printTerminal(
      "JOLINA JAVIER\nUI/UX Designer & Front-End Developer\n\nHi, I am Jolina Javier, a passionate UI/UX Designer and Front-End Developer.\nI enjoy creating intuitive and user-friendly digital experiences.",
    ),
  clear: () => {
    terminalBody.innerHTML = "";
  },
  close: closeTerminal,
  contact: () =>
    printTerminal(
      "GET IN TOUCH\n\nemail    jolinapjavier@gmail.com\nlinkedin https://www.linkedin.com/in/jolina-javier-ab92b4326/\ngithub   https://github.com/jolinajavier02\n\nAvailable for UI/UX Design projects, Front-End Development, Freelance work, and Full-time opportunities.\nTypical response time: within 24 hours.",
    ),
  date: () => printTerminal(new Date().toString()),
  education: () => printTerminal(`EDUCATION & CERTIFICATIONS\n\n${educationDetails.map((item) => `- ${item}`).join("\n")}`),
  echo: (_arg, rest) => printTerminal(rest.join(" ") || ""),
  exit: closeTerminal,
  goto: (arg) => {
    const value = aliases[arg] ?? Number.parseInt(arg, 10) - 1;
    if (value >= 0 && value < WORDS.length) {
      navToY((value + 3) * window.innerHeight);
      printTerminal(`scrolling to ${WORDS[value]}`, "ok");
    } else {
      printTerminal("unknown section - try intro, about, work, skills, path, contact", "err");
    }
  },
  help: () => printTerminal(helpText),
  letter: () =>
    printTerminal(
      "LETTER\n\nThank you for walking through the work. This portfolio is a quiet room for projects, learning, contact, and the little details that make a digital experience feel personal.",
    ),
  ls: () => printTerminal("about.txt\nskills.json\nprojects/\neducation.md\ncontact.vcf\nresume.html\nletter.txt"),
  next: () => navToY((clamp(Math.round(window.scrollY / window.innerHeight), 0, ANCHORS - 1) + 1) * window.innerHeight),
  pose: (arg) => {
    const value = Number.parseInt(arg, 10);
    if (value >= 1 && value <= WORDS.length) {
      userRotation = ROTATIONS[value - 1] - rotation.current;
      spinAngle = 0;
      printTerminal(`pose ${value} - ${WORDS[value - 1]}`, "ok");
    } else {
      printTerminal("usage: pose <1-7>", "err");
    }
  },
  pwd: () => printTerminal("/home/jolina/~"),
  prev: () => navToY((clamp(Math.round(window.scrollY / window.innerHeight), 0, ANCHORS - 1) - 1) * window.innerHeight),
  projects: () =>
    printTerminal(
      `PROJECTS PORTFOLIO\n\n${projectDetails
        .map((project, index) => `${index + 1}. ${project.name}\n   ${project.url}\n   ${project.summary}`)
        .join("\n\n")}`,
    ),
  replay: () => navToY(0),
  resume: () =>
    printTerminal(
      "RESUME\n\nUI/UX Designer Resume\nFocused on user experience design, research, and interface design skills.\nDownload from this page: assets/resume/Jolina-P-Javier-Resume.html",
    ),
  skills: () =>
    printTerminal(
      "TECHNICAL SKILLS & TOOLS\nHTML / CSS / JavaScript / React / Figma / GitHub / Hosting / VS Code\n\nDESIGN & SOFT SKILLS\nResponsive Design / Visual Layout / Project Execution / Collaboration / Adaptability",
    ),
  spin: (arg) => {
    const value = Number.parseFloat(arg);
    if (Number.isNaN(value)) {
      printTerminal("usage: spin <0-10>", "err");
      return;
    }
    idleSpin = clamp(value, 0, 10) * 0.0011;
    printTerminal(`idle spin ${idleSpin.toFixed(4)}`, "ok");
  },
  stop: () => {
    idleSpin = 0;
    printTerminal("rotation halted.", "ok");
  },
  whoami: () => printTerminal("jolina", "ok"),
  zoom: (arg) => {
    zoomMul = clamp(arg === "in" ? zoomMul * 0.88 : arg === "out" ? zoomMul * 1.14 : zoomMul, 0.6, 1.8);
    printTerminal(`camera dolly x ${zoomMul.toFixed(2)}`, "ok");
  },
};

const history = [];
let historyIndex = 0;

terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const value = terminalInput.value.trim();
    terminalInput.value = "";
    if (!value) {
      printTerminal(">", "cmd");
      return;
    }

    printTerminal(`> ${value}`, "cmd");
    history.push(value);
    historyIndex = history.length;
    const [cmd, ...rest] = value.split(/\s+/);
    const handler = commands[cmd.toLowerCase()];
    if (handler) {
      handler(rest.join(" "), rest);
    } else {
      printTerminal(`command not found: ${cmd} - try help`, "err");
    }
  }

  if (event.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex -= 1;
      terminalInput.value = history[historyIndex] || "";
    }
    event.preventDefault();
  }

  if (event.key === "ArrowDown") {
    if (historyIndex < history.length) {
      historyIndex += 1;
      terminalInput.value = history[historyIndex] || "";
    }
    event.preventDefault();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && termOpen) {
    closeTerminal();
    return;
  }

  if (event.key === "`" || event.code === "Backquote") {
    if (document.activeElement !== terminalInput) {
      event.preventDefault();
      toggleTerminal();
    }
    return;
  }

  if (termOpen) {
    return;
  }

  const anchor = clamp(Math.round(window.scrollY / window.innerHeight), 0, ANCHORS - 1);
  if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key)) {
    event.preventDefault();
    navToY((anchor + 1) * window.innerHeight);
  }
  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    navToY((anchor - 1) * window.innerHeight);
  }
  if (event.key === "Home") {
    event.preventDefault();
    navToY(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    navToY((ANCHORS - 1) * window.innerHeight);
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  setSpace();
  layout3D();
});

const loaderStatuses = ["CASTING FIGURE", "RAISING SKYLINE", "POLISHING MARBLE", "WIRING INTERACTIONS"];
let loadProgress = 0;
let lastLoaderTime = performance.now();

function loaderTick(now) {
  const dt = (now - lastLoaderTime) / 1000;
  lastLoaderTime = now;
  const imageBoost = statueLoaded >= 2 ? 0.4 : 0;
  loadProgress = Math.min(1, loadProgress + dt / 1.35 + imageBoost * dt);
  loaderFill.style.width = `${loadProgress * 100}%`;
  loaderStatus.textContent = loaderStatuses[Math.min(loaderStatuses.length - 1, Math.floor(loadProgress * 4))];

  if (loadProgress >= 1) {
    loader.classList.add("is-done");
    document.body.classList.add("ready-state");
    document.documentElement.classList.add("ready");
    return;
  }

  requestAnimationFrame(loaderTick);
}

window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);
setSpace();
layout3D();
requestAnimationFrame(loaderTick);

const clock = new THREE.Clock();

function renderFrame() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  const viewportHeight = window.innerHeight;

  smoothedScroll += (window.scrollY - smoothedScroll) * Math.min(1, delta * 9);
  if (Math.abs(window.scrollY - smoothedScroll) < 0.1) {
    smoothedScroll = window.scrollY;
  }

  const introProgress = clamp(smoothedScroll / (3 * viewportHeight), 0, 1);
  const rawAnchor = window.scrollY / viewportHeight;
  const nextSection = rawAnchor >= 2.55 ? clamp(Math.round(rawAnchor) - 3, 0, WORDS.length - 1) : -1;
  setActiveSection(nextSection);

  const sectionFloat = clamp(smoothedScroll / viewportHeight - 3, 0, WORDS.length - 1);
  const rise = easeInOut(smoothStep(0.3, 0.94, introProgress));

  statueRig.scale.setScalar(lerp(0.38, 1, rise) * statueScale);
  statueRig.position.y = statueYOffset + lerp(-0.55, 0, rise);
  statueRig.position.x = layoutMobile ? 0 : lerp(0, -2.55, smoothStep(0.78, 1, introProgress));
  secondaryRig.position.set(4.95, 0, -2.6);
  secondaryRig.scale.setScalar(0.95 * Math.max(targetWordVisible, 0.001));

  const scrollRotation = introProgress < 1 ? lerp(-1.15, ROTATIONS[0], easeInOut(introProgress)) : rotationAt(sectionFloat);
  if (!dragState && performance.now() - lastUserTime > 3500 && introProgress >= 1) {
    spinAngle += idleSpin * delta * 60;
  }

  rotation.target = scrollRotation + userRotation + spinAngle;
  rotation.current = damp(rotation.current, rotation.target, 2.6, delta);
  statueRig.rotation.y = rotation.current;
  secondaryRig.rotation.y = 0.55 + Math.sin(elapsed * 0.07) * 0.4;

  const lightLevel = smoothStep(0.12, 0.8, introProgress);
  key.intensity = 2.4 * lightLevel;
  rim.intensity = 1.9 * lightLevel;
  hemi.intensity = 0.2 + 0.45 * lightLevel;
  accent.intensity = 5.5 * lightLevel;
  grid.material.opacity = 0.5 * lightLevel;
  dust.material.opacity = 0.45 * lightLevel;
  base.material.opacity = lightLevel;

  const cityFade = smoothStep(0.2, 0.8, introProgress);
  windowMaterials.forEach((material) => {
    material.emissiveIntensity = 0.55 * cityFade;
  });
  beacons.forEach((beacon) => {
    beacon.material.opacity = cityFade * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(elapsed * 2.2 + beacon.userData.offset)));
  });

  const distanceTarget = introProgress < 1 ? lerp(17.5, distanceAt(0), easeInOut(introProgress)) : distanceAt(sectionFloat) * zoomMul;
  camera.position.z = damp(camera.position.z, distanceTarget, 3, delta);
  camera.position.x = damp(camera.position.x, mouse.x * 0.45, 2.5, delta);
  camera.position.y = damp(camera.position.y, (introProgress < 1 ? lerp(6, 3.6, easeInOut(introProgress)) : 3.6) + mouse.y * 0.25, 2.5, delta);
  camera.lookAt(introProgress < 1 ? lerp(0, focusX, easeInOut(introProgress)) : focusX, introProgress < 1 ? lerp(5, focusY, easeInOut(introProgress)) : focusY, 0);

  sectionWordProgress = Math.min(1, sectionWordProgress + delta * 2.4);
  targetWordVisible = damp(targetWordVisible, idx >= 0 ? 1 : 0, 4, delta);
  const wordEase = 1 - Math.pow(1 - sectionWordProgress, 3);
  wordMesh.material.opacity = 0.95 * wordEase * targetWordVisible * smoothStep(0.86, 1, introProgress);
  const [wordX, wordY, wordZ] = wordMesh.userData.base || [0.35, 2, -7.6];
  wordMesh.position.set(wordX + mouse.x * 0.35, wordY - 0.45 * (1 - wordEase), wordZ);

  const irisDiameter = lerp(6, Math.max(window.innerWidth, window.innerHeight) * 2.7, smoothStep(0.16, 0.97, introProgress));
  iris.style.width = `${irisDiameter}px`;
  iris.style.height = `${irisDiameter}px`;
  iris.style.visibility = introProgress >= 0.985 ? "hidden" : "visible";
  iris.style.borderColor = `rgba(124, 227, 163, ${(0.55 * (1 - smoothStep(0.86, 1, introProgress))).toFixed(3)})`;

  const nextLabel =
    introProgress < 0.16 || introProgress > 0.9
      ? ""
      : introProgress < 0.34
        ? "JOLINA P. JAVIER"
        : introProgress < 0.56
          ? "PORTFOLIO - MMXXVI"
          : "WEB DEVELOPER";
  if (nextLabel !== currentLabel) {
    currentLabel = nextLabel;
    if (currentLabel) {
      irisText.textContent = currentLabel;
      irisText.classList.add("is-visible");
    } else {
      irisText.classList.remove("is-visible");
    }
  }

  const introTextAlpha = 1 - smoothStep(0.13, 0.26, introProgress);
  actA.style.opacity = introTextAlpha.toFixed(3);
  actA.style.visibility = introTextAlpha <= 0 ? "hidden" : "visible";
  actA.style.transform = `translate(-50%, -50%) translateY(${(-34 * (1 - introTextAlpha)).toFixed(1)}px)`;

  const cueAlpha = 1 - smoothStep(0.3, 0.52, introProgress);
  scrollCue.style.opacity = cueAlpha.toFixed(3);
  scrollCue.style.visibility = cueAlpha <= 0 ? "hidden" : "visible";

  const rawScroll = window.scrollY;
  const rawVelocity = rawScroll - lastRawScroll;
  lastRawScroll = rawScroll;
  if (!termOpen && performance.now() - lastUserTime > 320 && Math.abs(rawVelocity) < 0.6) {
    const snap = Math.round(rawScroll / viewportHeight) * viewportHeight;
    const diff = snap - rawScroll;
    if (Math.abs(diff) > 0.5) {
      window.scrollTo(0, rawScroll + diff * Math.min(1, delta * 4));
    }
  }

  const dustAttribute = dustGeo.attributes.position;
  for (let i = 0; i < dustCount; i += 1) {
    let y = dustAttribute.getY(i) + delta * 0.12 * (0.5 + (i % 5) / 8);
    if (y > 7.5) {
      y = 0.3;
    }
    dustAttribute.setY(i, y);
  }
  dustAttribute.needsUpdate = true;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(renderFrame);
