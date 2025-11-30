/**
 * PKM-Universe Mystery Box & Spin Wheel
 * Daily free Pokemon, lucky wheel spins, streak rewards
 */

class MysteryBox {
    constructor() {
        this.storageKey = 'pkm-universe-mystery-box';
        this.lastClaim = null;
        this.streak = 0;
        this.totalClaims = 0;
        this.history = [];
        this.spinsRemaining = 1;

        // Rarity tiers
        this.rarityTiers = {
            common: { weight: 50, color: '#a8a8a8', label: 'Common' },
            uncommon: { weight: 30, color: '#2ecc71', label: 'Uncommon' },
            rare: { weight: 15, color: '#3498db', label: 'Rare' },
            epic: { weight: 4, color: '#9b59b6', label: 'Epic' },
            legendary: { weight: 0.9, color: '#f39c12', label: 'Legendary' },
            mythical: { weight: 0.1, color: '#e74c3c', label: 'Mythical' }
        };

        // Pokemon pools by rarity
        this.pokemonPools = {
            common: [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 96, 98, 100, 102, 104, 108, 109, 111, 116, 118, 120, 129, 152, 155, 158, 161, 163, 165, 167, 170, 177, 183, 187, 194, 204, 209, 218, 220, 223, 252, 255, 258, 261, 263, 265, 270, 273, 276, 278, 280, 283, 285, 287, 290, 293, 296, 299, 300, 303, 304, 307, 309, 311, 312, 316, 322, 325, 328, 331, 333, 339, 341, 343, 349, 351, 352, 353, 355, 361, 366, 387, 390, 393, 396, 399, 401, 403, 406, 412, 415, 418, 420, 422, 427, 431, 434, 436, 439, 441, 446, 447, 451, 453, 456, 459, 495, 498, 501, 504, 506, 509, 511, 513, 515, 517, 519, 522, 524, 527, 529, 531, 535, 540, 543, 546, 548, 550, 551, 554, 556, 557, 559, 561, 562, 568, 570, 572, 574, 577, 580, 582, 585, 587, 590, 592, 595, 597, 599, 602, 605, 607, 610, 613, 616, 619, 622, 624, 627, 629, 632, 650, 653, 656, 659, 661, 664, 667, 669, 672, 674, 677, 679, 682, 684, 686, 688, 690, 692, 694, 696, 698, 701, 704, 708, 710, 714, 722, 725, 728, 731, 734, 736, 739, 741, 742, 744, 746, 747, 749, 751, 753, 755, 757, 759, 761, 764, 765, 767, 769, 771, 775, 778, 779, 782],
            uncommon: [3, 6, 9, 12, 15, 18, 20, 22, 24, 26, 28, 31, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 62, 65, 68, 71, 73, 76, 78, 80, 82, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 110, 112, 113, 114, 115, 117, 119, 121, 122, 123, 124, 125, 126, 127, 128, 130, 131, 132, 133, 134, 135, 136, 137, 139, 140, 141, 142, 154, 157, 160, 162, 164, 166, 168, 169, 171, 176, 178, 179, 182, 184, 185, 186, 190, 193, 195, 198, 200, 202, 203, 205, 206, 207, 208, 210, 211, 212, 213, 214, 215, 216, 217, 219, 221, 222, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 237, 238, 239, 240, 241, 254, 257, 260, 262, 264, 267, 269, 272, 275, 277, 279, 281, 282, 284, 286, 288, 289, 291, 292, 294, 295, 297, 298, 301, 302, 305, 306, 308, 310, 313, 314, 315, 317, 318, 319, 320, 321, 323, 324, 326, 327, 329, 330, 332, 334, 335, 336, 337, 338, 340, 342, 344, 345, 346, 348, 350, 354, 356, 357, 358, 359, 360, 362, 363, 364, 365, 367, 368, 369, 370, 389, 392, 395, 397, 398, 400, 402, 404, 405, 407, 408, 409, 410, 411, 413, 414, 416, 417, 419, 421, 423, 424, 425, 426, 428, 429, 430, 432, 433, 435, 437, 438, 440, 442, 443, 444, 448, 449, 450, 452, 454, 455, 457, 458, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 497, 500, 503, 505, 507, 508, 510, 512, 514, 516, 518, 520, 521, 523, 525, 526, 528, 530, 532, 533, 534, 536, 537, 538, 539, 541, 542, 544, 545, 547, 549, 552, 553, 555, 558, 560, 563, 564, 565, 566, 567, 569, 571, 573, 575, 576, 578, 579, 581, 583, 584, 586, 588, 589, 591, 593, 594, 596, 598, 600, 601, 603, 604, 606, 608, 609, 611, 612, 614, 615, 617, 618, 620, 621, 623, 625, 626, 628, 630, 631, 633, 634, 635, 651, 652, 654, 655, 657, 658, 660, 662, 663, 665, 666, 668, 670, 671, 673, 675, 676, 678, 680, 681, 683, 685, 687, 689, 691, 693, 695, 697, 699, 700, 702, 703, 705, 706, 707, 709, 711, 712, 713, 715, 723, 724, 726, 727, 729, 730, 732, 733, 735, 737, 738, 740, 743, 745, 748, 750, 752, 754, 756, 758, 760, 762, 763, 766, 768, 770, 772, 773, 774, 776, 777, 780, 781, 783, 784, 785],
            rare: [94, 106, 143, 149, 181, 189, 192, 196, 197, 199, 201, 236, 242, 248, 282, 306, 330, 334, 350, 359, 362, 365, 373, 376, 379, 392, 395, 398, 405, 409, 411, 414, 416, 417, 423, 424, 426, 428, 435, 437, 445, 450, 454, 457, 460, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 508, 512, 514, 516, 518, 521, 526, 530, 534, 537, 545, 547, 549, 553, 560, 565, 567, 571, 576, 579, 584, 589, 594, 596, 598, 601, 604, 609, 612, 614, 617, 621, 623, 625, 628, 630, 635, 637, 660, 663, 666, 668, 671, 673, 676, 681, 685, 687, 691, 695, 697, 700, 706, 709, 713, 715, 724, 727, 730, 733, 738, 745, 748, 752, 756, 758, 762, 770, 774, 777, 784],
            epic: [144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 480, 481, 482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 643, 644, 645, 646, 716, 717, 718, 772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905],
            legendary: [151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809, 893, 899, 900, 901, 902, 903, 904],
            mythical: [151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809]
        };

        // Wheel segments
        this.wheelSegments = [
            { label: 'Common', color: '#a8a8a8', rarity: 'common' },
            { label: 'Uncommon', color: '#2ecc71', rarity: 'uncommon' },
            { label: 'Common', color: '#a8a8a8', rarity: 'common' },
            { label: 'Rare', color: '#3498db', rarity: 'rare' },
            { label: 'Common', color: '#a8a8a8', rarity: 'common' },
            { label: 'Uncommon', color: '#2ecc71', rarity: 'uncommon' },
            { label: 'Common', color: '#a8a8a8', rarity: 'common' },
            { label: 'Epic', color: '#9b59b6', rarity: 'epic' },
            { label: 'Common', color: '#a8a8a8', rarity: 'common' },
            { label: 'Uncommon', color: '#2ecc71', rarity: 'uncommon' },
            { label: 'Rare', color: '#3498db', rarity: 'rare' },
            { label: 'LEGENDARY', color: '#f39c12', rarity: 'legendary' }
        ];

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.injectStyles();
        this.createUI();
        this.bindEvents();
        this.checkDailyReset();
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.lastClaim = data.lastClaim;
                this.streak = data.streak || 0;
                this.totalClaims = data.totalClaims || 0;
                this.history = data.history || [];
                this.spinsRemaining = data.spinsRemaining ?? 1;
            }
        } catch (e) {
            console.error('Error loading mystery box data:', e);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                lastClaim: this.lastClaim,
                streak: this.streak,
                totalClaims: this.totalClaims,
                history: this.history,
                spinsRemaining: this.spinsRemaining
            }));
        } catch (e) {
            console.error('Error saving mystery box data:', e);
        }
    }

    checkDailyReset() {
        const now = new Date();
        const lastClaimDate = this.lastClaim ? new Date(this.lastClaim) : null;

        if (lastClaimDate) {
            const daysSinceLastClaim = Math.floor((now - lastClaimDate) / (1000 * 60 * 60 * 24));

            if (daysSinceLastClaim >= 2) {
                // Streak broken
                this.streak = 0;
            }

            if (daysSinceLastClaim >= 1) {
                // New day, can claim again
                this.spinsRemaining = 1;
            }
        }

        this.saveToStorage();
        this.updateUI();
    }

    canClaim() {
        if (!this.lastClaim) return true;

        const now = new Date();
        const lastClaimDate = new Date(this.lastClaim);

        // Check if it's a new day (reset at midnight)
        return now.toDateString() !== lastClaimDate.toDateString();
    }

    injectStyles() {
        if (document.getElementById('mystery-box-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'mystery-box-styles';
        styles.textContent = `
            .mystery-box-container {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 30px;
                margin: 20px 0;
                border: 2px solid #f39c12;
                box-shadow: 0 10px 40px rgba(243, 156, 18, 0.2);
            }

            .mb-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .mb-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
                color: #f39c12;
                text-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
                margin: 0 0 10px;
            }

            .mb-subtitle {
                color: #888;
                font-size: 1rem;
            }

            .mb-main {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }

            @media (max-width: 900px) {
                .mb-main {
                    grid-template-columns: 1fr;
                }
            }

            /* Mystery Box Section */
            .mb-box-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 20px;
                padding: 30px;
                text-align: center;
            }

            .mb-box-container {
                position: relative;
                width: 200px;
                height: 200px;
                margin: 0 auto 20px;
            }

            .mb-box {
                width: 100%;
                height: 100%;
                position: relative;
                cursor: pointer;
                transition: transform 0.3s ease;
            }

            .mb-box:hover:not(.disabled) {
                transform: scale(1.05);
            }

            .mb-box.disabled {
                cursor: not-allowed;
                filter: grayscale(0.5);
            }

            .mb-box-base {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 180px;
                height: 100px;
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .mb-box-lid {
                position: absolute;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 200px;
                height: 60px;
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                border-radius: 15px 15px 0 0;
                box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.3);
                transition: transform 0.5s ease;
            }

            .mb-box.opening .mb-box-lid {
                transform: translateX(-50%) translateY(-30px) rotateX(-30deg);
            }

            .mb-box-ribbon {
                position: absolute;
                bottom: 60px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 80px;
                background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
                z-index: 2;
            }

            .mb-box-ribbon::before,
            .mb-box-ribbon::after {
                content: '';
                position: absolute;
                top: 0;
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
                border-radius: 50%;
            }

            .mb-box-ribbon::before {
                left: -20px;
            }

            .mb-box-ribbon::after {
                right: -20px;
            }

            .mb-box-question {
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 4rem;
                color: #f39c12;
                text-shadow: 0 0 20px rgba(243, 156, 18, 0.5);
                z-index: 1;
            }

            .mb-box-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 250px;
                height: 250px;
                background: radial-gradient(circle, rgba(243, 156, 18, 0.3) 0%, transparent 70%);
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            }

            .mb-claim-btn {
                padding: 15px 40px;
                border-radius: 30px;
                border: none;
                background: linear-gradient(135deg, #f39c12, #d68910);
                color: #000;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 20px;
            }

            .mb-claim-btn:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 5px 30px rgba(243, 156, 18, 0.5);
            }

            .mb-claim-btn:disabled {
                background: #444;
                color: #888;
                cursor: not-allowed;
            }

            .mb-cooldown {
                margin-top: 15px;
                color: #888;
                font-size: 0.9rem;
            }

            .mb-cooldown-timer {
                font-family: 'Orbitron', sans-serif;
                color: #f39c12;
                font-size: 1.2rem;
            }

            /* Streak Section */
            .mb-streak-section {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            }

            .mb-streak-day {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: #666;
                position: relative;
            }

            .mb-streak-day.claimed {
                background: linear-gradient(135deg, #2ecc71, #27ae60);
                color: #fff;
            }

            .mb-streak-day.current {
                border: 3px solid #f39c12;
            }

            .mb-streak-day .day-label {
                position: absolute;
                bottom: -20px;
                font-size: 0.7rem;
                color: #888;
            }

            /* Wheel Section */
            .mb-wheel-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 20px;
                padding: 30px;
                text-align: center;
            }

            .mb-wheel-container {
                position: relative;
                width: 300px;
                height: 300px;
                margin: 0 auto 20px;
            }

            .mb-wheel {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                position: relative;
                transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            }

            .mb-wheel-pointer {
                position: absolute;
                top: -15px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-top: 30px solid #f39c12;
                z-index: 10;
                filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
            }

            .mb-wheel-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-radius: 50%;
                border: 4px solid #f39c12;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: #f39c12;
                z-index: 5;
            }

            .mb-spin-btn {
                padding: 15px 40px;
                border-radius: 30px;
                border: none;
                background: linear-gradient(135deg, #9b59b6, #8e44ad);
                color: #fff;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .mb-spin-btn:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 5px 30px rgba(155, 89, 182, 0.5);
            }

            .mb-spin-btn:disabled {
                background: #444;
                color: #888;
                cursor: not-allowed;
            }

            .mb-spins-remaining {
                margin-top: 15px;
                color: #888;
            }

            .mb-spins-count {
                color: #9b59b6;
                font-weight: bold;
            }

            /* Stats Section */
            .mb-stats {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-top: 30px;
                flex-wrap: wrap;
            }

            .mb-stat {
                text-align: center;
            }

            .mb-stat-value {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                color: #f39c12;
            }

            .mb-stat-label {
                font-size: 0.8rem;
                color: #888;
            }

            /* Result Modal */
            .mb-result-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }

            .mb-result-modal.show {
                display: flex;
            }

            .mb-result-content {
                text-align: center;
                animation: bounceIn 0.5s ease;
            }

            @keyframes bounceIn {
                0% { transform: scale(0); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .mb-result-rarity {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                padding: 10px 30px;
                border-radius: 30px;
                display: inline-block;
                margin-bottom: 20px;
            }

            .mb-result-sprite {
                width: 250px;
                height: 250px;
                margin: 0 auto 20px;
            }

            .mb-result-sprite img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
            }

            .mb-result-sprite.shiny img {
                filter: drop-shadow(0 0 30px gold);
            }

            .mb-result-name {
                font-family: 'Orbitron', sans-serif;
                font-size: 2rem;
                color: #fff;
                margin-bottom: 10px;
            }

            .mb-result-shiny {
                background: linear-gradient(135deg, #ffd700, #ff8c00);
                color: #000;
                padding: 5px 20px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 20px;
            }

            .mb-result-claim-btn {
                padding: 15px 40px;
                border-radius: 30px;
                border: none;
                background: linear-gradient(135deg, #2ecc71, #27ae60);
                color: #fff;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .mb-result-claim-btn:hover {
                transform: scale(1.05);
            }

            /* History Section */
            .mb-history {
                margin-top: 30px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
            }

            .mb-history-title {
                font-weight: bold;
                color: #f39c12;
                margin-bottom: 15px;
            }

            .mb-history-grid {
                display: flex;
                gap: 10px;
                overflow-x: auto;
                padding-bottom: 10px;
            }

            .mb-history-item {
                flex-shrink: 0;
                width: 70px;
                text-align: center;
            }

            .mb-history-sprite {
                width: 50px;
                height: 50px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .mb-history-sprite img {
                max-width: 40px;
                max-height: 40px;
            }

            .mb-history-sprite.shiny {
                background: rgba(255, 215, 0, 0.2);
                border: 2px solid #ffd700;
            }

            .mb-history-name {
                font-size: 0.7rem;
                color: #888;
                margin-top: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .mb-history-rarity {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin: 5px auto 0;
            }
        `;
        document.head.appendChild(styles);
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'mystery-box-container';
        container.innerHTML = `
            <div class="mystery-box-container">
                <div class="mb-header">
                    <h2 class="mb-title"><i class="fas fa-gift"></i> Mystery Box & Lucky Wheel</h2>
                    <p class="mb-subtitle">Claim your daily rewards and spin for prizes!</p>
                </div>

                <div class="mb-main">
                    <!-- Mystery Box -->
                    <div class="mb-box-section">
                        <h3 style="color: #f39c12; margin-bottom: 20px;"><i class="fas fa-box"></i> Daily Mystery Box</h3>

                        <div class="mb-box-container">
                            <div class="mb-box-glow"></div>
                            <div class="mb-box" id="mystery-box">
                                <div class="mb-box-lid"></div>
                                <div class="mb-box-ribbon"></div>
                                <div class="mb-box-base"></div>
                                <div class="mb-box-question">?</div>
                            </div>
                        </div>

                        <button class="mb-claim-btn" id="mb-claim-btn">
                            <i class="fas fa-gift"></i> Open Box
                        </button>

                        <div class="mb-cooldown" id="mb-cooldown" style="display: none;">
                            Next box in: <span class="mb-cooldown-timer" id="mb-cooldown-timer">--:--:--</span>
                        </div>

                        <div class="mb-streak-section">
                            ${[1, 2, 3, 4, 5, 6, 7].map(day => `
                                <div class="mb-streak-day" data-day="${day}">
                                    ${day}
                                    <span class="day-label">Day ${day}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Spin Wheel -->
                    <div class="mb-wheel-section">
                        <h3 style="color: #9b59b6; margin-bottom: 20px;"><i class="fas fa-dharmachakra"></i> Lucky Wheel</h3>

                        <div class="mb-wheel-container">
                            <div class="mb-wheel-pointer"></div>
                            <canvas id="mb-wheel-canvas" width="300" height="300"></canvas>
                            <div class="mb-wheel-center"><i class="fas fa-star"></i></div>
                        </div>

                        <button class="mb-spin-btn" id="mb-spin-btn">
                            <i class="fas fa-sync-alt"></i> Spin Wheel
                        </button>

                        <div class="mb-spins-remaining">
                            Spins remaining: <span class="mb-spins-count" id="mb-spins-count">${this.spinsRemaining}</span>
                        </div>
                    </div>
                </div>

                <div class="mb-stats">
                    <div class="mb-stat">
                        <div class="mb-stat-value" id="mb-total-claims">${this.totalClaims}</div>
                        <div class="mb-stat-label">Total Claims</div>
                    </div>
                    <div class="mb-stat">
                        <div class="mb-stat-value" id="mb-streak">${this.streak}</div>
                        <div class="mb-stat-label">Day Streak</div>
                    </div>
                    <div class="mb-stat">
                        <div class="mb-stat-value" id="mb-best-rarity">--</div>
                        <div class="mb-stat-label">Best Pull</div>
                    </div>
                </div>

                <div class="mb-history">
                    <div class="mb-history-title"><i class="fas fa-history"></i> Recent Rewards</div>
                    <div class="mb-history-grid" id="mb-history-grid">
                        <div style="color: #666; text-align: center; width: 100%;">No rewards yet. Open a box to get started!</div>
                    </div>
                </div>
            </div>

            <!-- Result Modal -->
            <div class="mb-result-modal" id="mb-result-modal">
                <div class="mb-result-content">
                    <div class="mb-result-rarity" id="mb-result-rarity">Common</div>
                    <div class="mb-result-sprite" id="mb-result-sprite">
                        <img src="" alt="Pokemon">
                    </div>
                    <div class="mb-result-name" id="mb-result-name">???</div>
                    <div class="mb-result-shiny" id="mb-result-shiny" style="display: none;">
                        <i class="fas fa-star"></i> SHINY!
                    </div>
                    <button class="mb-result-claim-btn" id="mb-result-claim-btn">
                        <i class="fas fa-check"></i> Claim Reward
                    </button>
                </div>
            </div>
        `;

        // Find insertion point
        const targetSection = document.querySelector('#trade-history-container') ||
                             document.querySelector('.live-trading-section');

        if (targetSection) {
            targetSection.parentNode.insertBefore(container, targetSection.nextSibling);
        } else {
            document.body.appendChild(container);
        }

        this.drawWheel();
        this.updateUI();
    }

    drawWheel() {
        const canvas = document.getElementById('mb-wheel-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 140;

        const segmentAngle = (2 * Math.PI) / this.wheelSegments.length;

        this.wheelSegments.forEach((segment, i) => {
            const startAngle = i * segmentAngle - Math.PI / 2;
            const endAngle = (i + 1) * segmentAngle - Math.PI / 2;

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.fillText(segment.label, radius - 15, 4);
            ctx.restore();
        });
    }

    bindEvents() {
        // Mystery box claim
        document.getElementById('mb-claim-btn')?.addEventListener('click', () => this.openBox());
        document.getElementById('mystery-box')?.addEventListener('click', () => {
            if (this.canClaim()) this.openBox();
        });

        // Spin wheel
        document.getElementById('mb-spin-btn')?.addEventListener('click', () => this.spinWheel());

        // Result modal close
        document.getElementById('mb-result-claim-btn')?.addEventListener('click', () => {
            document.getElementById('mb-result-modal').classList.remove('show');
        });
    }

    updateUI() {
        // Update claim button
        const claimBtn = document.getElementById('mb-claim-btn');
        const cooldownDiv = document.getElementById('mb-cooldown');
        const box = document.getElementById('mystery-box');

        if (this.canClaim()) {
            claimBtn.disabled = false;
            claimBtn.innerHTML = '<i class="fas fa-gift"></i> Open Box';
            cooldownDiv.style.display = 'none';
            box?.classList.remove('disabled');
        } else {
            claimBtn.disabled = true;
            claimBtn.innerHTML = '<i class="fas fa-clock"></i> Claimed Today';
            cooldownDiv.style.display = 'block';
            box?.classList.add('disabled');
            this.startCooldownTimer();
        }

        // Update streak display
        const streakDays = document.querySelectorAll('.mb-streak-day');
        streakDays.forEach((day, index) => {
            day.classList.remove('claimed', 'current');
            if (index < this.streak) {
                day.classList.add('claimed');
            }
            if (index === this.streak) {
                day.classList.add('current');
            }
        });

        // Update spin button
        const spinBtn = document.getElementById('mb-spin-btn');
        const spinsCount = document.getElementById('mb-spins-count');

        spinsCount.textContent = this.spinsRemaining;
        spinBtn.disabled = this.spinsRemaining <= 0;

        // Update stats
        document.getElementById('mb-total-claims').textContent = this.totalClaims;
        document.getElementById('mb-streak').textContent = this.streak;

        // Find best rarity in history
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];
        let bestRarity = 'common';
        this.history.forEach(h => {
            if (rarityOrder.indexOf(h.rarity) > rarityOrder.indexOf(bestRarity)) {
                bestRarity = h.rarity;
            }
        });
        document.getElementById('mb-best-rarity').textContent = this.rarityTiers[bestRarity]?.label || '--';

        // Update history
        this.updateHistory();
    }

    updateHistory() {
        const grid = document.getElementById('mb-history-grid');
        if (!grid) return;

        if (this.history.length === 0) {
            grid.innerHTML = '<div style="color: #666; text-align: center; width: 100%;">No rewards yet. Open a box to get started!</div>';
            return;
        }

        grid.innerHTML = this.history.slice(0, 10).map(item => `
            <div class="mb-history-item">
                <div class="mb-history-sprite ${item.isShiny ? 'shiny' : ''}">
                    <img src="${item.sprite}" alt="${item.name}">
                </div>
                <div class="mb-history-name">${item.name}</div>
                <div class="mb-history-rarity" style="background: ${this.rarityTiers[item.rarity]?.color || '#888'};"></div>
            </div>
        `).join('');
    }

    startCooldownTimer() {
        const timerEl = document.getElementById('mb-cooldown-timer');
        if (!timerEl) return;

        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow - now;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    selectRarity() {
        const roll = Math.random() * 100;
        let cumulative = 0;

        for (const [rarity, data] of Object.entries(this.rarityTiers)) {
            cumulative += data.weight;
            if (roll < cumulative) {
                return rarity;
            }
        }

        return 'common';
    }

    async getRandomPokemon(rarity) {
        const pool = this.pokemonPools[rarity] || this.pokemonPools.common;
        const pokemonId = pool[Math.floor(Math.random() * pool.length)];

        // 1/100 chance of shiny
        const isShiny = Math.random() < 0.01;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const data = await response.json();

            return {
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                sprite: isShiny
                    ? (data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny)
                    : (data.sprites.other['official-artwork'].front_default || data.sprites.front_default),
                smallSprite: isShiny ? data.sprites.front_shiny : data.sprites.front_default,
                isShiny,
                rarity
            };
        } catch (error) {
            // Fallback
            return {
                id: pokemonId,
                name: `Pokemon #${pokemonId}`,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
                smallSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
                isShiny: false,
                rarity
            };
        }
    }

    async openBox() {
        if (!this.canClaim()) return;

        const box = document.getElementById('mystery-box');
        box?.classList.add('opening');

        // Determine rarity
        const rarity = this.selectRarity();
        const pokemon = await this.getRandomPokemon(rarity);

        // Update state
        this.lastClaim = new Date().toISOString();
        this.streak++;
        this.totalClaims++;

        // Add to history
        this.history.unshift({
            ...pokemon,
            sprite: pokemon.smallSprite,
            claimedAt: this.lastClaim
        });

        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.saveToStorage();

        // Show result after animation
        setTimeout(() => {
            this.showResult(pokemon);
            box?.classList.remove('opening');
            this.updateUI();
        }, 1000);
    }

    async spinWheel() {
        if (this.spinsRemaining <= 0) return;

        const canvas = document.getElementById('mb-wheel-canvas');
        if (!canvas) return;

        this.spinsRemaining--;
        document.getElementById('mb-spin-btn').disabled = true;

        // Determine result
        const segmentIndex = Math.floor(Math.random() * this.wheelSegments.length);
        const segment = this.wheelSegments[segmentIndex];

        // Calculate rotation
        const segmentAngle = 360 / this.wheelSegments.length;
        const targetAngle = 360 - (segmentIndex * segmentAngle) - (segmentAngle / 2);
        const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
        const finalRotation = spins * 360 + targetAngle;

        // Animate
        canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        canvas.style.transform = `rotate(${finalRotation}deg)`;

        // Get Pokemon after spin
        const pokemon = await this.getRandomPokemon(segment.rarity);

        // Add to history
        this.history.unshift({
            ...pokemon,
            sprite: pokemon.smallSprite,
            claimedAt: new Date().toISOString()
        });

        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.saveToStorage();

        // Show result
        setTimeout(() => {
            canvas.style.transition = 'none';
            canvas.style.transform = `rotate(${targetAngle}deg)`;

            this.showResult(pokemon);
            this.updateUI();
        }, 4000);
    }

    showResult(pokemon) {
        const modal = document.getElementById('mb-result-modal');
        const rarityEl = document.getElementById('mb-result-rarity');
        const spriteEl = document.getElementById('mb-result-sprite');
        const nameEl = document.getElementById('mb-result-name');
        const shinyEl = document.getElementById('mb-result-shiny');

        const rarityData = this.rarityTiers[pokemon.rarity];

        rarityEl.textContent = rarityData.label;
        rarityEl.style.background = rarityData.color;
        rarityEl.style.color = pokemon.rarity === 'legendary' || pokemon.rarity === 'mythical' ? '#000' : '#fff';

        spriteEl.innerHTML = `<img src="${pokemon.sprite}" alt="${pokemon.name}">`;
        spriteEl.classList.toggle('shiny', pokemon.isShiny);

        nameEl.textContent = pokemon.name;
        shinyEl.style.display = pokemon.isShiny ? 'inline-block' : 'none';

        modal.classList.add('show');

        // Trigger animations
        if (window.tradeAnimations) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            if (pokemon.isShiny) {
                window.tradeAnimations.sparkles(centerX, centerY);
                window.tradeAnimations.confetti(centerX, centerY, 200, true);
            } else if (pokemon.rarity === 'legendary' || pokemon.rarity === 'mythical' || pokemon.rarity === 'epic') {
                window.tradeAnimations.confetti(centerX, centerY, 150);
            } else {
                window.tradeAnimations.confetti(centerX, centerY, 50);
            }
        }

        // Add to collection if trade history available
        if (window.tradeHistory) {
            window.tradeHistory.recordTrade({
                id: pokemon.id,
                name: pokemon.name.toLowerCase(),
                sprite: pokemon.smallSprite,
                shinySprite: pokemon.sprite
            }, pokemon.isShiny);
        }
    }
}

// Initialize
window.mysteryBox = new MysteryBox();
