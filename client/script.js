const socket = io();

const messagesContainer = document.getElementById('messages');

let interval;

let globalRoom = "";

socket.on('message', (data) => {
    console.log(data);
    document.getElementById("messages").innerHTML += "<br>" + `${data.displayName}: ${data.message}`
});

document.getElementById("joinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    displayName = document.getElementById("displayName").value;
    room = document.getElementById("roomName").value;
    globalRoom = room; 
    socket.emit("SetDisplayName", displayName) 
    socket.emit("JoinRoom", room);
});

document.getElementById("sendMessage").addEventListener("submit", (e) => {
    e.preventDefault();
    message = document.getElementById("messageBox").value;
    socket.emit("SendMessage", {room:globalRoom,message:message}) 
});

socket.on("updateTimer", (data) => {
    const { remainingTime, isRunning } = data;
    updateTimerDisplay(remainingTime);

    if (isRunning && !interval) {
        startLocalTimer(remainingTime);
    } else if (!isRunning && interval) {
        stopLocalTimer();
    }
});

document.getElementById("startBtn").addEventListener("click", () => {
    socket.emit("startTimer", globalRoom);
});

document.getElementById("pauseBtn").addEventListener("click", () => {
    socket.emit("pauseTimer", globalRoom);
});

function startLocalTimer(remainingTime) {
    stopLocalTimer();
    interval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime -= 1;
            updateTimerDisplay(remainingTime);
        }
    }, 1000);
}

function stopLocalTimer() {
    clearInterval(interval);
    interval = null;
}

function updateTimerDisplay(seconds) {
    const display = document.getElementById("timerDisplay");
    display.textContent = `${Math.floor(seconds / 60)}:${seconds % 60}`;
}
