/**
 * ============================================================================
 * SANVIIII'S BIRTHDAY CELEBRATION INTERACTIVE ENGINE
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initParticleCanvas();
  initAudioEngine();
  initWakeUpIntro();
  initHeroTilt();
  initSleepLab();
  initScrapbookLightbox();
  initFlipCards();
  initCakeCeremony();
  initSecretLetter();
  initMysteryGifts();
  initGuestbook();
  initConfettiCannon();
});

/* ==========================================================================
   1. WEB AUDIO API SYNTHESIZER & SOUND EFFECTS
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Melody frequencies for Music Box "Happy Birthday"
// C4, D4, E4, F4, G4, A4, B4, C5...
const notes = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  A5: 880.00, Bb4: 466.16
};

// "Happy Birthday" melody score with durations
const birthdayMelody = [
  { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.7 }, { note: 'G4', dur: 0.7 }, { note: 'C5', dur: 0.7 }, { note: 'B4', dur: 1.2 },
  { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.7 }, { note: 'G4', dur: 0.7 }, { note: 'D5', dur: 0.7 }, { note: 'C5', dur: 1.2 },
  { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'G5', dur: 0.7 }, { note: 'E5', dur: 0.7 }, { note: 'C5', dur: 0.7 }, { note: 'B4', dur: 0.7 }, { note: 'A4', dur: 1.0 },
  { note: 'F5', dur: 0.35 }, { note: 'F5', dur: 0.35 }, { note: 'E5', dur: 0.7 }, { note: 'C5', dur: 0.7 }, { note: 'D5', dur: 0.7 }, { note: 'C5', dur: 1.4 }
];

function playTone(freq, duration, type = 'sine', gainLevel = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm music box envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainLevel, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playTone error', e);
  }
}

function playChime() {
  playTone(523.25, 0.4, 'triangle', 0.2); // C5
  setTimeout(() => playTone(659.25, 0.4, 'triangle', 0.2), 80); // E5
  setTimeout(() => playTone(783.99, 0.6, 'triangle', 0.25), 160); // G5
  setTimeout(() => playTone(1046.50, 0.8, 'sine', 0.2), 240); // C6
}

function playPop() {
  playTone(400, 0.08, 'sine', 0.2);
}

function playFanfare() {
  playTone(523.25, 0.3, 'triangle', 0.25);
  setTimeout(() => playTone(659.25, 0.3, 'triangle', 0.25), 150);
  setTimeout(() => playTone(783.99, 0.3, 'triangle', 0.25), 300);
  setTimeout(() => playTone(1046.50, 0.9, 'triangle', 0.35), 450);
}

function playWhoosh() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

let melodyStep = 0;
function startMusicLoop() {
  if (musicInterval) clearInterval(musicInterval);
  melodyStep = 0;

  function scheduleNextNote() {
    if (!isMusicPlaying) return;
    const noteObj = birthdayMelody[melodyStep];
    const freq = notes[noteObj.note] || 440;
    
    // Play warm music box bell tone
    playTone(freq, noteObj.dur * 1.1, 'sine', 0.18);
    // Subtle higher harmonic shimmer
    playTone(freq * 2, noteObj.dur * 0.7, 'triangle', 0.05);

    melodyStep = (melodyStep + 1) % birthdayMelody.length;
    const delay = noteObj.dur * 1000 * 0.95;
    musicInterval = setTimeout(scheduleNextNote, delay);
  }

  scheduleNextNote();
}

function stopMusicLoop() {
  if (musicInterval) {
    clearTimeout(musicInterval);
    musicInterval = null;
  }
}

function initAudioEngine() {
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicLabel = document.getElementById('music-label');

  if (!musicBtn) return;

  musicBtn.addEventListener('click', () => {
    getAudioContext();
    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
      musicBtn.classList.add('playing');
      musicLabel.textContent = 'Melody: ON';
      startMusicLoop();
    } else {
      musicBtn.classList.remove('playing');
      musicLabel.textContent = 'Melody: OFF';
      stopMusicLoop();
    }
  });
}

/* ==========================================================================
   2. PARTICLE SYSTEM BACKGROUND CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const numParticles = Math.min(Math.floor(width / 24), 50);

  const colors = [
    'rgba(255, 101, 132, ', // Pink
    'rgba(255, 209, 102, ', // Gold
    'rgba(160, 108, 213, ', // Purple
    'rgba(255, 255, 255, '  // White
  ];

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });
  }

  // Interactive mouse sparkles
  const mouseSparkles = [];
  window.addEventListener('pointermove', (e) => {
    if (Math.random() > 0.4) return;
    mouseSparkles.push({
      x: e.clientX,
      y: e.clientY,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      life: 1
    });
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render ambient stars
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0.1, Math.min(0.9, p.alpha)) + ')';
      ctx.shadowBlur = p.radius * 3;
      ctx.shadowColor = p.color + '0.8)';
      ctx.fill();
    });

    // Render mouse sparkles
    for (let i = mouseSparkles.length - 1; i >= 0; i--) {
      const sp = mouseSparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= 0.03;
      sp.alpha = sp.life;

      if (sp.life <= 0) {
        mouseSparkles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      ctx.fillStyle = sp.color + sp.alpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = sp.color + '1)';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. WAKE UP SANU INTRO & ALARM INTERACTION
   ========================================================================== */
