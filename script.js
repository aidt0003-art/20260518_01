/**
 * 청소당번 히어로즈 - 프리미엄 랜덤 추첨기 JS
 * Web Audio API 사운드 합성, HTML5 Canvas 콘페티 폭죽 효과, 다이내믹 셔플 추첨 제어
 */

// 10가지 프리미엄 청소 역할 정의
const HERO_ROLES = [
    {
        title: "빗자루 히어로",
        desc: "구석구석 먼지와 쓰레기를 쓸어 담는 전설적인 청소 전사!",
        icon: "🧹",
        gradient: "var(--gradient-cyan)",
        glow: "var(--glow-indigo)"
    },
    {
        title: "걸레 마스터",
        desc: "바닥에 묻은 얼룩을 지우고 광이 날 때까지 닦는 스페셜리스트!",
        icon: "🧽",
        gradient: "var(--gradient-emerald)",
        glow: "var(--glow-emerald)"
    },
    {
        title: "분리수거 대장",
        desc: "종이, 캔, 플라스틱을 분리수거하여 지구를 구원할 생태 수호자!",
        icon: "🗑️",
        gradient: "var(--gradient-rose)",
        glow: "var(--glow-purple)"
    },
    {
        title: "칠판 가디언",
        desc: "칠판 흔적들을 지우고 깨끗한 교실 환경을 지키는 방패 총사!",
        icon: "⬛",
        gradient: "var(--gradient-purple)",
        glow: "var(--glow-purple)"
    },
    {
        title: "창틀 요정",
        desc: "유리창과 창틀 먼지를 청결히 닦고 상쾌한 공기를 채워주는 요정!",
        icon: "🪟",
        gradient: "var(--gradient-amber)",
        glow: "var(--glow-gold)"
    },
    {
        title: "책상 밸런서",
        desc: "교실 내 모든 책상과 의자 줄을 맞춰 완벽한 균형을 유지하는 사령관!",
        icon: "🪑",
        gradient: "var(--gradient-indigo)",
        glow: "var(--glow-indigo)"
    },
    {
        title: "칠판 보조관",
        desc: "분필, 물걸레 대야, 필기 도구들의 청결도를 정밀 점검하는 집사!",
        icon: "🖌️",
        gradient: "var(--gradient-cyan)",
        glow: "var(--glow-indigo)"
    },
    {
        title: "대걸레 정비병",
        desc: "사용한 대걸레를 깨끗이 빨아 볕에 말려 전투 준비를 돕는 보급 요원!",
        icon: "🪣",
        gradient: "var(--gradient-emerald)",
        glow: "var(--glow-emerald)"
    },
    {
        title: "멀티 가디언",
        desc: "전등, 멀티탭 전원을 완벽 차단해 에너지를 절약하는 안전 점검관!",
        icon: "💡",
        gradient: "var(--gradient-amber)",
        glow: "var(--glow-gold)"
    },
    {
        title: "비품 디렉터",
        desc: "게시판 정돈, 화분 물주기, 공동 비품을 청결히 다듬는 비주얼 디렉터!",
        icon: "🪴",
        gradient: "var(--gradient-rose)",
        glow: "var(--glow-purple)"
    }
];

// Sound Synthesis Helper Class
class SoundSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playTick() {
        if (!this.enabled) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playChime() {
        if (!this.enabled) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        // C Major Arpeggio: C5 -> E5 -> G5 -> C6
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.3);
        });
    }

    playFanfare() {
        if (!this.enabled) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        // Triumphant brass progression: G5 -> C6 -> E6 -> G6
        const notes = [
            { f: 392.00, d: 0.15 }, // G5
            { f: 523.25, d: 0.15 }, // C6
            { f: 659.25, d: 0.15 }, // E6
            { f: 783.99, d: 0.5 }   // G6
        ];
        
        let offset = 0;
        notes.forEach(note => {
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(note.f, now + offset);
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(note.f * 1.006, now + offset); // Chorus feel

            gain.gain.setValueAtTime(0, now + offset);
            gain.gain.linearRampToValueAtTime(0.12, now + offset + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d - 0.01);

            osc1.start(now + offset);
            osc1.stop(now + offset + note.d);
            osc2.start(now + offset);
            osc2.stop(now + offset + note.d);

            offset += note.d * 0.8; // Legato overlapping slightly
        });
    }
}

