const menu = document.querySelector(".menu-toggle"),
  nav = document.querySelector("#primary-navigation");
function closeMenu() {
  menu?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("open");
}
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav?.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav?.classList.contains("open")) {
    closeMenu();
    menu.focus();
  }
});
matchMedia("(max-width:1100px)").addEventListener("change", closeMenu);
const dialog = document.querySelector(".image-dialog"),
  expanded = dialog?.querySelector("img"),
  scroller = dialog?.querySelector(".expanded-image-scroll");
let returnFocus,
  fitWidth = 0,
  zoom = 1;
function setZoom(value) {
  zoom = Math.min(8, Math.max(1, value));
  expanded.style.width = `${Math.round(fitWidth * zoom)}px`;
  dialog.querySelector(".viewer-status").textContent =
    `${Math.round(zoom * 100)}% of fitted size`;
}
function fitImage() {
  if (!expanded?.naturalWidth) return;
  fitWidth = Math.min(
    expanded.naturalWidth,
    innerWidth * 0.92,
    ((innerHeight * 0.9 - 80) * expanded.naturalWidth) / expanded.naturalHeight,
  );
  setZoom(1);
}
document.querySelectorAll("[data-image]").forEach((button) =>
  button.addEventListener("click", () => {
    returnFocus = button;
    expanded.alt = button.closest(".figure-visual").querySelector("img").alt;
    expanded.onload = fitImage;
    expanded.src = button.dataset.image;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    scroller.scrollTo(0, 0);
    if (expanded.complete) fitImage();
  }),
);
dialog
  ?.querySelector(".close-dialog")
  .addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog?.querySelectorAll("[data-zoom]").forEach((button) =>
  button.addEventListener("click", () => {
    if (button.dataset.zoom === "fit") setZoom(1);
    else setZoom(zoom * (button.dataset.zoom === "in" ? 1.5 : 1 / 1.5));
  }),
);
dialog?.addEventListener("close", () => {
  document.body.style.overflow = "";
  returnFocus?.focus();
  expanded.removeAttribute("src");
});
window.addEventListener(
  "resize",
  () => {
    if (dialog?.open) fitImage();
  },
  { passive: true },
);
const contents = document.querySelector(".section-contents"),
  desktopContents = matchMedia("(min-width:1101px)");
function setContentsLayout() {
  if (contents) contents.open = desktopContents.matches;
}
setContentsLayout();
desktopContents.addEventListener("change", setContentsLayout);
const sectionLinks = [...document.querySelectorAll(".section-contents a")],
  targets = sectionLinks
    .map((link) =>
      document.getElementById(decodeURIComponent(link.hash.slice(1))),
    )
    .filter(Boolean);
const currentLabel = document.createElement("span");
currentLabel.className = "current-section";
contents?.querySelector("summary").append(currentLabel);
function updateSection() {
  let current = targets[0];
  for (const target of targets) {
    if (target.getBoundingClientRect().top <= 120) current = target;
  }
  for (const link of sectionLinks) {
    if (current && link.hash === "#" + current.id) {
      link.setAttribute("aria-current", "location");
      currentLabel.textContent =
        link.querySelector(".section-target")?.textContent || link.textContent;
    } else link.removeAttribute("aria-current");
  }
}
let scheduled = false;
window.addEventListener(
  "scroll",
  () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        updateSection();
        scheduled = false;
      });
    }
  },
  { passive: true },
);
updateSection();
sectionLinks.forEach((link) =>
  link.addEventListener("click", () => {
    if (!desktopContents.matches) contents.open = false;
  }),
);
