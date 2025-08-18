// This file initializes the reveal.js presentation and contains custom javascript for animations and slide-specific interactions.
Reveal.initialize({
    center: true,
    hash: true
});
let animationState = {
    timeoutId: null,
    animationFrameId: null
};

let animatingFragments = false;

Reveal.on('slidechanged', function(event) {
    if (animationState.timeoutId) {
        clearTimeout(animationState.timeoutId);
    }
    if (animationState.animationFrameId) {
        cancelAnimationFrame(animationState.animationFrameId);
    }
    animationState.timeoutId = null;
    animationState.animationFrameId = null;

    const el = document.getElementById('participant-count');

    if (event.indexh === 2 && event.indexv === 0) {
        const target = 10000;
        const duration = 4000;
        const delay = 500;

        let startTime = null;

        function animateCount(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }
            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString();

            if (progress < duration) {
                animationState.animationFrameId = requestAnimationFrame(animateCount);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        el.textContent = '0';
        animationState.timeoutId = setTimeout(() => {
            requestAnimationFrame(animateCount);
        }, delay);

    } else if (el) {
        if (event.previousSlide && 
            event.previousSlide.querySelector('#participant-count')) {
            setTimeout(() => {
                const currentValue = parseInt(el.textContent.replace(/,/g, ''));
                let startTime = null;
                
                function animateDown(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const duration = 1000;
                    const t = Math.min(progress / duration, 1);
                    const eased = Math.pow(1 - t, 2);
                    const current = Math.floor(eased * currentValue);
                    
                    el.textContent = current.toLocaleString();
                    
                    if (progress < duration) {
                        requestAnimationFrame(animateDown);
                    } else {
                        el.textContent = '0';
                    }
                }
                
                requestAnimationFrame(animateDown);
            }, 300);
        } else {
            el.textContent = '0';
        }
    }

    // Only run on "Competition Rounds" slide
    if (event.currentSlide.querySelector('h2') &&
        event.currentSlide.querySelector('h2').textContent.includes('Competition Rounds')) {
        let fragmentIndex = 0;
        let fragments = event.currentSlide.querySelectorAll('.fragment');
        animatingFragments = true;

        function showNextFragment() {
            if (fragmentIndex < fragments.length) {
                Reveal.nextFragment();
                fragmentIndex++;
                setTimeout(showNextFragment, 2000); // 2 seconds between fragments
            } else {
                animatingFragments = false;
            }
        }
        setTimeout(showNextFragment, 2000);
    } else {
        animatingFragments = false;
    }
});

// Prevent navigation while animating fragments
document.addEventListener('keydown', function(e) {
    if (animatingFragments && (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        e.stopPropagation();
    }
});
document.addEventListener('click', function(e) {
    if (animatingFragments) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);