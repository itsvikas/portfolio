(() => {
    const root = document.documentElement;
    root.classList.add("has-js");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector(".site-header");
    const progress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");
    const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-nav a")];

    function updateScrollState() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        progress.style.transform = `scaleX(${ratio})`;
        header.classList.toggle("is-scrolled", window.scrollY > 8);
        backToTop.hidden = window.scrollY < window.innerHeight * 0.8;
    }
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });
    updateScrollState();

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                const active = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("is-active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    function closeMenu() {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        mobileNav.hidden = true;
    }
    menuToggle.addEventListener("click", () => {
        const open = menuToggle.getAttribute("aria-expanded") !== "true";
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        mobileNav.hidden = !open;
    });
    mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => { if (window.innerWidth > 767) closeMenu(); });

    const themeToggle = document.getElementById("themeToggle");
    function applyTheme(scheme) {
        root.dataset.colorScheme = scheme;
        root.style.colorScheme = scheme;
        themeToggle.setAttribute("aria-checked", String(scheme === "dark"));
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.content = scheme === "dark" ? "#0b1220" : "#f5f9ff";
    }
    applyTheme(root.dataset.colorScheme || "light");
    themeToggle.addEventListener("click", () => {
        const next = root.dataset.colorScheme === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem("portfolio-color-scheme", next); } catch (error) { /* Storage may be unavailable. */ }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    document.querySelectorAll(".project-details").forEach((details) => {
        const summary = details.querySelector("summary");
        details.addEventListener("toggle", () => {
            summary.firstChild.textContent = details.open ? "Hide details" : "Show details";
        });
    });

    const skillTabs = [...document.querySelectorAll(".skill-tab")];
    function selectSkillTab(tab, moveFocus = false) {
        skillTabs.forEach((item) => {
            const active = item === tab;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-selected", String(active));
            item.tabIndex = active ? 0 : -1;
            const panel = document.getElementById(item.getAttribute("aria-controls"));
            panel.hidden = !active;
            panel.classList.toggle("is-active", active);
        });
        if (moveFocus) tab.focus();
    }
    skillTabs.forEach((tab, index) => {
        tab.addEventListener("click", () => selectSkillTab(tab));
        tab.addEventListener("keydown", (event) => {
            let nextIndex = index;
            if (event.key === "ArrowRight") nextIndex = (index + 1) % skillTabs.length;
            else if (event.key === "ArrowLeft") nextIndex = (index - 1 + skillTabs.length) % skillTabs.length;
            else if (event.key === "Home") nextIndex = 0;
            else if (event.key === "End") nextIndex = skillTabs.length - 1;
            else return;
            event.preventDefault();
            selectSkillTab(skillTabs[nextIndex], true);
        });
    });

    const reel = document.getElementById("wordReel");
    const phrases = [...reel.querySelectorAll(".word-reel__phrase")];
    const headline = document.getElementById("heroHeadline");
    const playButton = document.getElementById("reelPlay");
    let currentPhrase = 0;
    let userPaused = reducedMotion.matches;
    let hovered = false;
    let focused = false;
    let reelTimer;
    function paintReel() {
        phrases.forEach((phrase, index) => {
            let offset = (index - currentPhrase + phrases.length) % phrases.length;
            if (offset > phrases.length / 2) offset -= phrases.length;
            phrase.style.setProperty("--reel-offset", offset);
            phrase.classList.toggle("is-current", offset === 0);
            phrase.classList.toggle("is-near", Math.abs(offset) === 1);
            phrase.classList.remove("is-wrapping");
        });
    }
    function updatePlayButton() {
        const paused = userPaused || hovered || focused || reducedMotion.matches;
        playButton.setAttribute("aria-label", userPaused || reducedMotion.matches ? "Play phrases" : "Pause phrases");
        playButton.querySelector("span").textContent = paused ? "▶" : "Ⅱ";
    }
    function stepPhrase(amount) {
        currentPhrase = (currentPhrase + amount + phrases.length) % phrases.length;
        paintReel();
    }
    function resetReelTimer() {
        window.clearInterval(reelTimer);
        updatePlayButton();
        if (userPaused || hovered || focused || reducedMotion.matches) return;
        reelTimer = window.setInterval(() => stepPhrase(1), 2400);
    }
    document.querySelectorAll(".reel-step").forEach((button) => button.addEventListener("click", () => {
        stepPhrase(Number(button.dataset.step));
        resetReelTimer();
    }));
    playButton.addEventListener("click", () => { userPaused = !userPaused; resetReelTimer(); });
    headline.addEventListener("pointerenter", () => { hovered = true; resetReelTimer(); });
    headline.addEventListener("pointerleave", () => { hovered = false; resetReelTimer(); });
    headline.addEventListener("focusin", () => { focused = true; resetReelTimer(); });
    headline.addEventListener("focusout", (event) => {
        if (!headline.contains(event.relatedTarget)) { focused = false; resetReelTimer(); }
    });
    reducedMotion.addEventListener("change", (event) => {
        if (event.matches) userPaused = true;
        resetReelTimer();
    });
    paintReel();
    resetReelTimer();

    const copyEmail = document.getElementById("copyEmail");
    const copyStatus = document.getElementById("copyStatus");
    copyEmail.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const email = copyEmail.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            copyEmail.setAttribute("aria-label", "Email copied");
            copyEmail.querySelector("span").textContent = "✓";
            copyStatus.textContent = "Email copied to clipboard.";
        } catch (error) {
            copyStatus.textContent = `Couldn't copy. Email: ${email}`;
        }
        window.setTimeout(() => {
            copyEmail.setAttribute("aria-label", "Copy email");
            copyEmail.querySelector("span").textContent = "▢";
        }, 2000);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
        document.getElementById("site-top").focus({ preventScroll: true });
    });

    document.querySelectorAll("[data-gallery-target][data-gallery-direction]").forEach((button) => {
        button.addEventListener("click", () => {
            const gallery = document.getElementById(button.dataset.galleryTarget);
            if (!gallery) return;
            const direction = Number(button.dataset.galleryDirection);
            const firstShot = gallery.querySelector(".personal-project-shot");
            const gap = Number.parseFloat(window.getComputedStyle(gallery).columnGap) || 0;
            const step = firstShot ? firstShot.getBoundingClientRect().width + gap : gallery.clientWidth;
            gallery.scrollBy({
                left: direction * step,
                behavior: reducedMotion.matches ? "auto" : "smooth",
            });
        });
    });

    const articleGrid = document.getElementById("articleGrid");
    articleGrid?.addEventListener("error", (event) => {
        const image = event.target;
        if (!(image instanceof HTMLImageElement) || !image.classList.contains("article-card__image")) return;
        const media = image.parentElement;
        image.remove();
        media.classList.add("article-card__media--fallback");
        const label = document.createElement("span");
        label.textContent = "Medium";
        media.append(label);
    }, true);
})();
