/* ----------------- HELPERS ----------------- */
function rand(min, max) { return Math.random() * (max - min) + min; }

/* ----------------- SLIDESHOW ----------------- */
(function initSlideshow() {
    let slides = document.getElementsByClassName("slide");
    if (!slides || slides.length === 0) return;

    let slideIndex = 0;
    const dots = document.getElementsByClassName("dot");

    function showSlides() {
        for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
        slideIndex++;
        if (slideIndex > slides.length) slideIndex = 1;
        slides[slideIndex - 1].style.display = "block";
        if (dots && dots.length >= slides.length) {
            for (let i = 0; i < dots.length; i++) dots[i].style.opacity = "0.3";
            dots[slideIndex - 1].style.opacity = "1";
        }
        setTimeout(showSlides, 2500);
    }
    showSlides();
})();

/* ----------------- HEARTS ----------------- */
(function initHearts() {
    const heartsContainer = document.getElementById("hearts");
    if (!heartsContainer) return;

    const heartInterval = setInterval(() => {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerHTML = "💗";
        heart.style.left = rand(0, 100) + "vw";
        heart.style.fontSize = (18 + Math.random() * 20) + "px";
        heart.style.opacity = String(0.8 + Math.random() * 0.4);
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 4200);
    }, 230);

    // optional: clean on page unload
    window.addEventListener("beforeunload", () => clearInterval(heartInterval));
})();

/* ----------------- BALLOONS ----------------- */
(function initBalloons() {
    const balloonsContainer = document.getElementById("balloons");
    if (!balloonsContainer) return;

    const balloonInterval = setInterval(() => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        // Use different balloon emoji variations for variety
        const picks = ["🎈", "🎈", "🎈"];
        balloon.innerHTML = picks[Math.floor(Math.random() * picks.length)];
        balloon.style.left = rand(5, 95) + "vw";
        balloon.style.fontSize = (34 + Math.random() * 30) + "px";
        balloon.style.opacity = String(0.85 - Math.random() * 0.4);
        balloonsContainer.appendChild(balloon);
        setTimeout(() => balloon.remove(), 7000 + Math.random() * 3000);
    }, 900);

    window.addEventListener("beforeunload", () => clearInterval(balloonInterval));
})();

/* ----------------- SPARKLES ----------------- */
(function initSparkles() {
    const sparkContainer = document.getElementById("sparkles");
    if (!sparkContainer) return;

    const sparkleInterval = setInterval(() => {
        const spark = document.createElement("div");
        spark.className = "sparkle";
        spark.style.left = rand(0, 100) + "vw";
        spark.style.top = rand(0, 100) + "vh";
        spark.style.opacity = String(0.7 + Math.random() * 0.4);
        sparkContainer.appendChild(spark);
        setTimeout(() => spark.remove(), 1600 + Math.random() * 800);
    }, 140);

    window.addEventListener("beforeunload", () => clearInterval(sparkleInterval));
})();

/* ----------------- FIREWORKS ----------------- */
(function initFireworks() {
    const canvas = document.getElementById("fireworks");
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;

    // full screen canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // particle / firework system
    const fireworks = [];

    function createFirework(x, y) {
        const colors = [
            [255, 99, 132],
            [255, 159, 64],
            [255, 205, 86],
            [75, 192, 192],
            [54, 162, 235],
            [153, 102, 255],
            [201, 203, 207],
            [255, 102, 178]
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const count = 28 + Math.floor(Math.random() * 20);
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = rand(1.8, 5.5);
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: rand(0.015, 0.04),
                r: 2 + Math.random() * 3,
                color: color,
            });
        }
        fireworks.push({ particles });
    }

    // spawn fireworks periodically and on click
    let lastSpawn = 0;
    function spawnTicker(ts) {
        if (!lastSpawn || ts - lastSpawn > 700 + Math.random() * 800) {
            createFirework(rand(0.15 * canvas.width, 0.85 * canvas.width), rand(0.08 * canvas.height, 0.6 * canvas.height));
            lastSpawn = ts;
        }
    }

    canvas.addEventListener("click", (e) => {
        createFirework(e.clientX, e.clientY);
    });

    function updateAndDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            for (let j = fw.particles.length - 1; j >= 0; j--) {
                const p = fw.particles[j];
                // gravity
                p.vy += 0.03;
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                // draw particle
                const alpha = Math.max(0, p.life);
                ctx.beginPath();
                ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha})`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                // small glow
                ctx.beginPath();
                ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha * 0.25})`;
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fill();

                if (p.life <= 0) fw.particles.splice(j, 1);
            }
            if (fw.particles.length === 0) fireworks.splice(i, 1);
        }
    }

    let rafId;
    function loop(ts) {
        spawnTicker(ts);
        updateAndDraw();
        rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    // cleanup on unload to prevent leaks if user navigates pages
    window.addEventListener("beforeunload", () => {
        cancelAnimationFrame(rafId);
    });
})();
