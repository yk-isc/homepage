function playSound(soundName) {
    const audio = document.querySelector("#" + soundName);
    if (!audio) return;

    audio.muted = false;
    audio.volume = 1; // change volume here if needed

    if (audio.readyState < 4 || !audio.duration) {
        audio.load();
        audio.addEventListener(
            "canplaythrough",
            () => {
                audio
                    .play()
                    .catch((err) =>
                    console.error("Playback of " + soundName + " failed:", err),
                    );
            },
            { once: true },
        );
    } else {
        audio
        .play()
        .catch((err) =>
            console.error("Playback of " + soundName + " failed:", err),
        );
    }
}

window.addEventListener("mousemove", (e)=>{
    let cursor = document.getElementById("cursor");
    setTimeout(()=>{
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
    }, 100)

    let hovered = e.target.closest(".window");
    document.querySelectorAll(".window.activity").forEach(win => {
        if (win === hovered) {
            win.classList.add("activity")

            const handles = win.querySelectorAll(".handle");
            handles.forEach(handle => {
                handle.style.backgroundColor = "var(--secondary-color)";
            })
        }
        else {
            win.classList.remove("activity");

            const handles = win.querySelectorAll(".handle");
            handles.forEach(handle => {
                handle.style.backgroundColor = "var(--main-text)";
                handle.style.boxShadow = "none";
            })
        }
    })

    if (hovered) {
        hovered.classList.add("activity")
    }

    cursor.classList.toggle("active", !!e.target.closest(".window, .folder-ch"));
    cursor.classList.toggle("shrink", !!e.target.closest('.retro'));
})