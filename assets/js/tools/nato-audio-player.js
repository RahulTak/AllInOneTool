export function init() {
    const input = document.getElementById('audio-input');
    const previewContainer = document.getElementById('audio-preview-container');
    const voiceSelect = document.getElementById('audio-voice');
    const speedInput = document.getElementById('audio-speed');
    const speedVal = document.getElementById('speed-val');
    
    const playBtn = document.getElementById('audio-play');
    const pauseBtn = document.getElementById('audio-pause');
    const stopBtn = document.getElementById('audio-stop');
    const clearBtn = document.getElementById('audio-clear');
    const resetBtn = document.getElementById('audio-reset');

    const dict = {
        'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot',
        'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett', 'K': 'Kilo', 'L': 'Lima',
        'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo',
        'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
        'Y': 'Yankee', 'Z': 'Zulu',
        '0': 'Zero', '1': 'Wun', '2': 'Too', '3': 'Tree', '4': 'Fower',
        '5': 'Fife', '6': 'Six', '7': 'Seven', '8': 'Ait', '9': 'Niner'
    };

    if (!input) return;

    let voices = [];
    function loadVoices() {
        if (typeof speechSynthesis === 'undefined') return;
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = voices
            .map((v, i) => '<option value="' + i + '">' + v.name + ' (' + v.lang + ')</option>')
            .join('');
    }
    
    loadVoices();
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    let synthSequence = [];
    let currentIdx = -1;
    let isPlaying = false;
    let isPaused = false;

    function renderPreview() {
        const text = input.value;
        previewContainer.innerHTML = '';
        synthSequence = [];

        if (!text.trim()) {
            previewContainer.innerHTML = '<span style="color:var(--text-secondary);">Type text to preview speller sequence...</span>';
            return;
        }

        const words = text.split(/\s+/);
        let chipId = 0;
        
        words.forEach((word, wIdx) => {
            if (!word) return;
            
            const wordSpan = document.createElement('div');
            wordSpan.style.display = 'flex';
            wordSpan.style.flexWrap = 'wrap';
            wordSpan.style.gap = '0.2rem';
            wordSpan.style.padding = '0.25rem 0.5rem';
            wordSpan.style.border = '1px solid var(--border-color)';
            wordSpan.style.borderRadius = 'var(--radius-sm)';
            wordSpan.style.background = 'var(--bg-secondary)';
            
            for (let i = 0; i < word.length; i++) {
                const char = word[i];
                const upper = char.toUpperCase();
                
                if (dict[upper]) {
                    const chip = document.createElement('span');
                    chip.className = 'nato-chip';
                    chip.id = 'nato-chip-' + chipId;
                    chip.textContent = dict[upper];
                    chip.style.padding = '0.1rem 0.3rem';
                    chip.style.borderRadius = 'var(--radius-xs)';
                    chip.style.fontSize = '0.85rem';
                    chip.style.fontWeight = '600';
                    chip.style.transition = 'all 0.2s';
                    
                    wordSpan.appendChild(chip);
                    synthSequence.push({ id: chipId, text: dict[upper] });
                    chipId++;
                } else {
                    const sym = document.createElement('span');
                    sym.textContent = char;
                    sym.style.padding = '0.1rem 0.1rem';
                    sym.style.fontSize = '0.85rem';
                    wordSpan.appendChild(sym);
                }
            }
            
            if (wordSpan.childNodes.length > 0) {
                previewContainer.appendChild(wordSpan);
            }
        });
        
        if (synthSequence.length === 0) {
            previewContainer.innerHTML = '<span style="color:var(--text-secondary);">No spellable characters found.</span>';
        }
    }

    function speakNext() {
        if (!isPlaying || isPaused) return;

        if (currentIdx >= 0) {
            const prevChip = document.getElementById('nato-chip-' + synthSequence[currentIdx].id);
            if (prevChip) {
                prevChip.style.background = '';
                prevChip.style.color = '';
            }
        }

        currentIdx++;
        if (currentIdx >= synthSequence.length) {
            stopPlayback();
            return;
        }

        const currentItem = synthSequence[currentIdx];
        const chip = document.getElementById('nato-chip-' + currentItem.id);
        if (chip) {
            chip.style.background = 'var(--primary-color)';
            chip.style.color = '#fff';
        }

        const utterance = new SpeechSynthesisUtterance(currentItem.text);
        
        const selectedVoiceIdx = voiceSelect.value;
        if (selectedVoiceIdx && voices[selectedVoiceIdx]) {
            utterance.voice = voices[selectedVoiceIdx];
        }
        utterance.rate = parseFloat(speedInput.value) || 1.0;

        utterance.onend = () => {
            speakNext();
        };

        utterance.onerror = (e) => {
            console.error('SpeechSynthesis error:', e);
            speakNext();
        };

        speechSynthesis.speak(utterance);
    }

    function startPlayback() {
        if (synthSequence.length === 0) return;
        if (typeof speechSynthesis === 'undefined') {
            alert('Web Speech API is not supported in this browser.');
            return;
        }

        isPlaying = true;
        isPaused = false;
        
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        
        if (currentIdx < 0) {
            speechSynthesis.cancel();
            speakNext();
        } else {
            speechSynthesis.resume();
        }
    }

    function pausePlayback() {
        if (!isPlaying) return;
        isPaused = true;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        speechSynthesis.pause();
    }

    function stopPlayback() {
        isPlaying = false;
        isPaused = false;
        
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        
        if (typeof speechSynthesis !== 'undefined') {
            speechSynthesis.cancel();
        }

        if (currentIdx >= 0 && currentIdx < synthSequence.length) {
            const chip = document.getElementById('nato-chip-' + synthSequence[currentIdx].id);
            if (chip) {
                chip.style.background = '';
                chip.style.color = '';
            }
        }
        currentIdx = -1;
    }

    input.addEventListener('input', () => {
        stopPlayback();
        renderPreview();
    });

    speedInput.addEventListener('input', () => {
        speedVal.textContent = parseFloat(speedInput.value).toFixed(1);
    });

    playBtn.addEventListener('click', startPlayback);
    pauseBtn.addEventListener('click', pausePlayback);
    stopBtn.addEventListener('click', stopPlayback);

    clearBtn.addEventListener('click', () => {
        stopPlayback();
        input.value = '';
        renderPreview();
    });

    resetBtn.addEventListener('click', () => {
        stopPlayback();
        input.value = 'hello';
        speedInput.value = '1.0';
        speedVal.textContent = '1.0';
        renderPreview();
    });

    renderPreview();
}
