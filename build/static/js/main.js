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

    const counters = [...document.querySelectorAll(".impact-stat__value")];
    function animateCounter(element) {
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || "";
        if (reducedMotion.matches) { element.textContent = `${target}${suffix}`; return; }
        const start = performance.now();
        const duration = 1200;
        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            element.textContent = `${Math.round(target * eased)}${suffix}`;
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });
    counters.forEach((counter) => counterObserver.observe(counter));

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

    const articleGrid = document.getElementById("articleGrid");
    const articleFeedNote = document.getElementById("articleFeedNote");
    const feedUrl = window.__MEDIUM_FEED;
    function safeWebUrl(value) {
        try {
            const url = new URL(value);
            return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
        } catch (error) {
            return "";
        }
    }
    function makeArticleCard(article) {
        const href = safeWebUrl(article.link);
        if (!href) return null;

        const card = document.createElement("a");
        card.className = "article-card";
        card.href = href;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        const media = document.createElement("span");
        media.className = "article-card__media";
        media.setAttribute("aria-hidden", "true");
        let thumbnailSource = article.thumbnail || article.image;
        if (!thumbnailSource && article.description) {
            const descriptionDocument = new DOMParser().parseFromString(article.description, "text/html");
            thumbnailSource = descriptionDocument.querySelector("img")?.getAttribute("src");
        }
        const thumbnail = safeWebUrl(thumbnailSource);
        if (thumbnail) {
            const image = document.createElement("img");
            image.src = thumbnail;
            image.alt = "";
            image.loading = "lazy";
            image.referrerPolicy = "no-referrer";
            image.addEventListener("error", () => {
                image.remove();
                media.classList.add("article-card__media--fallback");
                media.textContent = "Medium";
            }, { once: true });
            media.append(image);
        } else {
            media.classList.add("article-card__media--fallback");
            media.textContent = "Medium";
        }

        const body = document.createElement("span");
        body.className = "article-card__body";
        const date = document.createElement("span");
        date.className = "article-card__date";
        const parsedDate = article.pubDate ? new Date(article.pubDate) : null;
        date.textContent = parsedDate && !Number.isNaN(parsedDate.valueOf())
            ? parsedDate.toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })
            : "Medium article";

        const title = document.createElement("span");
        title.className = "article-card__title";
        title.textContent = article.title || "Untitled article";
        const summary = document.createElement("span");
        summary.className = "article-card__summary";
        const parsed = new DOMParser().parseFromString(article.description || "", "text/html");
        const excerpt = (parsed.body.textContent || "").trim();
        summary.textContent = excerpt
            ? `${excerpt.slice(0, 150).replace(/\s+\S*$/, "")}…`
            : "Read this article on Medium.";
        const read = document.createElement("span");
        read.className = "article-card__read";
        read.append(document.createTextNode("Read article "));
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        read.append(arrow);
        const newTab = document.createElement("span");
        newTab.className = "visually-hidden";
        newTab.textContent = " (opens in a new tab)";

        body.append(date, title, summary, read);
        card.append(media, body, newTab);
        return card;
    }
    if (feedUrl && articleGrid) {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) throw new Error("Medium feed request failed");
                return response.json();
            })
            .then((data) => {
                if (data.status !== "ok" || !Array.isArray(data.items) || data.items.length === 0) {
                    throw new Error("No Medium articles returned");
                }
                const cards = data.items.slice(0, 6).map(makeArticleCard).filter(Boolean);
                if (!cards.length) throw new Error("No valid Medium article links");
                articleGrid.replaceChildren(...cards);
                articleFeedNote.textContent = "Recent articles from Medium.";
            })
            .catch(() => {
                articleFeedNote.textContent = "Showing selected articles. Visit Medium for more writing.";
            });
    }
})();