function initWakeUpIntro() {
  const overlay = document.getElementById('wake-up-overlay');
  const wakeUpBtn = document.getElementById('wake-up-btn');
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicLabel = document.getElementById('music-label');

  if (!overlay || !wakeUpBtn) return;

  wakeUpBtn.addEventListener('click', () => {
    // Sound chime & fanfare
    getAudioContext();
    playChime();

    // Trigger explosive confetti
    if (window.confetti) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff6584', '#ffd166', '#a06cd5', '#ffffff', '#ff9a9e']
      });
    }

    // Button feedback
    wakeUpBtn.style.transform = 'scale(0.92)';
    setTimeout(() => {
      wakeUpBtn.style.transform = 'scale(1.05)';
      overlay.classList.add('hidden');

      // Auto start soft birthday music loop
      setTimeout(() => {
        isMusicPlaying = true;
        if (musicBtn) musicBtn.classList.add('playing');
        if (musicLabel) musicLabel.textContent = 'Melody: ON';
        startMusicLoop();
      }, 700);

    }, 250);
  });
}

/* ==========================================================================
   4. 3D TILT EFFECT ON HERO PORTRAIT CARD
   ========================================================================== */
function initHeroTilt() {
  const card = document.getElementById('hero-card');
  if (!card) return;

  const handleMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleLeave = () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  card.addEventListener('mousemove', handleMove);
  card.addEventListener('mouseleave', handleLeave);
}

/* ==========================================================================
   5. SLEEP LAB VIDEO & SNOOZE MACHINE
   ========================================================================== */
