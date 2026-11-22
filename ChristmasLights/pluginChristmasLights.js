// christmasLights.js

const CHRISTMAS_LIGHTS = true;

if (CHRISTMAS_LIGHTS) {

(function () {

    const TARGET_SELECTOR = ".wrapper-outer.dashboard-panel";
    const NUM_LIGHTS = parseInt(window.innerWidth / 64);
    const COLORS = ["#ff4040", "#40ff40", "#40b9ff", "#ffff66", "#ff80ff"];
    const STORAGE_KEY = "christmasLightsVisible";
    const HIDDEN_HOVER_OPACITY = 0.35;

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        const target = document.querySelector(TARGET_SELECTOR);
        if (!target) return console.warn("Christmas Lights: Target not found");

        const css = `
        .xmas-lights-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            pointer-events: none;
            z-index: 999;
            overflow: visible;
            transition: opacity 0.5s ease;
        }
        .xmas-bulb {
            position: absolute;
            width: 12px;
            height: 13px;
            background-color: #ff4040;
            border-radius: 35% 35% 80% 80%;
            box-shadow: 0 0 6px rgba(255,255,180,0.3);
            transform: translateX(-50%);
            opacity: 0.5;
            transition: opacity 0.25s, filter 0.25s;
            box-shadow: 0 0 16px rgba(255,255,180,0.3), 0 0 18px rgba(255,255,180,0.5);
        }
        .xmas-bulb.on {
            opacity: 0.8;
            filter: brightness(1.1);
            box-shadow: 0 0 16px rgba(255,255,180,0.8), 0 0 18px rgba(255,255,180,0.5);
        }
        .xmas-lights-container.xmas-lights-hidden {
            opacity: 0;
        }
        .xmas-lights-container.xmas-lights-hidden.xmas-lights-peek {
            opacity: ${HIDDEN_HOVER_OPACITY};
        }
        `;
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);

        target.style.position = "relative";

        let isVisible = true;
        try { isVisible = localStorage.getItem(STORAGE_KEY) !== "0"; } catch (e) {}

        const container = document.createElement("div");
        container.className = "xmas-lights-container";
        container.classList.toggle("xmas-lights-hidden", !isVisible);
        target.prepend(container);

        // Create SVG for wire
        const wireSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        wireSVG.setAttribute("width", "100%");
        wireSVG.setAttribute("height", "50px");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("stroke", "#111213");
        path.setAttribute("stroke-width", "1");
        path.setAttribute("fill", "transparent");

        wireSVG.appendChild(path);
        container.appendChild(wireSVG);

        const bulbPositions = [];

        // Create bulbs and store vertical positions
        for (let i = 0; i < NUM_LIGHTS; i++) {
            const bulb = document.createElement("div");
            bulb.className = "xmas-bulb";

            const offset = 1.5;
            const pos = (((i + 0.1) / NUM_LIGHTS) * 100) + offset;

            bulb.style.left = pos + "%";
            bulb.style.background = COLORS[i % COLORS.length];

            const bulbOffsetY = 5 + Math.sin((i / NUM_LIGHTS) * 4 * Math.PI) * 4;
            bulb.style.top = `${bulbOffsetY}px`;
            bulbPositions.push(bulbOffsetY);

            container.append(bulb);

            (function(b) {
                function blink() {
                    b.classList.toggle("on");
                    setTimeout(blink, 400 + Math.random() * 2000);
                }
                blink();
            })(bulb);
        }

        // Update wire path based on bulb positions
        updateWirePath(wireSVG, bulbPositions);

        function updateWirePath(svgElement, bulbPositions) {
            let pathData = `M0,${bulbPositions[0]} `;
            const width = svgElement.clientWidth;

            for (let i = 1; i < NUM_LIGHTS; i++) {
                const x = (i / NUM_LIGHTS) * width;
                const y = bulbPositions[i];
                pathData += `L${x},${y} `;
            }
            pathData += `L${width},${bulbPositions[NUM_LIGHTS - 1]}`;

            svgElement.querySelector("path").setAttribute("d", pathData);
        }

        // Toggle visibility of lights and wire
        const containerHeight = 18;

        function inLightsArea(event) {
            const mouseY = event.clientY - target.getBoundingClientRect().top;
            return mouseY >= 0 && mouseY <= containerHeight;
        }

        target.addEventListener("click", function (event) {
            if (!inLightsArea(event)) return;
            isVisible = !isVisible;
            container.classList.toggle("xmas-lights-hidden", !isVisible);
            try { localStorage.setItem(STORAGE_KEY, isVisible ? "1" : "0"); } catch (e) {}
        });

        target.addEventListener("mousemove", function (event) {
            container.classList.toggle("xmas-lights-peek", inLightsArea(event));
        });

        target.addEventListener("mouseleave", function () {
            container.classList.remove("xmas-lights-peek");
        });

    });

})();

}