// Confetti Particle System Class
class ConfettiEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e'];
        this.animationId = null;

        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawnBurst(x, y, count = 40) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * 80 - 40) - 90; // shoot upward in cone
            const speed = Math.random() * 14 + 10;
            const rad = (angle * Math.PI) / 180;
            this.particles.push({
                x: x,
                y: y,
                size: Math.random() * 8 + 6,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                speedX: Math.cos(rad) * speed,
                speedY: Math.sin(rad) * speed,
                gravity: 0.35,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 12 - 6,
                opacity: 1
            });
        }
        if (!this.animationId) {
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += p.gravity;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.015;

            if (p.opacity <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }
}

// Global App Controller
class App {
    constructor() {
        // App states
        this.isDrawing = false;
        this.selectedNumbers = [];
        this.history = JSON.parse(localStorage.getItem('cleaning_duty_history')) || [];

        // Utilities
        this.sound = new SoundSynth();
        this.confetti = new ConfettiEffect('confetti-canvas');

        // DOM elements cache
        this.rangeStartInput = document.getElementById('range-start');
        this.rangeEndInput = document.getElementById('range-end');
        this.pickCountInput = document.getElementById('pick-count');
        this.soundBtn = document.getElementById('sound-toggle-btn');
        this.soundStatusText = document.getElementById('sound-status-text');
        this.soundIconOn = this.soundBtn.querySelector('.icon-sound-on');
        this.soundIconOff = this.soundBtn.querySelector('.icon-sound-off');

        this.decPickBtn = document.getElementById('btn-dec-pick');
        this.incPickBtn = document.getElementById('btn-inc-pick');
        this.startDrawBtn = document.getElementById('start-draw-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.numberBoard = document.getElementById('number-board');
        this.winnersContainer = document.getElementById('winners-container');
        this.historyList = document.getElementById('history-list');
        this.clearHistoryBtn = document.getElementById('clear-history-btn');
        this.statusBadge = document.getElementById('status-badge');
        this.totalCountBadge = document.getElementById('total-count-badge');

        this.bindEvents();
        this.loadSoundSetting();
        this.generateBoard();
        this.renderHistory();
    }

    bindEvents() {
        // Range Inputs
        this.rangeStartInput.addEventListener('change', () => this.handleRangeChange());
        this.rangeEndInput.addEventListener('change', () => this.handleRangeChange());

        // Dynamic Picker counters
        this.decPickBtn.addEventListener('click', () => this.adjustPickCount(-1));
        this.incPickBtn.addEventListener('click', () => this.adjustPickCount(1));

        // Controls
        this.startDrawBtn.addEventListener('click', () => this.startDrawFlow());
        this.resetBtn.addEventListener('click', () => this.resetApp());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Sound Toggle
        this.soundBtn.addEventListener('click', () => this.toggleSound());
    }

    loadSoundSetting() {
        const saved = localStorage.getItem('sound_enabled');
        if (saved !== null) {
            const enabled = saved === 'true';
            this.sound.enabled = enabled;
            this.updateSoundUI(enabled);
        }
    }

    toggleSound() {
        const enabled = !this.sound.enabled;
        this.sound.enabled = enabled;
        localStorage.setItem('sound_enabled', enabled);
        this.updateSoundUI(enabled);
        
        // Trigger a tiny test tick to activate audio context in modern browsers
        if (enabled) {
            this.sound.init();
            this.sound.playTick();
        }
    }

    updateSoundUI(enabled) {
        if (enabled) {
            this.soundBtn.classList.add('active');
            this.soundIconOn.classList.remove('hidden');
            this.soundIconOff.classList.add('hidden');
            this.soundStatusText.textContent = "사운드 켬";
        } else {
            this.soundBtn.classList.remove('active');
            this.soundIconOn.classList.add('hidden');
            this.soundIconOff.classList.remove('hidden');
            this.soundStatusText.textContent = "사운드 끔";
        }
    }

    handleRangeChange() {
        let start = parseInt(this.rangeStartInput.value) || 1;
        let end = parseInt(this.rangeEndInput.value) || 30;

        // Validation bounds
        if (start < 1) {
            start = 1;
            this.rangeStartInput.value = 1;
        }
        if (end > 100) {
            end = 100;
            this.rangeEndInput.value = 100;
        }

        // Swapping or correcting overlap
        if (start >= end) {
            end = start + 5;
            this.rangeEndInput.value = end;
        }

        const totalItems = end - start + 1;
        this.totalCountBadge.textContent = totalItems;

        // Pick count bounds adjustment
        let currentPick = parseInt(this.pickCountInput.value) || 5;
        if (currentPick > totalItems) {
            this.pickCountInput.value = totalItems;
        }
        if (totalItems < 5 && currentPick > totalItems) {
            this.pickCountInput.value = totalItems;
        }

        this.generateBoard();
        this.resetApp(false); // Silent reset (keeps history)
    }

    adjustPickCount(delta) {
        if (this.isDrawing) return;
        
        let val = parseInt(this.pickCountInput.value) || 5;
        val += delta;

        const start = parseInt(this.rangeStartInput.value) || 1;
        const end = parseInt(this.rangeEndInput.value) || 30;
        const total = end - start + 1;

        if (val < 1) val = 1;
        if (val > Math.min(total, 20)) val = Math.min(total, 20); // Cap at 20 max to maintain card grid sizes

        this.pickCountInput.value = val;
    }

    generateBoard() {
        this.numberBoard.innerHTML = '';
        const start = parseInt(this.rangeStartInput.value) || 1;
        const end = parseInt(this.rangeEndInput.value) || 30;

        for (let i = start; i <= end; i++) {
            const tile = document.createElement('div');
            tile.className = 'number-slot';
            tile.id = `slot-${i}`;
            tile.textContent = i;
            this.numberBoard.appendChild(tile);
        }
    }

    setControlsDisabled(disabled) {
        this.isDrawing = disabled;
        this.startDrawBtn.disabled = disabled;
        this.resetBtn.disabled = disabled;
        this.decPickBtn.disabled = disabled;
        this.incPickBtn.disabled = disabled;
        this.rangeStartInput.disabled = disabled;
        this.rangeEndInput.disabled = disabled;
    }

    async startDrawFlow() {
        if (this.isDrawing) return;

        // Initialize Audio context on user gesture
        this.sound.init();

        const start = parseInt(this.rangeStartInput.value) || 1;
        const end = parseInt(this.rangeEndInput.value) || 30;
        const count = parseInt(this.pickCountInput.value) || 5;

        // Lock screen
        this.setControlsDisabled(true);
        this.statusBadge.textContent = "추첨 중...";
        this.statusBadge.className = "status-indicator drawing";

        // Reset previous board selection and cards
        this.clearBoardVisualStates();
        this.winnersContainer.innerHTML = '';
        this.selectedNumbers = [];

        // Pool of numbers to select from
        const numberPool = [];
        for (let i = start; i <= end; i++) {
            numberPool.push(i);
        }

        // Sequential Progressive reveals!
        for (let round = 0; round < count; round++) {
            // 1. Shuffling phase for this specific slot
            const shuffleTicks = 12; // Shuffles count
            const shuffleDelay = 65; // ms between ticks

            let lastShuffledTile = null;

            for (let t = 0; t < shuffleTicks; t++) {
                // Pick a temporary unselected tile
                const randomIdx = Math.floor(Math.random() * numberPool.length);
                const tempNum = numberPool[randomIdx];
                const tempTile = document.getElementById(`slot-${tempNum}`);

                if (lastShuffledTile) {
                    lastShuffledTile.classList.remove('shuffling');
                }

                if (tempTile) {
                    tempTile.classList.add('shuffling');
                    lastShuffledTile = tempTile;
                }

                this.sound.playTick();
                await new Promise(resolve => setTimeout(resolve, shuffleDelay));
            }

            // 2. Select winner using Fisher-Yates-style random draw
            const selectedIdx = Math.floor(Math.random() * numberPool.length);
            const winnerNumber = numberPool.splice(selectedIdx, 1)[0];
            this.selectedNumbers.push(winnerNumber);

            // Clean up shuffling class
            if (lastShuffledTile) {
                lastShuffledTile.classList.remove('shuffling');
            }

            // Highlight chosen number slot on the board
            const winningTile = document.getElementById(`slot-${winnerNumber}`);
            if (winningTile) {
                winningTile.classList.add('selected');
            }

            // Play celebratory chime sound
            this.sound.playChime();

            // Trigger beautiful dual canvas confetti bursts
            this.confetti.spawnBurst(0, window.innerHeight, 30);
            this.confetti.spawnBurst(window.innerWidth, window.innerHeight, 30);

            // 3. Append corresponding winner card to result box
            this.renderWinnerCard(winnerNumber, round);

            // Delay between rounds for dramatic suspense
            await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Apply ".eliminated" style to all remaining unselected numbers
        const allSlots = this.numberBoard.querySelectorAll('.number-slot');
        allSlots.forEach(slot => {
            const num = parseInt(slot.textContent);
            if (!this.selectedNumbers.includes(num)) {
                slot.classList.add('eliminated');
            }
        });

        // Play final triumph theme
        this.sound.playFanfare();

        // Release buttons
        this.setControlsDisabled(false);
        this.statusBadge.textContent = "추첨 완료";
        this.statusBadge.className = "status-indicator completed";

        // Save results to history list
        this.saveToHistory();
    }

    clearBoardVisualStates() {
        const slots = this.numberBoard.querySelectorAll('.number-slot');
        slots.forEach(slot => {
            slot.className = 'number-slot';
        });
    }

    renderWinnerCard(num, round) {
        // Remove empty placeholders if present
        const emptyState = this.winnersContainer.querySelector('.empty-results');
        if (emptyState) {
            emptyState.remove();
        }

        // Choose a dynamic duty from pre-defined heroes matching the list (loop roles if size > 10)
        const roleInfo = HERO_ROLES[round % HERO_ROLES.length];

        const card = document.createElement('div');
        card.className = 'winner-card';
        card.style.setProperty('--accent-gradient', roleInfo.gradient);
        card.style.setProperty('--glow-shadow', roleInfo.glow);

        card.innerHTML = `
            <div class="winner-badge">${num}</div>
            <div class="winner-info">
                <div class="winner-role">${roleInfo.icon} ${roleInfo.title}</div>
                <div class="winner-desc">${roleInfo.desc}</div>
            </div>
        `;

        this.winnersContainer.appendChild(card);
    }

    resetApp(clearResult = true) {
        if (this.isDrawing) return;

        this.clearBoardVisualStates();
        
        if (clearResult) {
            this.winnersContainer.innerHTML = `
                <div class="empty-results glass">
                    <div class="empty-icon">🎖️</div>
                    <p class="empty-title">아직 선정된 당번이 없습니다</p>
                    <p class="empty-desc">왼쪽의 '당번 추첨 시작!' 버튼을 눌러 영웅들을 소환해 주세요.</p>
                </div>
            `;
            this.selectedNumbers = [];
        }

        this.statusBadge.textContent = "대기 중";
        this.statusBadge.className = "status-indicator";
    }

    saveToHistory() {
        if (this.selectedNumbers.length === 0) return;

        const timestamp = new Date();
        const dateStr = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}`;
        
        const historyItem = {
            time: dateStr,
            winners: [...this.selectedNumbers].sort((a, b) => a - b)
        };

        this.history.unshift(historyItem);
        
        // Limit to last 10 records
        if (this.history.length > 10) {
            this.history.pop();
        }

        localStorage.setItem('cleaning_duty_history', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';

        if (this.history.length === 0) {
            this.historyList.innerHTML = '<li class="empty-history">기록이 없습니다.</li>';
            return;
        }

        this.history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <span> 당번: <strong>${item.winners.join(', ')}</strong></span>
                <span class="history-time">${item.time}</span>
            `;
            this.historyList.appendChild(li);
        });
    }

    clearHistory() {
        if (this.isDrawing) return;
        if (confirm("모든 추첨 기록을 삭제하시겠습니까?")) {
            this.history = [];
            localStorage.removeItem('cleaning_duty_history');
            this.renderHistory();
        }
    }
}

// Instantiate the App when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