function initSleepLab() {
  const video = document.getElementById('sleep-video');
  const overlay = document.getElementById('video-overlay');
  const playBtn = document.getElementById('video-play-btn');
  const togglePlayIcon = document.getElementById('play-pause-icon');
  const toggleStateBtn = document.getElementById('toggle-video-state');
  const toggleMuteBtn = document.getElementById('toggle-video-mute');
  const muteIcon = document.getElementById('mute-unmute-icon');

  const snoozeBtn = document.getElementById('snooze-btn');
  const snoozeCounter = document.getElementById('snooze-counter');
  const snoozeReaction = document.getElementById('snooze-reaction');

  // Video Play/Pause logic
  const toggleVideo = () => {
    if (!video) return;
    if (video.paused) {
      video.play().then(() => {
        overlay.classList.add('playing');
        if (togglePlayIcon) {
          togglePlayIcon.classList.remove('fa-play');
          togglePlayIcon.classList.add('fa-pause');
        }
      }).catch(err => console.log('Video play error:', err));
    } else {
      video.pause();
      overlay.classList.remove('playing');
      if (togglePlayIcon) {
        togglePlayIcon.classList.remove('fa-pause');
        togglePlayIcon.classList.add('fa-play');
      }
    }
  };

  if (overlay) overlay.addEventListener('click', toggleVideo);
  if (toggleStateBtn) toggleStateBtn.addEventListener('click', toggleVideo);

  // Video Mute logic
  if (toggleMuteBtn && video) {
    toggleMuteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        muteIcon.classList.remove('fa-volume-high');
        muteIcon.classList.add('fa-volume-xmark');
      } else {
        muteIcon.classList.remove('fa-volume-xmark');
        muteIcon.classList.add('fa-volume-high');
      }
    });
  }

  // Interactive Snooze Button Logic
  let snoozeCount = parseInt(localStorage.getItem('sanu_snooze_count') || '0', 10);
  if (snoozeCounter) snoozeCounter.textContent = snoozeCount;

  const reactions = [
    '"Just 5 more minutes, promise! 😴"',
    '"Okay 10 minutes... please do not turn on the ceiling light!"',
    '"Sleep is scientifically essential for royal glowing skin! ✨"',
    '"Currently dreaming about cake and pizza... do not wake! 🍕"',
    '"Alarm snoozed again! Official World Record Nap Champion! 🏆"',
    '"Who needs morning alarms when sleep feels this heavenly? 💤"',
    '"Sanu says: If sleeping was an Olympic sport, I’d take Gold! 🥇"'
  ];

  if (snoozeBtn && snoozeCounter) {
    snoozeBtn.addEventListener('click', () => {
      snoozeCount++;
      snoozeCounter.textContent = snoozeCount;
      localStorage.setItem('sanu_snooze_count', snoozeCount);
      playPop();

      // Show random witty reaction
      const randomReaction = reactions[snoozeCount % reactions.length];
      if (snoozeReaction) {
        snoozeReaction.style.opacity = '0';
        setTimeout(() => {
          snoozeReaction.textContent = randomReaction;
          snoozeReaction.style.opacity = '1';
        }, 150);
      }

      // Small confetti burst every 5 snoozes
      if (snoozeCount % 5 === 0 && window.confetti) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    });
  }
}

/* ==========================================================================
   6. SCRAPBOOK POLAROID GRID & LIGHTBOX
   ========================================================================== */
const photoData = [
  {
    src: 'assets/sanvi_royal.jpg',
    title: 'The Royal Queen Era 👑',
    desc: 'Looking like royalty on that floral couch in this ivory gown. Radiating pure elegance and charm!',
    category: 'queen'
  },
  {
    src: 'assets/sanvi_black_saree.jpg',
    title: 'Traditional Elegance 🪷',
    desc: 'The black saree with pink floral embroidery and that radiant smile. Pure classic South Indian grace!',
    category: 'traditional'
  },
  {
    src: 'assets/sanvi_green_saree.jpg',
    title: 'Golden Moments Together 🤝',
    desc: 'Dressed in festive traditional green saree alongside friend in Kerala mundu. Unforgettable memories and laughter.',
    category: 'traditional'
  },
  {
    src: 'assets/sanvi_birthday_cake.jpg',
    title: 'Childhood Cake Cutting Legend 🎂',
    desc: 'Throwback to the first birthday celebration! Notice the "Happy Birthday Sanvi" on the cake and the cute pink dress!',
    category: 'childhood'
  },
  {
    src: 'assets/sanvi_waving.jpg',
    title: 'The Signature Wave 👋',
    desc: 'Childhood Sanvi waving with curly hair and the warmest, happiest grin. Bringing smiles to everyone around!',
    category: 'childhood'
  },
  {
    src: 'assets/sanvi_toddler_smile.jpg',
    title: 'The Million Dollar Toddler Grin 😄',
    desc: 'Look at those big bright eyes and mischievous, precious smile! Absolutely priceless.',
    category: 'childhood'
  },
  {
    src: 'assets/sanvi_baby_hat.jpg',
    title: 'The Little Pink Hat Portrait 🌸',
    desc: 'Tiny baby Sanvi wearing a cute floral bonnet hat and pink dress with family. Pure cuteness overload!',
    category: 'childhood'
  },
  {
    src: 'assets/sanvi_childhood_2010.jpg',
    title: 'Cherished Family Roots (2010) 🌿',
    desc: 'Outdoor childhood snapshot from June 2010 with family in nature. Sweet nostalgic innocence!',
    category: 'childhood'
  }
];

