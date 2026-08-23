"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const menuIcon = menuToggle?.querySelector("iconify-icon");
const navigationLinks = navigation?.querySelectorAll('a[href^="#"]') ?? [];

function setMenuState(isOpen) {
    if (!menuToggle || !navigation) {
        return;
    }

    navigation.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    if (menuIcon) {
        menuIcon.setAttribute("icon", isOpen ? "lucide:x" : "lucide:menu");
    }
}

menuToggle?.addEventListener("click", () => {
    setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
            setMenuState(false);
        }
    });
});

document.addEventListener("click", (event) => {
    if (
        window.innerWidth < 768 &&
        menuToggle?.getAttribute("aria-expanded") === "true" &&
        !navigation?.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        setMenuState(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenuState(false);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        setMenuState(false);
    }
});

const sections = document.querySelectorAll("main section");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (
    !prefersReducedMotion &&
    "IntersectionObserver" in window
) {
    sections.forEach((section) => section.classList.add("ready"));

    const sectionObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
}
