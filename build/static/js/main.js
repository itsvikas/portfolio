/* ═══════════════════════════════════════════════
   PORTFOLIO — JavaScript
   ═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initScrollSpy();
    initRevealAnimations();
    initMediumFeed();
});

/* ─── Navbar: scroll shadow + mobile toggle ─── */
function initNavbar() {
    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 10);
    });

    toggle.addEventListener("click", () => {
        links.classList.toggle("open");
        toggle.classList.toggle("active");
    });

    // Close mobile nav on link click
    links.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            links.classList.remove("open");
            toggle.classList.remove("active");
        });
    });
}

/* ─── Scroll Spy: highlight active nav link ─── */
function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${id}`
                        );
                    });
                }
            });
        },
        { rootMargin: "-30% 0px -70% 0px" }
    );

    sections.forEach(section => observer.observe(section));
}

/* ─── Scroll-reveal with IntersectionObserver ─── */
function initRevealAnimations() {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    reveals.forEach(el => observer.observe(el));
}

/* ─── Medium RSS Feed via rss2json ─── */
function initMediumFeed() {
    const feedUrl = window.__MEDIUM_FEED;
    const grid = document.getElementById("blogGrid");
    const loading = document.getElementById("blogLoading");
    const error = document.getElementById("blogError");

    if (!feedUrl || feedUrl.includes("yourusername")) {
        // Placeholder: no real feed configured
        loading.innerHTML = `
            <i class="fas fa-rss"></i>
            <p>Configure your Medium RSS feed URL in <code>app.py</code> to display articles here.</p>
        `;
        return;
    }

    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.status !== "ok" || !data.items || data.items.length === 0) {
                throw new Error("No articles found");
            }

            loading.style.display = "none";
            const articles = data.items.slice(0, 6);

            articles.forEach(article => {
                const date = new Date(article.pubDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });

                // Extract first image from content or use thumbnail
                let thumb = article.thumbnail;
                if (!thumb) {
                    const match = article.description.match(/<img[^>]+src="([^"]+)"/);
                    if (match) thumb = match[1];
                }

                // Extract plain text excerpt
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = article.description;
                const excerpt = tempDiv.textContent.slice(0, 140).trim() + "…";

                const card = document.createElement("a");
                card.href = article.link;
                card.target = "_blank";
                card.rel = "noopener";
                card.className = "blog-card";

                card.innerHTML = `
                    ${thumb ? `<img src="${thumb}" alt="" class="blog-card-thumb" loading="lazy">` : ""}
                    <span class="blog-card-date">${date}</span>
                    <h3 class="blog-card-title">${article.title}</h3>
                    <p class="blog-card-excerpt">${excerpt}</p>
                    <span class="blog-card-read">Read more →</span>
                `;

                grid.appendChild(card);
            });
        })
        .catch(() => {
            loading.style.display = "none";
            error.style.display = "block";
        });
}
