export function init() {
    const swBtn = document.getElementById('tab-stopwatch-btn');
    const tmBtn = document.getElementById('tab-timer-btn');
    const swView = document.getElementById('stopwatch-view');
    const tmView = document.getElementById('timer-view');

    if (swBtn) {
        swBtn.addEventListener('click', () => {
            swView.style.display = 'block';
            tmView.style.display = 'none';
        });
        tmBtn.addEventListener('click', () => {
            swView.style.display = 'none';
            tmView.style.display = 'block';
        });
    }

    // Stopwatch engine
    let swInterval = null;
    let swStart = 0;
    let swElapsed = 0;
    let laps = [];

    const swDisplay = document.getElementById('stopwatch-display');
    const swStartBtn = document.getElementById('stopwatch-start');
    const swLapBtn = document.getElementById('stopwatch-lap');
    const swResetBtn = document.getElementById('stopwatch-reset');
    const swLapsList = document.getElementById('stopwatch-laps');

    swStartBtn.addEventListener('click', () => {
        if (swInterval) {
            clearInterval(swInterval);
            swInterval = null;
            swStartBtn.textContent = 'Resume';
        } else {
            swStart = Date.now() - swElapsed;
            swInterval = setInterval(updateStopwatch, 10);
            swStartBtn.textContent = 'Pause';
        }
    });

    swLapBtn.addEventListener('click', () => {
        if (!swInterval) return;
        laps.push(swDisplay.textContent);
        swLapsList.innerHTML = laps.map((lap, i) => '<div>Lap ' + (i+1) + ': ' + lap + '</div>').join('');
    });

    swResetBtn.addEventListener('click', () => {
        clearInterval(swInterval);
        swInterval = null;
        swElapsed = 0;
        laps = [];
        swStartBtn.textContent = 'Start';
        swDisplay.textContent = '00:00:00.000';
        swLapsList.innerHTML = '';
    });

    function updateStopwatch() {
        swElapsed = Date.now() - swStart;
        let ms = swElapsed % 1000;
        let s = Math.floor(swElapsed / 1000) % 60;
        let m = Math.floor(swElapsed / 60000) % 60;
        let h = Math.floor(swElapsed / 3600000);

        swDisplay.textContent = 
            String(h).padStart(2, '0') + ':' +
            String(m).padStart(2, '0') + ':' +
            String(s).padStart(2, '0') + '.' +
            String(ms).padStart(3, '0');
    }

    // Timer engine
    let tmInterval = null;
    let tmTotal = 0;
    let tmRemaining = 0;

    const tmH = document.getElementById('timer-h');
    const tmM = document.getElementById('timer-m');
    const tmS = document.getElementById('timer-s');
    const tmDisplay = document.getElementById('timer-display');
    const tmStartBtn = document.getElementById('timer-start');
    const tmResetBtn = document.getElementById('timer-reset');
    const tmBar = document.getElementById('timer-bar');

    tmStartBtn.addEventListener('click', () => {
        if (tmInterval) {
            clearInterval(tmInterval);
            tmInterval = null;
            tmStartBtn.textContent = 'Resume';
        } else {
            if (tmRemaining === 0) {
                const hrs = parseInt(tmH.value) || 0;
                const mins = parseInt(tmM.value) || 0;
                const secs = parseInt(tmS.value) || 0;
                tmTotal = (hrs * 3600 + mins * 60 + secs) * 1000;
                tmRemaining = tmTotal;
            }
            if (tmRemaining <= 0) return;
            tmInterval = setInterval(updateTimer, 100);
            tmStartBtn.textContent = 'Pause';
        }
    });

    tmResetBtn.addEventListener('click', () => {
        clearInterval(tmInterval);
        tmInterval = null;
        tmRemaining = 0;
        tmStartBtn.textContent = 'Start';
        tmDisplay.textContent = '00:05:00';
        tmBar.style.width = '100%';
    });

    function updateTimer() {
        tmRemaining -= 100;
        if (tmRemaining <= 0) {
            clearInterval(tmInterval);
            tmInterval = null;
            tmRemaining = 0;
            tmDisplay.textContent = '00:00:00';
            tmBar.style.width = '0%';
            tmStartBtn.textContent = 'Start';
            alert('Timer Completed!');
            return;
        }

        let s = Math.floor(tmRemaining / 1000) % 60;
        let m = Math.floor(tmRemaining / 60000) % 60;
        let h = Math.floor(tmRemaining / 3600000);

        tmDisplay.textContent = 
            String(h).padStart(2, '0') + ':' +
            String(m).padStart(2, '0') + ':' +
            String(s).padStart(2, '0');

        tmBar.style.width = (tmRemaining / tmTotal * 100) + '%';
    }
}
