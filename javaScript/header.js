// Path: /casesite/javaScript/header.js
// (Content as you provided is fine, ensure initializeHeader is global)
function initializeHeader() {
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettingsBtn = document.getElementById("close-settings"); // Corrected variable name
    const soundToggle = document.getElementById("sound-toggle");

    if (settingsBtn && settingsModal && closeSettingsBtn && soundToggle) {
        settingsBtn.addEventListener("click", () => {
            settingsModal.classList.remove("hidden");
        });

        closeSettingsBtn.addEventListener("click", () => { // Use corrected variable name
            settingsModal.classList.add("hidden");
        });

        soundToggle.addEventListener("change", () => {
            const audios = settingsModal.querySelectorAll("audio"); 
            audios.forEach(audio => {
                audio.muted = !soundToggle.checked;
            });
        });
        // Initial state for sound
        const audios = settingsModal.querySelectorAll("audio");
        audios.forEach(audio => {
            audio.muted = !soundToggle.checked;
        });

    } else {
        console.warn("Header settings elements not fully initialized. Check selectors if this message persists after header load.");
    }
}

// If main.js loads this script dynamically, initializeHeader might not be immediately global.
// However, the onload callback in main.js should handle this.
// Alternatively, if this script is included directly in HTML pages, initializeHeader() will be global.
// For the dynamic loading approach in main.js, this structure is fine.