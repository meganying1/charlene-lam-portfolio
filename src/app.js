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
const contents = document.querySelector(".section-contents");
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
  let closest = -Infinity;
  for (const target of targets) {
    const top = target.getBoundingClientRect().top;
    if (top <= 120 && top >= closest) {
      current = target;
      closest = top;
    }
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
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (contents) contents.open = false;
    // Keep keyboard navigation at the selected section after its link is hidden.
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    let destination = target;
    if (target?.classList.contains("anchor")) {
      for (let next = target.nextElementSibling; next; next = next.nextElementSibling) {
        const heading = next.querySelector("h1,h2,h3");
        if (heading) {
          destination = heading;
          break;
        }
      }
    }
    destination?.setAttribute("tabindex", "-1");
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    target?.scrollIntoView({ block: "start" });
    destination?.focus({ preventScroll: true });
    requestAnimationFrame(updateSection);
  }),
);
