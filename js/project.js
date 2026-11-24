document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const page = document.querySelector(".page");
    ScrollTrigger.defaults({ scroller: page });
    
    if (!window.lenis) {
    console.error("window.lenis missing: menu.js failed or loads after project.js");
    return;
    }
    window.lenis.on("scroll", ScrollTrigger.update); // menu.js's Lenis, no new one

    const cards = gsap.utils.toArray(".project-card");
    const rotations = [-12, 10, -5, 5, -5, -2];
    const total = cards.length;

    gsap.set(cards, {
        y: () => page.clientHeight,
        rotate: (i) => rotations[i % rotations.length],
    });

    ScrollTrigger.create({
        trigger: ".projects",
        scroller: page,
        start: "top top",
        end: () => `+=${page.clientHeight * (total + 1)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const perCard = 1 / total;

            cards.forEach((card, i) => {
                const start = i * perCard;
                const p = gsap.utils.clamp(0, 1, (progress - start) / perCard);

                let y = page.clientHeight * (1 - p);
                let x = 0;

                if (p === 1 && i < total - 1) {
                    const rest = (progress - (start + perCard)) / (1 - (start + perCard));
                    if (rest > 0) {
                        const m = 1 - i * 0.15;
                        x = -page.clientWidth * 0.3 * m * rest;
                        y = -page.clientHeight * 0.3 * m * rest;
                    }
                }

                gsap.set(card, { x, y });
            });
        },
    });
});