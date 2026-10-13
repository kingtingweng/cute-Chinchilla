// ===================================================================
// 🌸 Ting's Personal Profile - Interactive Logic & Micro-interactions
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Starry Sky & Galaxy Engine
  const starCanvas = document.getElementById('starry-sky');
  let starCtx = starCanvas ? starCanvas.getContext('2d') : null;
  let animationFrameId = null;
  let stars = [];
  let meteors = [];
  let isStarfieldRunning = false;
  let lastMeteorTime = 0;

  function initStarfield() {
    if (!starCanvas) return;
    resizeStarCanvas();
    window.addEventListener('resize', resizeStarCanvas);

    // Create stars
    const starCount = Math.floor((starCanvas.width * starCanvas.height) / 7500);
    stars = [];
    const starColors = [
      '255, 255, 255',
      '224, 231, 255',
      '254, 240, 138',
      '233, 213, 255',
      '186, 230, 253'
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        radius: Math.random() * 1.5 + 0.4,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function resizeStarCanvas() {
    if (!starCanvas) return;
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function spawnMeteor() {
    if (!starCanvas) return;
    const startX = Math.random() * starCanvas.width * 0.8 + starCanvas.width * 0.1;
    const startY = Math.random() * (starCanvas.height * 0.35);
    const length = Math.random() * 80 + 90;
    const speed = Math.random() * 6 + 10;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.25;

    meteors.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.015
    });
  }

  function drawStarfield(timestamp) {
    if (!isStarfieldRunning || !starCtx) return;

    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // 1. Subtle Constellation Links
    starCtx.lineWidth = 0.5;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 75) {
          const alpha = (1 - dist / 75) * 0.07;
          starCtx.strokeStyle = `rgba(165, 180, 252, ${alpha})`;
          starCtx.beginPath();
          starCtx.moveTo(stars[i].x, stars[i].y);
          starCtx.lineTo(stars[j].x, stars[j].y);
          starCtx.stroke();
        }
      }
    }

    // 2. Twinkling Stars
    for (const star of stars) {
      star.phase += star.twinkleSpeed;
      const alpha = Math.max(0.1, star.baseAlpha + Math.sin(star.phase) * 0.35);

      starCtx.beginPath();
      starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(${star.color}, ${alpha})`;
      starCtx.shadowBlur = star.radius > 1 ? 4 : 0;
      starCtx.shadowColor = `rgba(${star.color}, 0.8)`;
      starCtx.fill();
    }
    starCtx.shadowBlur = 0;

    // 3. Meteors (Shooting Stars)
    if (!lastMeteorTime) lastMeteorTime = timestamp;
    if (timestamp - lastMeteorTime > 4500 + Math.random() * 3000) {
      spawnMeteor();
      lastMeteorTime = timestamp;
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.dx;
      m.y += m.dy;
      m.opacity -= m.decay;

      if (m.opacity <= 0 || m.x > starCanvas.width || m.y > starCanvas.height) {
        meteors.splice(i, 1);
        continue;
      }

      const tailX = m.x - (m.dx / m.speed) * m.length;
      const tailY = m.y - (m.dy / m.speed) * m.length;

      const grad = starCtx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.7, `rgba(165, 180, 252, ${m.opacity * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity})`);

      starCtx.beginPath();
      starCtx.moveTo(tailX, tailY);
      starCtx.lineTo(m.x, m.y);
      starCtx.strokeStyle = grad;
      starCtx.lineWidth = 1.8;
      starCtx.lineCap = 'round';
      starCtx.stroke();

      starCtx.beginPath();
      starCtx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
      starCtx.shadowBlur = 8;
      starCtx.shadowColor = '#818cf8';
      starCtx.fill();
      starCtx.shadowBlur = 0;
    }

    animationFrameId = requestAnimationFrame(drawStarfield);
  }

  function startStarfield() {
    if (!starCanvas || isStarfieldRunning) return;
    if (stars.length === 0) initStarfield();
    isStarfieldRunning = true;
    lastMeteorTime = performance.now();
    animationFrameId = requestAnimationFrame(drawStarfield);
  }

  function stopStarfield() {
    isStarfieldRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (starCtx && starCanvas) {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    }
  }

  // Theme Toggle (Light / Dark)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('site-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
      themeText.textContent = '深色星夜';
      startStarfield();
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.textContent = '☀️';
      themeText.textContent = '柔和暖白';
      stopStarfield();
    }
    localStorage.setItem('site-theme', theme);
  }

  // 2. Cute Petting Interaction (Totoro Easter Egg)
  const petTrigger = document.getElementById('pet-trigger');
  const petEasterEggCard = document.getElementById('pet-easter-egg');
  const petQuotes = [
    '✨ 萌度炸裂！幸福感 +100',
    '💖 摸了摸毛茸茸的小龍貓～',
    '🐾 龍貓歪著頭看著你！',
    '🍡 給龍貓吃好吃的堅果',
    '🌸 今天也是元氣滿滿的一天！'
  ];

  function spawnHearts(e, targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'pet-heart-popup';
    const icons = ['💖', '✨', '🐾', '🌸', '💫'];
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    
    // Position relative to target
    heart.style.left = `${(e.clientX || (rect.left + rect.width / 2)) - 15}px`;
    heart.style.top = `${(e.clientY || (rect.top + rect.height / 2)) - 25}px`;
    heart.style.position = 'fixed';
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);

    // Show temporary toast message
    showToast(petQuotes[Math.floor(Math.random() * petQuotes.length)]);
  }

  if (petTrigger) {
    petTrigger.addEventListener('click', (e) => spawnHearts(e, petTrigger));
  }
  if (petEasterEggCard) {
    petEasterEggCard.addEventListener('click', (e) => spawnHearts(e, petEasterEggCard));
  }

  // 3. Web Audio API - Caleb Hearn & ROSIE: "Little Bit Better" Synthesizer
  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;

  const playBtn = document.getElementById('play-music-btn');
  const playIcon = document.getElementById('play-icon');
  const playLabel = document.getElementById('play-label');
  const vinylDisc = document.getElementById('vinyl-disc');
  const waveBars = document.getElementById('wave-bars');

  // Exact note frequencies in B Major (Hz)
  const NOTE = {
    // Bass roots
    GS2: 103.83,
    E2: 82.41,
    B2: 123.47,
    FS2: 92.50,

    // Chords / Arpeggio
    FS3: 185.00,
    GS3: 207.65,
    AS3: 233.08,
    B3: 246.94,
    CS4: 277.18,
    DS4: 311.13,
    E4: 329.63,
    FS4: 369.99,
    GS4: 415.30,
    AS4: 466.16,

    // Lead Chorus Melody
    B4: 493.88,
    CS5: 554.37,
    DS5: 622.25,
    E5: 659.25,
    FS5: 739.99,
    GS5: 830.61
  };

  // 32-step musical arrangement of "Little Bit Better" chorus (G#m7 -> E -> B -> F#)
  const littleBitBetterScore = [
    // Bar 1: G#m7 ("I hope you find someone...")
    { bass: NOTE.GS2, arp: NOTE.DS4, lead: NOTE.FS4 },
    { arp: NOTE.FS4 },
    { arp: NOTE.B4, lead: NOTE.FS4 },
    { arp: NOTE.DS4, lead: NOTE.GS4 },
    { bass: NOTE.GS2, arp: NOTE.FS4, lead: NOTE.FS4 },
    { arp: NOTE.B4, lead: NOTE.DS4 },
    { arp: NOTE.DS4, lead: NOTE.CS4 },
    { arp: NOTE.FS4 },

    // Bar 2: E ("Who makes you feel a little bit better...")
    { bass: NOTE.E2, arp: NOTE.B3, lead: NOTE.B3 },
    { arp: NOTE.E4, lead: NOTE.CS4 },
    { arp: NOTE.GS4, lead: NOTE.DS4 },
    { arp: NOTE.B4, lead: NOTE.DS4 },
    { bass: NOTE.E2, arp: NOTE.E4, lead: NOTE.CS4 },
    { arp: NOTE.GS4, lead: NOTE.B3 },
    { arp: NOTE.B4, lead: NOTE.CS4 },
    { arp: NOTE.GS4, lead: NOTE.B3 },

    // Bar 3: B ("Makes the hard days feel a little bit lighter...")
    { bass: NOTE.B2, arp: NOTE.FS3, lead: NOTE.FS4 },
    { arp: NOTE.DS4, lead: NOTE.GS4 },
    { arp: NOTE.FS4, lead: NOTE.FS4 },
    { arp: NOTE.B4, lead: NOTE.DS4 },
    { bass: NOTE.B2, arp: NOTE.FS4, lead: NOTE.CS4 },
    { arp: NOTE.DS4, lead: NOTE.B3 },
    { arp: NOTE.B4, lead: NOTE.CS4 },
    { arp: NOTE.FS4, lead: NOTE.DS4 },

    // Bar 4: F# ("Makes you feel a little bit better...")
    { bass: NOTE.FS2, arp: NOTE.CS4, lead: NOTE.DS4 },
    { arp: NOTE.FS4, lead: NOTE.CS4 },
    { arp: NOTE.AS4, lead: NOTE.B3 },
    { arp: NOTE.CS4, lead: NOTE.CS4 },
    { bass: NOTE.FS2, arp: NOTE.FS4, lead: NOTE.DS4 },
    { arp: NOTE.AS4, lead: NOTE.CS4 },
    { arp: NOTE.FS4, lead: NOTE.B3 },
    { arp: NOTE.CS4 }
  ];

  function playTone(freq, duration, volume, type = 'sine') {
    if (!audioCtx || !freq) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (err) {
      console.warn("Audio play error", err);
    }
  }

  function startMusicLoop() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    vinylDisc.classList.add('playing');
    waveBars.classList.add('active');
    playIcon.textContent = '⏸️';
    playLabel.textContent = '暫停音樂';
    showToast('🎵 正在播放：Little Bit Better - Caleb Hearn & ROSIE');

    let currentStep = 0;
    // ~250ms per step creates a gentle ~120 BPM folk acoustic groove
    timerId = setInterval(() => {
      if (!isPlaying) return;
      const stepData = littleBitBetterScore[currentStep];

      // Bass root note
      if (stepData.bass) {
        playTone(stepData.bass, 0.9, 0.14, 'triangle');
      }
      // Gentle acoustic guitar pluck
      if (stepData.arp) {
        playTone(stepData.arp, 0.45, 0.07, 'sine');
      }
      // Singing vocal chorus melody
      if (stepData.lead) {
        playTone(stepData.lead, 0.65, 0.12, 'sine');
      }

      currentStep = (currentStep + 1) % littleBitBetterScore.length;
    }, 250);
  }

  function stopMusicLoop() {
    isPlaying = false;
    clearInterval(timerId);
    vinylDisc.classList.remove('playing');
    waveBars.classList.remove('active');
    playIcon.textContent = '▶️';
    playLabel.textContent = '播放 Little Bit Better';
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopMusicLoop();
      } else {
        startMusicLoop();
      }
    });
  }

  // 4. Interactive Riding Scooter
  const scooter = document.getElementById('scooter-icon');
  const kmDisplay = document.getElementById('riding-km');
  let currentKm = 128;

  if (scooter && kmDisplay) {
    scooter.addEventListener('click', () => {
      currentKm += Math.floor(Math.random() * 5) + 3;
      kmDisplay.textContent = `${currentKm} km`;
      scooter.style.transform = 'translateY(-10px) rotate(15deg) scale(1.3)';
      setTimeout(() => {
        scooter.style.transform = '';
      }, 300);
      showToast('🛵 吹著微風，自由向前奔馳！');
    });
  }

  // 5. Lightbox Modal
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.zoomable-img').forEach(imgWrapper => {
    imgWrapper.addEventListener('click', () => {
      const img = imgWrapper.querySelector('img');
      const caption = imgWrapper.getAttribute('data-caption') || img.alt || '';
      
      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 6. Like Button counters
  document.querySelectorAll('.like-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const countEl = btn.querySelector('.like-count');
      let count = parseInt(countEl.textContent, 10);
      count++;
      countEl.textContent = count;
      btn.classList.add('liked');
      btn.classList.add('pulse');
      setTimeout(() => btn.classList.remove('pulse'), 400);
    });
  });

  // 7. Toast Notification Utility
  let toastTimeout;
  function showToast(message) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '2rem';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(50px)';
      toast.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
      toast.style.color = '#fff';
      toast.style.padding = '0.75rem 1.5rem';
      toast.style.borderRadius = '9999px';
      toast.style.fontSize = '0.92rem';
      toast.style.fontWeight = '600';
      toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      toast.style.backdropFilter = 'blur(10px)';
      toast.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      toast.style.zIndex = '9999';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  }

  // ===================================================================
  // 7.5. Ting's Space Like Index & Popularity Meter (按讚指數系統)
  // ===================================================================
  const navLikeBtn = document.getElementById('space-like-nav-btn');
  const navLikeCountEl = document.getElementById('nav-like-count');
  const spaceLikeBtn = document.getElementById('space-like-btn');
  const mainLikeCountEl = document.getElementById('main-like-count');
  const popularityTierEl = document.getElementById('popularity-tier');
  const popularityProgressEl = document.getElementById('popularity-progress');

  let spaceLikes = parseInt(localStorage.getItem('tings_space_likes') || '1314', 10);

  function updateSpaceLikesUI() {
    const formatted = spaceLikes.toLocaleString();
    if (navLikeCountEl) navLikeCountEl.textContent = formatted;
    if (mainLikeCountEl) mainLikeCountEl.textContent = formatted;

    // Calculate tier & progress
    let tierText = '🌸 溫暖初見 · 快樂相伴';
    let progressPct = 80;

    if (spaceLikes >= 1400) {
      tierText = '👑 頂級人氣王 · 龍貓守護神';
      progressPct = 100;
    } else if (spaceLikes >= 1350) {
      tierText = '🔥 萬人迷偶像 · 能量爆棚';
      progressPct = Math.min(98, 90 + (spaceLikes - 1350) * 0.16);
    } else if (spaceLikes >= 1320) {
      tierText = '🌟 人氣爆棚 · 萌寵達人';
      progressPct = Math.min(90, 85 + (spaceLikes - 1320) * 0.16);
    } else {
      progressPct = Math.min(85, 80 + (spaceLikes - 1314) * 0.8);
    }

    if (popularityTierEl) popularityTierEl.textContent = tierText;
    if (popularityProgressEl) popularityProgressEl.style.width = `${progressPct}%`;
  }

  function handleSpaceLike(e, targetBtn) {
    spaceLikes++;
    localStorage.setItem('tings_space_likes', spaceLikes);
    updateSpaceLikesUI();

    // Cute flying heart effect
    if (targetBtn) {
      spawnHearts(e, targetBtn);
      targetBtn.classList.add('pulse');
      setTimeout(() => targetBtn.classList.remove('pulse'), 400);
    }

    // Play sweet chime sound
    if (audioCtx) {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }

    const likeMessages = [
      '💖 謝謝你的應援！Ting\'s Space 按讚指數 +1',
      '✨ 獲得滿滿的治癒能量！感謝你的喜歡～',
      '🐾 小龍貓開心地蹭了蹭你！按讚指數持續上升！',
      '🌸 人氣指數飆升中！今天也是美好的一天～'
    ];
    showToast(likeMessages[Math.floor(Math.random() * likeMessages.length)]);
  }

  if (navLikeBtn) {
    navLikeBtn.addEventListener('click', (e) => handleSpaceLike(e, navLikeBtn));
  }
  if (spaceLikeBtn) {
    spaceLikeBtn.addEventListener('click', (e) => handleSpaceLike(e, spaceLikeBtn));
  }

  // Initial UI sync
  updateSpaceLikesUI();

  // ===================================================================
  // 8. Totoro Acorn Catch Mini Game (龍貓接堅果大冒險)
  // ===================================================================
  const gameCanvas = document.getElementById('game-canvas');
  if (gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    const gameOverlay = document.getElementById('game-overlay');
    const overlayIcon = document.getElementById('overlay-icon');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDesc = document.getElementById('overlay-desc');
    const gameStartBtn = document.getElementById('game-start-btn');
    const gameScoreEl = document.getElementById('game-score');
    const gameTimerEl = document.getElementById('game-timer');
    const gameHighscoreEl = document.getElementById('game-highscore');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    // Virtual game resolution
    gameCanvas.width = 700;
    gameCanvas.height = 380;

    // Load Totoro Sprite
    const totoroSprite = new Image();
    totoroSprite.src = 'tomcat.jpg';

    // Game state
    let isGameRunning = false;
    let score = 0;
    let timeLeft = 30;
    let gameTimerId = null;
    let spawnTimerId = null;
    let gameAnimFrameId = null;
    let highscore = parseInt(localStorage.getItem('totoro-highscore') || '0', 10);
    gameHighscoreEl.textContent = highscore;

    // Player Totoro
    const player = {
      x: gameCanvas.width / 2,
      y: gameCanvas.height - 65,
      width: 58,
      height: 58,
      targetX: gameCanvas.width / 2,
      bounce: 0
    };

    let items = [];
    let floatTexts = [];
    let particles = [];
    let keyState = { left: false, right: false };

    // Item types definition
    const ITEM_TYPES = [
      { type: 'acorn', icon: '🌰', points: 10, prob: 0.65, size: 28 },
      { type: 'strawberry', icon: '🍓', points: 20, prob: 0.18, size: 28 },
      { type: 'star', icon: '⭐', points: 30, prob: 0.09, size: 30, bonusTime: 2 },
      { type: 'cloud', icon: '⚡', points: -10, prob: 0.08, size: 30 }
    ];

    // Sound effects via Web Audio API
    function playSfx(type) {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioClass();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'catch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'star') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'hurt') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'gameover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        osc.frequency.setValueAtTime(659.25, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.65);
      }
    }

    function spawnItem() {
      if (!isGameRunning) return;
      const rand = Math.random();
      let cumulative = 0;
      let chosen = ITEM_TYPES[0];

      for (const it of ITEM_TYPES) {
        cumulative += it.prob;
        if (rand <= cumulative) {
          chosen = it;
          break;
        }
      }

      items.push({
        x: Math.random() * (gameCanvas.width - 60) + 30,
        y: -30,
        size: chosen.size,
        icon: chosen.icon,
        points: chosen.points,
        type: chosen.type,
        bonusTime: chosen.bonusTime || 0,
        speed: Math.random() * 2 + 2.6,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.06
      });
    }

    function addFloatText(x, y, text, color) {
      floatTexts.push({
        x,
        y,
        text,
        color,
        alpha: 1,
        vy: -1.5
      });
    }

    function addParticles(x, y, color) {
      for (let i = 0; i < 7; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 2,
          color,
          alpha: 1
        });
      }
    }

    function startGame() {
      isGameRunning = true;
      score = 0;
      timeLeft = 30;
      items = [];
      floatTexts = [];
      particles = [];
      gameScoreEl.textContent = '0';
      gameTimerEl.textContent = '30s';
      gameOverlay.classList.add('hidden');
      player.x = gameCanvas.width / 2;
      player.targetX = gameCanvas.width / 2;

      // Countdown timer
      clearInterval(gameTimerId);
      gameTimerId = setInterval(() => {
        timeLeft--;
        gameTimerEl.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);

      // Spawning loop
      clearInterval(spawnTimerId);
      spawnTimerId = setInterval(spawnItem, 620);

      // Animation frame
      cancelAnimationFrame(gameAnimFrameId);
      gameLoop();
    }

    function endGame() {
      isGameRunning = false;
      clearInterval(gameTimerId);
      clearInterval(spawnTimerId);
      playSfx('gameover');

      // Check high score
      let isNewRecord = false;
      if (score > highscore) {
        highscore = score;
        localStorage.setItem('totoro-highscore', highscore);
        gameHighscoreEl.textContent = highscore;
        isNewRecord = true;
      }

      // Determine rank
      let rankMsg = '';
      if (score >= 260) {
        rankMsg = '👑 傳奇龍貓飼育大師！你的反應速度無人能敵！';
      } else if (score >= 180) {
        rankMsg = '🏆 特級龍貓投餵員！龍貓吃得心滿意足～';
      } else if (score >= 100) {
        rankMsg = '✨ 暖心好搭檔！龍貓蹭了蹭你表示感謝！';
      } else {
        rankMsg = '🐾 龍貓拍了拍你：沒關係，再挑戰一次吧！';
      }

      overlayIcon.textContent = isNewRecord ? '🎉' : '⭐';
      overlayTitle.textContent = isNewRecord ? '創下新紀錄！' : '遊戲結束！';
      overlayDesc.innerHTML = `本次得分：<strong>${score} 分</strong><br>${rankMsg}`;
      gameStartBtn.innerHTML = '<span>🔄 再玩一次</span>';
      gameOverlay.classList.remove('hidden');
    }

    function updateGame() {
      // Handle keyboard smooth movement
      if (keyState.left) player.targetX -= 8;
      if (keyState.right) player.targetX += 8;

      // Clamp target within canvas
      player.targetX = Math.max(player.width / 2, Math.min(gameCanvas.width - player.width / 2, player.targetX));

      // Lerp player position
      player.x += (player.targetX - player.x) * 0.22;

      // Bounce recovery
      if (player.bounce > 0) player.bounce -= 0.1;

      // Update falling items
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;
        it.rotation += it.rotSpeed;

        // Check collision with player
        const hitDistanceX = Math.abs(it.x - player.x);
        const hitDistanceY = Math.abs(it.y - player.y);

        if (hitDistanceX < (player.width / 2 + it.size / 2 - 4) && hitDistanceY < (player.height / 2 + 10)) {
          // Catch item!
          score = Math.max(0, score + it.points);
          gameScoreEl.textContent = score;
          player.bounce = 1.2;

          if (it.type === 'cloud') {
            playSfx('hurt');
            addFloatText(it.x, it.y - 15, `${it.points}`, '#ef4444');
            addParticles(it.x, it.y, '#94a3b8');
          } else {
            if (it.type === 'star') {
              playSfx('star');
              timeLeft += it.bonusTime;
              gameTimerEl.textContent = `${timeLeft}s`;
              addFloatText(it.x, it.y - 15, `+${it.points} (+2s!)`, '#eab308');
              addParticles(it.x, it.y, '#fbbf24');
            } else {
              playSfx('catch');
              addFloatText(it.x, it.y - 15, `+${it.points}`, '#10b981');
              addParticles(it.x, it.y, it.type === 'strawberry' ? '#f43f5e' : '#f59e0b');
            }
          }

          items.splice(i, 1);
          continue;
        }

        // Remove if off screen
        if (it.y > gameCanvas.height + 40) {
          items.splice(i, 1);
        }
      }

      // Update floating texts
      for (let i = floatTexts.length - 1; i >= 0; i--) {
        const ft = floatTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.025;
        if (ft.alpha <= 0) floatTexts.splice(i, 1);
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        if (p.alpha <= 0) particles.splice(i, 1);
      }
    }

    function renderGame() {
      gCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

      // Draw gentle ground grass line
      gCtx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      gCtx.fillRect(0, gameCanvas.height - 18, gameCanvas.width, 18);

      // Draw falling items
      for (const it of items) {
        gCtx.save();
        gCtx.translate(it.x, it.y);
        gCtx.rotate(it.rotation);
        gCtx.font = `${it.size}px sans-serif`;
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillText(it.icon, 0, 0);
        gCtx.restore();
      }

      // Draw player (Totoro mascot)
      gCtx.save();
      const bounceOffset = Math.sin(player.bounce * Math.PI) * 8;
      const px = player.x - player.width / 2;
      const py = player.y - player.height / 2 - bounceOffset;

      // Shadow under Totoro
      gCtx.beginPath();
      gCtx.ellipse(player.x, gameCanvas.height - 12, player.width / 2, 7, 0, 0, Math.PI * 2);
      gCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      gCtx.fill();

      // Rounded Totoro avatar
      gCtx.beginPath();
      gCtx.arc(player.x, py + player.height / 2, player.width / 2, 0, Math.PI * 2);
      gCtx.clip();

      if (totoroSprite.complete && totoroSprite.naturalWidth !== 0) {
        gCtx.drawImage(totoroSprite, px, py, player.width, player.height);
      } else {
        // Fallback procedural Totoro badge
        gCtx.fillStyle = '#ffffff';
        gCtx.fill();
        gCtx.font = '32px sans-serif';
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillText('🐰', player.x, py + player.height / 2);
      }
      gCtx.restore();

      // Draw player border ring
      gCtx.beginPath();
      gCtx.arc(player.x, py + player.height / 2, player.width / 2, 0, Math.PI * 2);
      gCtx.strokeStyle = '#f43f5e';
      gCtx.lineWidth = 3;
      gCtx.stroke();

      // Draw particles
      for (const p of particles) {
        gCtx.beginPath();
        gCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        gCtx.fillStyle = p.color;
        gCtx.globalAlpha = p.alpha;
        gCtx.fill();
        gCtx.globalAlpha = 1;
      }

      // Draw floating score texts
      gCtx.font = 'bold 18px Outfit, sans-serif';
      gCtx.textAlign = 'center';
      for (const ft of floatTexts) {
        gCtx.fillStyle = ft.color;
        gCtx.globalAlpha = ft.alpha;
        gCtx.fillText(ft.text, ft.x, ft.y);
        gCtx.globalAlpha = 1;
      }
    }

    function gameLoop() {
      if (!isGameRunning) return;
      updateGame();
      renderGame();
      gameAnimFrameId = requestAnimationFrame(gameLoop);
    }

    // Input handlers
    function handlePointerMove(clientX) {
      const rect = gameCanvas.getBoundingClientRect();
      const scaleX = gameCanvas.width / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;
      player.targetX = canvasX;
    }

    gameCanvas.addEventListener('mousemove', (e) => {
      if (!isGameRunning) return;
      handlePointerMove(e.clientX);
    });

    gameCanvas.addEventListener('touchmove', (e) => {
      if (!isGameRunning) return;
      if (e.touches.length > 0) {
        e.preventDefault();
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: false });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keyState.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keyState.right = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keyState.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keyState.right = false;
      }
    });

    // Mobile touch button helpers
    let touchHoldTimer = null;
    function startTouchMove(dir) {
      if (!isGameRunning) return;
      clearInterval(touchHoldTimer);
      player.targetX += dir * 25;
      touchHoldTimer = setInterval(() => {
        player.targetX += dir * 18;
      }, 40);
    }

    function stopTouchMove() {
      clearInterval(touchHoldTimer);
    }

    if (btnLeft && btnRight) {
      btnLeft.addEventListener('mousedown', () => startTouchMove(-1));
      btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); startTouchMove(-1); });
      btnRight.addEventListener('mousedown', () => startTouchMove(1));
      btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); startTouchMove(1); });

      window.addEventListener('mouseup', stopTouchMove);
      window.addEventListener('touchend', stopTouchMove);
    }

    gameStartBtn.addEventListener('click', startGame);

    // Initial idle draw
    totoroSprite.onload = () => {
      if (!isGameRunning) renderGame();
    };
    renderGame();
  }
});