let currentLightboxIndex = 0;

function initScrapbookLightbox() {
  // Tabs filtering
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.polaroid-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Elements
  const modal = document.getElementById('lightbox-modal');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');
  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const heartBtn = document.getElementById('lightbox-heart-btn');
  const likesCountEl = document.getElementById('lightbox-likes-count');

  if (!modal) return;

  const openLightbox = (index) => {
    currentLightboxIndex = index;
    const item = photoData[index];
    if (!item) return;

    imgEl.src = item.src;
    imgEl.alt = item.title;
    titleEl.textContent = item.title;
    descEl.textContent = item.desc;

    // Get current likes from storage
    const likesKey = `sanu_photo_likes_${index}`;
    const likes = parseInt(localStorage.getItem(likesKey) || (150 + index * 25).toString(), 10);
    likesCountEl.textContent = likes;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % photoData.length;
    openLightbox(currentLightboxIndex);
  };

  const showPrev = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + photoData.length) % photoData.length;
    openLightbox(currentLightboxIndex);
  };

  // Open on card click
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.like-btn')) return; // ignore like button click
      const index = parseInt(card.dataset.index, 10);
      openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Lightbox Heart Click
  if (heartBtn) {
    heartBtn.addEventListener('click', () => {
      const likesKey = `sanu_photo_likes_${currentLightboxIndex}`;
      let currentLikes = parseInt(localStorage.getItem(likesKey) || (150 + currentLightboxIndex * 25).toString(), 10);
      currentLikes++;
      localStorage.setItem(likesKey, currentLikes);
      likesCountEl.textContent = currentLikes;

      playPop();

      if (window.confetti) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#ff6584', '#ffd166']
        });
      }
    });
  }

  // Polaroid Card Like Buttons
  const likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countEl = btn.querySelector('.like-count');
      let count = parseInt(countEl.textContent, 10);
      count++;
      countEl.textContent = count;
      btn.classList.add('liked');
      playPop();
    });
  });
}

/* ==========================================================================
   7. 3D FLIP CARDS ("WHY SANU IS 1 OF 1")
   ========================================================================== */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      playPop();
    });
  });
}

/* ==========================================================================
   8. BIRTHDAY CAKE & WISH CEREMONY
   ========================================================================== */
function initCakeCeremony() {
  const blowBtn = document.getElementById('blow-candles-btn');
  const relightBtn = document.getElementById('relight-btn');
  const flames = document.querySelectorAll('.flame');
  const wishBanner = document.getElementById('wish-result-banner');

  if (!blowBtn) return;

  const blowOutCandles = () => {
    playWhoosh();

    // Animate flames extinguishing
    flames.forEach((flame, idx) => {
      setTimeout(() => {
        flame.classList.add('blown-out');
      }, idx * 120);
    });

    // Reveal wish & celebrate after candles are blown
    setTimeout(() => {
      playFanfare();

      if (wishBanner) wishBanner.classList.add('active');
      blowBtn.style.display = 'none';
      if (relightBtn) relightBtn.style.display = 'inline-flex';

      // Grand Fireworks Confetti blast
      triggerGrandCelebration();
    }, 600);
  };

  blowBtn.addEventListener('click', blowOutCandles);

  // Individual candle clicks
  flames.forEach((flame) => {
    flame.addEventListener('click', () => {
      playWhoosh();
      flame.classList.add('blown-out');

      // Check if all blown out
      const allBlown = Array.from(flames).every((f) => f.classList.contains('blown-out'));
      if (allBlown) {
        setTimeout(() => {
          playFanfare();
          if (wishBanner) wishBanner.classList.add('active');
          blowBtn.style.display = 'none';
          if (relightBtn) relightBtn.style.display = 'inline-flex';
          triggerGrandCelebration();
        }, 300);
      }
    });
  });

  // Relight Candles
  if (relightBtn) {
    relightBtn.addEventListener('click', () => {
      playChime();
      flames.forEach((flame) => flame.classList.remove('blown-out'));
      if (wishBanner) wishBanner.classList.remove('active');
      relightBtn.style.display = 'none';
      blowBtn.style.display = 'inline-flex';
    });
  }
}

