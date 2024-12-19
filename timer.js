function startCountdown(totalSeconds) {
    let remainingTime = totalSeconds;

    const timerId = setInterval(() => {
        console.log(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(timerId);
            console.log('Time is up!');
        }

        remainingTime--;
    }, 1000);
}

module.exports = startCountdown