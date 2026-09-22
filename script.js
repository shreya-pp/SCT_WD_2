let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let running = false;
let lapNumber = 0;
let previousLapTime = 0;
let lastActionAt = 0;
let lapEntries = [];

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const millisecondsDisplay = document.getElementById("milliseconds");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const clearLapsBtn = document.getElementById("clearLapsBtn");
const lapList = document.getElementById("lapList");
const statusPill = document.getElementById("statusPill");
const lapCount = document.getElementById("lapCount");
const themeToggle = document.getElementById("themeToggle");

function setButtonState() {
    startBtn.disabled = running;
    pauseBtn.disabled = !running;
    lapBtn.disabled = !running;
    clearLapsBtn.disabled = lapEntries.length === 0;
}

function updateStatus(text) {
    statusPill.textContent = text;
}

function displayTime(time) {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);

    minutesDisplay.textContent = formatTime(minutes);
    secondsDisplay.textContent = formatTime(seconds);
    millisecondsDisplay.textContent = formatTime(milliseconds);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function formatLapTime(time) {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor(time / (1000 * 60));

    return `${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;
}

function startStopwatch() {
    if (running || Date.now() - lastActionAt < 120) {
        return;
    }

    running = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateStopwatch, 10);
    lastActionAt = Date.now();
    updateStatus("Running");
    setButtonState();
}

function updateStopwatch() {
    elapsedTime = Date.now() - startTime;
    displayTime(elapsedTime);
}

function pauseStopwatch() {
    if (!running || Date.now() - lastActionAt < 120) {
        return;
    }

    running = false;
    clearInterval(timerInterval);
    lastActionAt = Date.now();
    updateStatus("Paused");
    setButtonState();
}

function getLapHighlights() {
    if (lapEntries.length === 0) {
        return { fastest: null, slowest: null };
    }

    const lapTimes = lapEntries.map((lap) => lap.value);

    return {
        fastest: Math.min(...lapTimes),
        slowest: Math.max(...lapTimes)
    };
}

function renderLaps() {
    if (lapEntries.length === 0) {
        lapList.innerHTML = '<p class="empty-message">No laps recorded yet</p>';
        lapCount.textContent = "0 laps";
        clearLapsBtn.disabled = true;
        return;
    }

    const { fastest, slowest } = getLapHighlights();
    const lapItems = lapEntries
        .slice()
        .reverse()
        .map((lap) => {
            const lapElement = document.createElement("div");
            lapElement.classList.add("lap");

            if (lap.value === fastest) {
                lapElement.classList.add("fastest");
            }

            if (lap.value === slowest) {
                lapElement.classList.add("slowest");
            }

            lapElement.innerHTML = `
                <span class="lap-label">
                    <span class="lap-badge">#${lap.number}</span>
                    ${lap.value === fastest && lap.value === slowest ? "Best / Slowest" : lap.value === fastest ? "Fastest" : lap.value === slowest ? "Slowest" : "Lap"}
                </span>
                <span class="lap-time">${formatLapTime(lap.value)}</span>
            `;

            return lapElement;
        });

    lapList.innerHTML = "";
    lapItems.forEach((lapElement) => lapList.appendChild(lapElement));
    lapCount.textContent = `${lapEntries.length} ${lapEntries.length === 1 ? "lap" : "laps"}`;
    clearLapsBtn.disabled = false;
}

function recordLap() {
    if (!running || Date.now() - lastActionAt < 120) {
        return;
    }

    lapNumber += 1;
    const currentLapTime = elapsedTime - previousLapTime;
    previousLapTime = elapsedTime;

    lapEntries.push({
        number: lapNumber,
        value: currentLapTime
    });

    lastActionAt = Date.now();
    renderLaps();
}

function clearLaps() {
    if (lapEntries.length === 0) {
        return;
    }

    lapEntries = [];
    lapNumber = 0;
    previousLapTime = 0;
    renderLaps();
}

function resetStopwatch() {
    running = false;
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;
    lapNumber = 0;
    previousLapTime = 0;
    lapEntries = [];
    lastActionAt = 0;

    displayTime(0);
    renderLaps();
    updateStatus("Ready");
    setButtonState();
}

function setTheme(mode) {
    const isDark = mode === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    localStorage.setItem("stopwatch-theme", mode);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem("stopwatch-theme") || "light";
    setTheme(savedTheme);
}

startBtn.addEventListener("click", startStopwatch);
pauseBtn.addEventListener("click", pauseStopwatch);
lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetStopwatch);
clearLapsBtn.addEventListener("click", clearLaps);
themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(nextTheme);
});

document.addEventListener("keydown", (event) => {
    if (event.repeat) {
        return;
    }

    if (event.target && ["BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) {
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();
        if (running) {
            pauseStopwatch();
        } else {
            startStopwatch();
        }
    }

    if (event.key.toLowerCase() === "l") {
        event.preventDefault();
        recordLap();
    }
});

initializeTheme();
displayTime(0);
renderLaps();
setButtonState();
updateStatus("Ready");