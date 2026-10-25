/* Cursor glow for desktop pointer devices */

var cursorGlow = document.querySelector('.cursor-glow');
var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (cursorGlow && finePointer.matches) {
    let glowX = 0;
    let glowY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationRunning = false;

    const moveGlow = () => {
        glowX += (targetX - glowX) * 0.14;
        glowY += (targetY - glowY) * 0.14;
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;

        /* keep easing until the glow is within half a pixel of the pointer */
        if (Math.abs(targetX - glowX) > 0.5 || Math.abs(targetY - glowY) > 0.5) {
            requestAnimationFrame(moveGlow);
        } else {
            animationRunning = false;
        }
    };

    document.addEventListener('mousemove', event => {
        targetX = event.clientX;
        targetY = event.clientY;
        cursorGlow.style.visibility = 'visible';

        if (!animationRunning) {
            animationRunning = true;
            requestAnimationFrame(moveGlow);
        }
    });

    /* Pointer left the page: hide the glow but keep its space reserved
       (visibility: hidden). It comes back on the next mouse move. */
    document.documentElement.addEventListener('mouseleave', () => {
        cursorGlow.style.visibility = 'hidden';
    });

    document.documentElement.addEventListener('mouseenter', () => {
        cursorGlow.style.visibility = 'visible';
    });
}
