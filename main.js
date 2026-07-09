document.addEventListener("DOMContentLoaded", function () {
    /* -------- DARK MODE PERSISTENCE & TOGGLE -------- */
    const darkBtn = document.getElementById("darkToggle");
    const themeIcon = document.getElementById("themeIcon");

    if (darkBtn && themeIcon) {
        const updateThemeIcon = () => {
            const isDark = document.body.classList.contains("dark");
            if (isDark) {
                // Sun icon
                themeIcon.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.45 0l1.42 1.42 1.79-1.8-1.41-1.41-1.8 1.79zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm8-11h3v-1h-3v1zM1 12h3v-1H1v1zm15.24 6.16l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM4.22 18.36l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42zM12 6a6 6 0 100 12 6 6 0 000-12z"/>
                    </svg>
                `;
            } else {
                // Moon icon
                themeIcon.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 12.79A9 9 0 0 1 11.21 3c0-.34.02-.67.05-1A9 9 0 1 0 22 13.74c-.33.03-.66.05-1 .05z"/>
                    </svg>
                `;
            }
        };

        // Sync initial icon state based on class applied by the inline head script
        updateThemeIcon();

        darkBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeIcon();
        });
    }

    /* -------- LIVE CURRENT TIME -------- */
    const currentTimeEl = document.getElementById("currentTime");
    if (currentTimeEl) {
        const updateCurrentTime = () => {
            const now = new Date();
            currentTimeEl.innerText = now.toLocaleTimeString("bn-BD");
        };
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
    }
});
