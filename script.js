let startTime = 0;
let elapsedTime = 0;

let timerInterval = null;

let running = false;

let lapNumber = 0;
let previousLapTime = 0;


// Get HTML elements

const minutesDisplay =
    document.getElementById("minutes");

const secondsDisplay =
    document.getElementById("seconds");

const millisecondsDisplay =
    document.getElementById("milliseconds");

const startBtn =
    document.getElementById("startBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const lapBtn =
    document.getElementById("lapBtn");

const resetBtn =
    document.getElementById("resetBtn");

const lapList =
    document.getElementById("lapList");


// START

startBtn.addEventListener("click", startStopwatch);


function startStopwatch() {

    if (running) {
        return;
    }

    running = true;

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(updateStopwatch, 10);
}


// UPDATE DISPLAY

function updateStopwatch() {

    elapsedTime = Date.now() - startTime;

    displayTime(elapsedTime);
}


// DISPLAY TIME

function displayTime(time) {

    let milliseconds =
        Math.floor((time % 1000) / 10);

    let seconds =
        Math.floor((time / 1000) % 60);

    let minutes =
        Math.floor((time / (1000 * 60)) % 60);


    minutesDisplay.textContent =
        formatTime(minutes);

    secondsDisplay.textContent =
        formatTime(seconds);

    millisecondsDisplay.textContent =
        formatTime(milliseconds);
}


// ADD LEADING ZERO

function formatTime(time) {

    return time < 10
        ? `0${time}`
        : time;
}


// PAUSE

pauseBtn.addEventListener("click", pauseStopwatch);


function pauseStopwatch() {

    if (!running) {
        return;
    }

    running = false;

    clearInterval(timerInterval);
}


// LAP

lapBtn.addEventListener("click", recordLap);


function recordLap() {

    if (!running) {
        return;
    }

    lapNumber++;

    const currentLapTime =
        elapsedTime - previousLapTime;

    previousLapTime = elapsedTime;


    const lapElement =
        document.createElement("div");

    lapElement.classList.add("lap");


    lapElement.innerHTML = `

        <span>Lap ${lapNumber}</span>

        <span>
            ${formatLapTime(currentLapTime)}
        </span>

    `;


    const emptyMessage =
        document.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }


    lapList.prepend(lapElement);
}


// FORMAT LAP TIME

function formatLapTime(time) {

    let milliseconds =
        Math.floor((time % 1000) / 10);

    let seconds =
        Math.floor((time / 1000) % 60);

    let minutes =
        Math.floor(time / (1000 * 60));


    return `${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;
}


// RESET

resetBtn.addEventListener("click", resetStopwatch);


function resetStopwatch() {

    running = false;

    clearInterval(timerInterval);

    startTime = 0;

    elapsedTime = 0;

    lapNumber = 0;

    previousLapTime = 0;


    displayTime(0);


    lapList.innerHTML = `
        <p class="empty-message">
            No laps recorded yet
        </p>
    `;
}