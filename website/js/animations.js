/**
 * PKM-Universe Trade Animations
 * Confetti, particle effects, and trade celebrations
 */

class TradeAnimations {
    constructor() {
        this.confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];
        this.shinyColors = ['#ffd700', '#fff700', '#ffec00', '#ffe100', '#ffc800'];
        this.audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
        this.init();
    }

    init() {
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'animation-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Particles array
        this.particles = [];
        this.animating = false;

        // Preload sounds
        this.sounds = {
            trade: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dnZmXmJeVkpGOjIqJh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/'),
            shiny: new Audio('data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTs='),
            levelUp: new Audio('data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTs=')
        };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Create confetti explosion
    confetti(x, y, count = 100, isShiny = false) {
        const colors = isShiny ? this.shinyColors : this.confettiColors;

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x || this.canvas.width / 2,
                y: y || this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.3,
                friction: 0.99,
                opacity: 1,
                type: 'confetti',
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }

        if (!this.animating) {
            this.animate();
        }

        if (this.audioEnabled) {
            this.playSound(isShiny ? 'shiny' : 'trade');
        }
    }

    // Create sparkle effect for shiny Pokemon
    sparkles(x, y, duration = 2000) {
        const startTime = Date.now();
        const createSparkle = () => {
            if (Date.now() - startTime > duration) return;

            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    x: x + (Math.random() - 0.5) * 100,
                    y: y + (Math.random() - 0.5) * 100,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    color: this.shinyColors[Math.floor(Math.random() * this.shinyColors.length)],
                    size: Math.random() * 6 + 2,
                    opacity: 1,
                    fadeSpeed: 0.02,
                    type: 'sparkle'
                });
            }

            if (!this.animating) {
                this.animate();
            }

            setTimeout(createSparkle, 50);
        };
        createSparkle();
    }

    // Pokeball burst animation
    pokeballBurst(x, y) {
        const colors = ['#ff0000', '#ffffff', '#333333'];
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            this.particles.push({
                x: x || this.canvas.width / 2,
                y: y || this.canvas.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 3,
                opacity: 1,
                fadeSpeed: 0.015,
                type: 'burst'
            });
        }

        if (!this.animating) {
            this.animate();
        }
    }

    // Floating Pokemon sprite animation
    floatingSprite(pokemonId, isShiny = false) {
        const overlay = document.createElement('div');
        overlay.className = 'trade-celebration-overlay';
        overlay.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-sprite ${isShiny ? 'shiny' : ''}">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${pokemonId}.png"
                         alt="Pokemon" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png'">
                </div>
                <h2 class="celebration-text">Trade Complete!</h2>
                ${isShiny ? '<span class="shiny-badge-large"><i class="fas fa-star"></i> SHINY!</span>' : ''}
            </div>
        `;
        document.body.appendChild(overlay);

        // Trigger confetti
        setTimeout(() => {
            this.confetti(window.innerWidth / 2, window.innerHeight / 2, isShiny ? 200 : 100, isShiny);
            if (isShiny) {
                this.sparkles(window.innerWidth / 2, window.innerHeight / 3);
            }
        }, 300);

        // Remove after animation
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }, 3000);
    }

    // Animate particles
    animate() {
        this.animating = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => {
            // Update position
            if (p.type === 'confetti') {
                p.vy += p.gravity;
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.005;
            } else if (p.type === 'sparkle' || p.type === 'burst') {
                p.opacity -= p.fadeSpeed;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Draw
            if (p.opacity > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fillStyle = p.color;

                if (p.type === 'confetti') {
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rotation * Math.PI / 180);
                    if (p.shape === 'rect') {
                        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                    } else {
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                } else if (p.type === 'sparkle') {
                    // Draw star shape
                    this.drawStar(p.x, p.y, 4, p.size, p.size / 2);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
                return true;
            }
            return false;
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.animating = false;
        }
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }

        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    playSound(type) {
        if (this.audioEnabled && this.sounds[type]) {
            this.sounds[type].currentTime = 0;
            this.sounds[type].play().catch(() => {});
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        localStorage.setItem('audioEnabled', this.audioEnabled);
        return this.audioEnabled;
    }
}

// CSS for celebration overlay
const celebrationStyles = document.createElement('style');
celebrationStyles.textContent = `
    .trade-celebration-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .trade-celebration-overlay.fade-out {
        animation: fadeOut 0.5s ease forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    .celebration-content {
        text-align: center;
        animation: bounceIn 0.5s ease;
    }

    @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    .celebration-sprite {
        width: 300px;
        height: 300px;
        margin: 0 auto 20px;
        animation: float 2s ease-in-out infinite;
    }

    .celebration-sprite.shiny {
        filter: drop-shadow(0 0 20px gold) drop-shadow(0 0 40px gold);
        animation: float 2s ease-in-out infinite, shimmer 1s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    @keyframes shimmer {
        0%, 100% { filter: drop-shadow(0 0 20px gold) drop-shadow(0 0 40px gold); }
        50% { filter: drop-shadow(0 0 30px #fff) drop-shadow(0 0 60px gold); }
    }

    .celebration-sprite img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .celebration-text {
        font-family: 'Orbitron', sans-serif;
        font-size: 2.5rem;
        color: #00d4ff;
        text-shadow: 0 0 20px #00d4ff;
        margin: 0;
    }

    .shiny-badge-large {
        display: inline-block;
        background: linear-gradient(135deg, #ffd700, #ff8c00);
        color: #000;
        padding: 10px 30px;
        border-radius: 30px;
        font-size: 1.5rem;
        font-weight: bold;
        margin-top: 15px;
        animation: pulse 0.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(celebrationStyles);

// Initialize and export
window.tradeAnimations = new TradeAnimations();
