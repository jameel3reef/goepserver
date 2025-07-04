// Dark Mode functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const html = document.documentElement;
    
    // Enable transitions after page load to prevent flash
    // We delay this slightly to ensure the page is fully rendered
    setTimeout(() => {
        document.body.classList.add('transition-colors');
    }, 100);
    
    // Function to set theme
    const setTheme = (isDark, enableAnimation = false) => {
        const slider = document.querySelector('.slider');
        
        if (isDark) {
            body.classList.add('dark-mode');
            html.setAttribute('data-theme', 'dark');
            if (themeToggle) {
                // Temporarily disable transitions for initialization
                if (!enableAnimation && slider) {
                    slider.classList.add('no-transition');
                }
                themeToggle.checked = true;
                if (!enableAnimation && slider) {
                    // Re-enable transitions after a short delay
                    setTimeout(() => {
                        slider.classList.remove('no-transition');
                    }, 50);
                }
            }
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            html.setAttribute('data-theme', 'light');
            if (themeToggle) {
                // Temporarily disable transitions for initialization
                if (!enableAnimation && slider) {
                    slider.classList.add('no-transition');
                }
                themeToggle.checked = false;
                if (!enableAnimation && slider) {
                    // Re-enable transitions after a short delay
                    setTimeout(() => {
                        slider.classList.remove('no-transition');
                    }, 50);
                }
            }
            localStorage.setItem('theme', 'light');
        }
    };
    
    // Initialize theme based on:
    // 1. User's saved preference
    // 2. System preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        // User has a saved preference (no animation on init)
        setTheme(savedTheme === 'dark', false);
    } else {
        // Check system preference (no animation on init)
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark, false);
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a preference (no animation for system changes)
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches, false);
        }
    });
    
    // Toggle theme when switch is toggled
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            setTheme(themeToggle.checked, true); // Enable animation for user clicks
        });
    }
});

// Immediate theme application to prevent flash
(function() {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // Check system preference if no saved theme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply dark mode immediately if needed
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();