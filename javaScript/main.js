// Path: /casesite/javaScript/main.js
document.addEventListener("DOMContentLoaded", function() {
    const htmlBasePath = '/html/'; // Path to the HTML components directory from the site root
    const jsBasePath = '/javaScript/'; // Path to the JavaScript directory

    async function loadComponent(componentName, targetSelector, callback) {
        try {
            const response = await fetch(`${htmlBasePath}${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}.html: ${response.statusText} (URL: ${response.url})`);
            }
            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.innerHTML = html;
                if (callback) {
                    callback();
                }
            } else {
                console.warn(`Target element ${targetSelector} not found for component ${componentName}.`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }

    // Load Header
    loadComponent('header', 'header.site-header', () => {
        // After header HTML is loaded, ensure its JavaScript is loaded and initialized
        if (typeof initializeHeader === 'function') {
            initializeHeader();
        } else {
            const headerScript = document.createElement('script');
            headerScript.src = `${jsBasePath}header.js`;
            headerScript.onload = () => {
                if (typeof initializeHeader === 'function') {
                    initializeHeader();
                } else {
                    console.error("initializeHeader function not found after loading header.js");
                }
            };
            headerScript.onerror = () => {
                console.error("Failed to load header.js");
            };
            document.body.appendChild(headerScript);
        }
    });

    // Load Footer
    loadComponent('footer', 'footer.site-footer');

    // Any other global initialization can go here
});