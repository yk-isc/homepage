(() => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    history.scrollRestoration = "manual";
    const page = document.querySelector(".page");
    page.scrollTop = 0;
    window.lenis?.stop();

    const loader = document.getElementById("loader");
    const bg = loader.querySelector(".loader-bg");
    const win = loader.querySelector(".loader-window");
    const count = loader.querySelector(".loader-count");
    const heroBox = document.querySelector(".hero .div2");
    const heroImg = heroBox.querySelector("img")
    const heroHead = document.querySelector(".hero-title h1");
    const heroTexts = gsap.utils.toArray(".herotext-1, .herotext-2");

    // start
    gsap.set(heroBox, { opacity: 0 });
    gsap.set(heroImg, { opacity: 0 });
    gsap.set(heroHead, { yPercent: 120, opacity: 0});
    gsap.set("header", { yPercent: -100, opacity: 0 });
    gsap.set(heroTexts, { y: 40, opacity: 0 });

    // progress
    const imgs = [...document.images];
    let remaining = imgs.length + 1;
    const total = remaining;
    const progress = { value: 0 };
    let last = -1

    const render = () => {
        const val = Math.round(progress.value);
        if (val === last) return;
        last = val;
        count.textContent = String(val).padStart(3, "0") + "%";
    };

    const loaded = new Promise((resolve) => {
        const tick = () => {
            remaining--;
            gsap.to(progress, {
                value: ((total - remaining) / total) * 100,
                duration: 0.4,
                ease: "power2.out",
                onUpdate: render,
            });
            if (remaining === 0) resolve();
        };

        imgs.forEach((img) => {
            img.decode().catch(() => {}).then(tick);
        });
        document.fonts.ready.then(tick);
    });

    const minTime = new Promise((res) => setTimeout(res, 900));

    let started = false;
    const begin = () => { if (started) return; started = true; reveal(); };
    Promise.all([loaded, minTime]).then(begin);
    setTimeout(begin, 8000);

    function reveal() {
        const target = heroBox.getBoundingClientRect();
        const start = win.getBoundingClientRect();

        gsap.set(win, {
            left: start.left,
            top: start.top,
            width: start.width,
            height: start.height,
            margin: 0,
        });

        const t1 = gsap.timeline({
            onComplete: () => {
                loader.remove();
                window.lenis?.start();
                requestAnimationFrame(() => ScrollTrigger.refresh());
            },
        });

        t1.set(progress, { value: 100 })
        .call(render)
        .set(loader, { pointerEvents: "none" })
        // count will fade when the small window appears
        .to(count, {opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.2 })
        .to(win, { opacity: 1, duration: 0.3 }, "<")
        //window grows to window around hero
        .to(win, {
            left: target.left,
            top: target.top,
            width: target.width,
            height: target.height,
            duration: 1.4,
            ease: "power4.inOut",
        })
        // hand it off since hero box has same border n handles
        .set(heroBox, { opacity: 1 })
        .set(win, { opacity: 0 })
        .set(bg, { autoAlpha: 0 })
        // hero loads in here
        .to(heroImg, {
            opacity: 1,
            duration: 0.8, 
            ease: "power2.out",
        })
        .to(heroImg, {
            opacity: 1, 
            duration: 0.8, 
            ease: "power2.out",
        })
        .to(heroHead, {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
        }, "-=0.5")
        .to("header", {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
        }, "<")
        .to(heroTexts, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.15,
        }, "<0.1");   
    }
})();