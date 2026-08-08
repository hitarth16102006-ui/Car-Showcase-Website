/* Cursor glow for desktop pointer devices */

var cursorGlow = document.querySelector('.cursor-glow');
var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (cursorGlow && finePointer.matches) {
    var glowX = 0;
    var glowY = 0;
    var targetX = 0;
    var targetY = 0;
    var animationRunning = false;

    function moveGlow() {
        glowX += (targetX - glowX) * 0.14;
        glowY += (targetY - glowY) * 0.14;
        cursorGlow.style.transform = 'translate(' + glowX + 'px, ' + glowY + 'px)';

        if (Math.abs(targetX - glowX) > 0.5 || Math.abs(targetY - glowY) > 0.5) {
            requestAnimationFrame(moveGlow);
        } else {
            animationRunning = false;
        }
    }

    document.addEventListener('mousemove', function (event) {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!animationRunning) {
            animationRunning = true;
            requestAnimationFrame(moveGlow);
        }
    });
}
