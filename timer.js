let startTime;
let timerInterval;
let elapsedTimeDuringPause = 0;
export let ELAPSEDTIME = 0;

// Function to start the timer
export function startTimer() {
  startTime = Date.now() - elapsedTimeDuringPause; // Adjust start time if resuming from pause
  timerInterval = setInterval(updateTime, 1000); // Update every second
}

// Function to stop the timer
export function stopTimer() {
  clearInterval(timerInterval);
  elapsedTimeDuringPause = 0; // Reset elapsed time on stop
}

// Function to pause the timer
export function pauseTime() {
  clearInterval(timerInterval);
  elapsedTimeDuringPause = Date.now() - startTime; // Save elapsed time during pause
}

// Function to unpause the timer
export function unPauseTime() {
  startTimer(); // Resume timer from paused state
}

// Function to update the timer
function updateTime() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);

  // Format time as MM:SS
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // Update the HTML element
  document.getElementById("time").textContent = `${formattedTime}`;
  ELAPSEDTIME = elapsedTime;
}