/* ==========================================================================
   9. SECRET LETTER & WAX SEAL
   ========================================================================== */
function initSecretLetter() {
  const envelope = document.getElementById('envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const promptText = document.getElementById('letter-prompt-text');

  if (!envelope || !waxSeal) return;

  const toggleLetter = () => {
    const isOpen = envelope.classList.contains('open');

    if (!isOpen) {
      playChime();
      envelope.classList.add('open');
      if (promptText) promptText.innerHTML = '<p>✨ Sealed with pure love & gratitude for Sanu! ✨</p>';

      if (window.confetti) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      playPop();
      envelope.classList.remove('open');
      if (promptText) promptText.innerHTML = '<p>👆 Tap the golden <strong>"S"</strong> seal above to unfold the letter!</p>';
    }
  };

  waxSeal.addEventListener('click', toggleLetter);
  envelope.addEventListener('click', (e) => {
    if (!envelope.classList.contains('open')) {
      toggleLetter();
    }
  });
}

/* ==========================================================================
   10. MYSTERY GIFTS UNBOXING
   ========================================================================== */
function initMysteryGifts() {
  const giftBoxes = document.querySelectorAll('.gift-box-item');

  giftBoxes.forEach((item) => {
    const box = item.querySelector('.gift-box');
    box.addEventListener('click', () => {
      if (box.classList.contains('opened')) return;

      playChime();
      box.classList.add('opened');

      if (window.confetti) {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.7 }
        });
      }
    });
  });
}

/* ==========================================================================
   11. WISH WALL & GUESTBOOK (LOCAL STORAGE PERSISTENCE)
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById('add-note-form');
  const grid = document.getElementById('sticky-notes-grid');
  const authorInput = document.getElementById('note-author-input');
  const textInput = document.getElementById('note-text-input');

  if (!form || !grid) return;

  // Load custom saved notes
  const savedNotes = JSON.parse(localStorage.getItem('sanu_birthday_notes') || '[]');
  savedNotes.forEach((note) => {
    appendNoteToGrid(note.author, note.text, note.color, false);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = authorInput.value.trim();
    const text = textInput.value.trim();
    const colorOpt = document.querySelector('input[name="note-color"]:checked');
    const color = colorOpt ? colorOpt.value : 'note-pink';

    if (!author || !text) return;

    appendNoteToGrid(author, text, color, true);

    // Save to local storage
    savedNotes.push({ author, text, color });
    localStorage.setItem('sanu_birthday_notes', JSON.stringify(savedNotes));

    playPop();
    if (window.confetti) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    form.reset();
  });

  function appendNoteToGrid(author, text, color, animate = false) {
    const noteEl = document.createElement('div');
    noteEl.className = `sticky-note ${color}`;
    noteEl.innerHTML = `
      <div class="pin">📌</div>
      <p class="note-text">"${escapeHtml(text)}"</p>
      <span class="note-author">— ${escapeHtml(author)}</span>
    `;

    if (animate) {
      noteEl.style.animation = 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    grid.prepend(noteEl);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/* ==========================================================================
   12. CONFETTI CANNON TRIGGER
   ========================================================================== */
function initConfettiCannon() {
  const cannonBtn = document.getElementById('confetti-cannon-btn');
  if (cannonBtn) {
    cannonBtn.addEventListener('click', () => {
      playFanfare();
      triggerGrandCelebration();
    });
  }
}

// Global celebration helper
window.triggerGrandCelebration = function () {
  if (!window.confetti) return;

  // Left cannon
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.7 },
    colors: ['#ff6584', '#ffd166', '#a06cd5', '#ff9ebb']
  });

  // Right cannon
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.7 },
    colors: ['#ffd166', '#f39c12', '#2ec4b6', '#ff758c']
  });

  // Center star fountain
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      shapes: ['star', 'circle']
    });
  }, 250);
};
