/**
 * CASSETTE FUTURISM INTERACTIVE OPERATING SYSTEM
 * Operator: Shreya Ravi Kottayakkaran
 * Core: Audio Synthesizer, Cassette Deck Engine, Retro Terminal, CRT Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. WEB AUDIO SYNTHESIZER (Self-contained 1980s mechanical & chip sounds)
  // =========================================================================
  let audioCtx = null;
  let sfxEnabled = false;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const soundFx = {
    // Mechanical relay click for buttons and switches
    click: () => {
      if (!sfxEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      } catch (e) { /* ignore audio err */ }
    },

    // Cassette deck latch engaged sound
    cassetteLatch: () => {
      if (!sfxEnabled || !audioCtx) return;
      try {
        // Multi-frequency snap
        [180, 290, 80].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.02);
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08 + idx * 0.02);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + idx * 0.02);
          osc.stop(audioCtx.currentTime + 0.08 + idx * 0.02);
        });
      } catch (e) { /* ignore */ }
    },

    // High-pitched 8-bit telex transmission burst
    telexBeep: () => {
      if (!sfxEnabled || !audioCtx) return;
      try {
        const notes = [880, 1200, 1760];
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.06);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.06 + 0.05);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + i * 0.06);
          osc.stop(audioCtx.currentTime + i * 0.06 + 0.05);
        });
      } catch (e) { /* ignore */ }
    },

    // Terminal key typewriter click
    keyClick: () => {
      if (!sfxEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.02);
      } catch (e) { /* ignore */ }
    }
  };

  // =========================================================================
  // 2. HEADER CONTROLS (SFX Toggle, CRT Toggle, Live Tape Counter)
  // =========================================================================
  const btnAudioToggle = document.getElementById('btnAudioToggle');
  const audioToggleState = document.getElementById('audioToggleState');
  const audioLabel = document.getElementById('audioLabel');
  const btnCrtToggle = document.getElementById('btnCrtToggle');
  const crtToggleState = document.getElementById('crtToggleState');
  const crtLabel = document.getElementById('crtLabel');
  const tapeCounter = document.getElementById('tapeCounter');

  let tapeCounterVal = 427;
  let counterTimer = null;

  function updateTapeCounter(increment = 1) {
    tapeCounterVal = (tapeCounterVal + increment) % 9999;
    if (tapeCounter) {
      tapeCounter.textContent = String(tapeCounterVal).padStart(4, '0');
    }
  }

  // Audio Switch
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      initAudioContext();
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) {
        audioToggleState.classList.add('active');
        audioLabel.textContent = 'ON';
        soundFx.cassetteLatch();
      } else {
        audioToggleState.classList.remove('active');
        audioLabel.textContent = 'OFF';
      }
    });
  }

  // CRT Scanlines Switch
  if (btnCrtToggle) {
    btnCrtToggle.addEventListener('click', () => {
      soundFx.click();
      const isActive = document.body.classList.toggle('scanlines-active');
      if (isActive) {
        crtToggleState.classList.add('active');
        crtLabel.textContent = 'ON';
      } else {
        crtToggleState.classList.remove('active');
        crtLabel.textContent = 'OFF';
      }
    });
  }

  // Bind general sound to buttons
  document.querySelectorAll('.btn, .mech-btn, .tactile-switch, .macro-btn, .side-btn').forEach(el => {
    el.addEventListener('click', () => soundFx.click());
  });

  // =========================================================================
  // 3. CASSETTE DECK INTERACTIVE ENGINE (5 FEATURED PROJECTS SHOWCASE)
  // =========================================================================
  const cassetteCase = document.getElementById('cassetteCase');
  const tapeStatusText = document.getElementById('tapeStatusText');
  const tapeTitleDisplay = document.getElementById('tapeTitleDisplay');
  const tapeTrackName = document.getElementById('tapeTrackName');
  const tapeTrackIndexBadge = document.getElementById('tapeTrackIndexBadge');
  const btnSideA = document.getElementById('btnSideA');
  const btnSideB = document.getElementById('btnSideB');

  const btnPrevProject = document.getElementById('btnPrevProject');
  const btnNextProject = document.getElementById('btnNextProject');
  const btnPlayTour = document.getElementById('btnPlayTour');
  const btnPauseTour = document.getElementById('btnPauseTour');
  const btnFlipSide = document.getElementById('btnFlipSide');

  // Stage display DOM elements
  const stageScreen = document.getElementById('stageScreen');
  const stageVectorHolder = document.getElementById('stageVectorHolder');
  const stageHudLeft = document.getElementById('stageHudLeft');
  const stageHudRight = document.getElementById('stageHudRight');
  const stageBadge = document.getElementById('stageBadge');
  const stageTrackId = document.getElementById('stageTrackId');
  const stageTitle = document.getElementById('stageTitle');
  const stageLead = document.getElementById('stageLead');
  const stageMetricsBanner = document.getElementById('stageMetricsBanner');
  const stageHighlights = document.getElementById('stageHighlights');
  const stageTechStack = document.getElementById('stageTechStack');
  const stageGithubLink = document.getElementById('stageGithubLink');

  // Track buttons and mini-index cards
  const trackButtons = document.querySelectorAll('.track-select-btn');
  const indexCards = document.querySelectorAll('.index-mini-card');

  let currentProjectIndex = 0;
  let autoTourActive = true;
  let autoTourInterval = null;

  // Complete data dictionary for all 5 projects
  const projectsData = [
    {
      id: "smart-parking",
      trackNum: "01",
      side: "A",
      counter: "0100",
      badge: "IEEE ICDICI 2025 // FIRST AUTHOR",
      badgeClass: "green-badge",
      trackCode: "TRACK 01 // SRK-01",
      tapeTitle: "TRK 01: SMART PARKING & DYNAMIC PRICING",
      subHeader: "YOLOv12 & XGBoost // HIGH BIAS (CrO2)",
      title: "A Dual AI and IoT Approach to Smart Parking: License Plate Recognition and Dynamic Pricing",
      lead: "First-author research presented and published at the 2025 IEEE International Conference on Distributed Computing and Intelligent Innovations (ICDICI 2025). Architected an end-to-end intelligent parking automation ecosystem that integrates real-time computer vision with predictive econometric pricing models.",
      metrics: [
        { val: "YOLOv12", lbl: "Edge LPR Detection" },
        { val: "XGBoost", lbl: "Dynamic Surge Model" },
        { val: "IEEE ICDICI", lbl: "First Author Paper" }
      ],
      highlights: [
        "Engineered real-time YOLOv12-based license plate recognition pipelines for vehicle verification and instant check-in/out.",
        "Developed XGBoost dynamic pricing models adjusting slot fees in real time based on occupancy metrics and predicted vehicle dwell times.",
        "Architected lightweight Flask REST microservices with SQLite for reliable transaction settlement and slot management."
      ],
      tech: ["YOLOv12", "XGBoost", "Flask", "SQLite", "REST APIs", "Python", "IoT"],
      githubUrl: "https://github.com/ShreyaRaviK",
      hudLeft: "BURST: 30 FPS",
      hudRight: "IEEE ICDICI 2025",
      visualType: "parking"
    },
    {
      id: "omr-evaluation",
      trackNum: "02",
      side: "A",
      counter: "0200",
      badge: "CODE4EDTECH CHALLENGE // 1ST PLACE WINNER",
      badgeClass: "red-badge",
      trackCode: "TRACK 02 // SRK-02",
      tapeTitle: "TRK 02: AUTOMATED OMR EVALUATION SYSTEM",
      subHeader: "YOLOv12 Optical Mark Detector // CrO2",
      title: "Automated OMR Evaluation and Scoring System",
      lead: "Award-winning computer vision platform for automated bubble detection, optical grid alignment, and automated scoring of standard educational optical mark sheets. Won 1st place and ₹1,00,000 cash prize at the Code4EdTech Challenge Hackathon by Innomatics Research Labs, Hyderabad.",
      metrics: [
        { val: "₹1,00,000", lbl: "1st Place Cash Prize" },
        { val: "YOLOv12", lbl: "Custom Bubble Model" },
        { val: "30 FPS", lbl: "Streamlit Inference" }
      ],
      highlights: [
        "Trained custom YOLOv12 weights for shaded optical bubble identification resilient to non-uniform lighting and skewed mobile phone camera feeds.",
        "Engineered Streamlit interactive visual verification frontend with Flask backend API serving real-time inferences.",
        "Instant grading ledger export with cryptographic score hash generation ensuring tamper-proof student results."
      ],
      tech: ["YOLOv12", "Streamlit", "Flask", "OpenCV", "Python", "NumPy"],
      githubUrl: "https://github.com/ShreyaRaviK",
      hudLeft: "BURST: 30 FPS",
      hudRight: "INNOMATICS LABS",
      visualType: "omr"
    },
    {
      id: "crop-disease",
      trackNum: "03",
      side: "A",
      counter: "0300",
      badge: "99.13% VALIDATION ACCURACY // AGRI-AI",
      badgeClass: "green-badge",
      trackCode: "TRACK 03 // SRK-03",
      tapeTitle: "TRK 03: CROP DISEASE & SEVERITY PIPELINE",
      subHeader: "Sequential CNN & EfficientNet-B3 // DOLBY B",
      title: "Crop Disease Detection and Classification with Severity Stratification",
      lead: "Constructed a dual-stage hybrid agricultural deep learning diagnostic platform combining a Sequential CNN for pathogen classification with a fine-tuned EfficientNet-B3 backbone for continuous leaf severity stage stratification.",
      metrics: [
        { val: "99.13%", lbl: "CNN Validation Acc" },
        { val: "1.47", lbl: "Severity RMSE" },
        { val: "Dual-Stage", lbl: "Diagnostic Pipeline" }
      ],
      highlights: [
        "Formulated end-to-end dataset augmentation pipeline handling multi-class foliar infections across challenging real-world field conditions.",
        "Deployed Sequential CNN achieving 99.13% validation accuracy for disease species and fungal pathogen classification.",
        "Integrated fine-tuned EfficientNet-B3 regression model predicting continuous leaf infection severity index (RMSE: 1.47)."
      ],
      tech: ["Sequential CNN", "EfficientNet-B3", "TensorFlow", "Keras", "Python", "Data Pipeline"],
      githubUrl: "https://github.com/ShreyaRaviK",
      hudLeft: "VALIDATION: 99.13%",
      hudRight: "AGRI-AI LAB",
      visualType: "crop"
    },
    {
      id: "assistive-mobility",
      trackNum: "04",
      side: "B",
      counter: "0400",
      badge: "INFOSYS SPRINGBOARD 6.0 VIRTUAL LAB",
      badgeClass: "amber-badge",
      trackCode: "TRACK 04 // SRK-04",
      tapeTitle: "TRK 04: AI ASSISTIVE MOBILITY COMPANION",
      subHeader: "YOLOv8, Ollama LLM & Edge Voice // CrO2",
      title: "AI-Powered Assistive Mobility Tool for Visually Impaired",
      lead: "Engineered a real-time assistive mobility instrument empowering visually impaired individuals to perceive and navigate spatial obstacles through edge computer vision, local LLM spatial descriptions, and hands-free multilingual voice feedback.",
      metrics: [
        { val: "YOLOv8", lbl: "Real-Time Hazard Detection" },
        { val: "Ollama LLM", lbl: "Natural Spatial Speech" },
        { val: "Multilingual", lbl: "Edge Audio Synthesis" }
      ],
      highlights: [
        "Implemented real-time YOLOv8 object detection tracking static obstacles, moving obstacles, and hazard proximity zones.",
        "Integrated local Ollama LLM to synthesize raw bounding-box coordinate streams into concise, human-natural spatial guidance directives.",
        "Architected modular Django backend with PostgreSQL persistence and hands-free low-latency multilingual voice output."
      ],
      tech: ["YOLOv8", "Ollama LLM", "Django", "PostgreSQL", "Audio Synthesis", "Python"],
      githubUrl: "https://github.com/ShreyaRaviK",
      hudLeft: "RADAR: ACTIVE",
      hudRight: "INFOSYS 6.0 LAB",
      visualType: "mobility"
    },
    {
      id: "ecommerce-fsm",
      trackNum: "05",
      side: "B",
      counter: "0500",
      badge: "18.47 MS AVG LATENCY // DISTRIBUTED SYSTEMS",
      badgeClass: "amber-badge",
      trackCode: "TRACK 05 // SRK-05",
      tapeTitle: "TRK 05: FSM REAL-TIME COMMERCE ENGINE",
      subHeader: "React, Flask, WebSockets, Firebase // DOLBY",
      title: "Dynamic E-Commerce Platform with Finite State Machine Lifecycle",
      lead: "Engineered a high-throughput real-time e-commerce architecture utilizing React, Flask, Firebase Realtime Database, and WebSockets to synchronize checkout states with deterministic zero race conditions during rapid flash-sales.",
      metrics: [
        { val: "18.47 ms", lbl: "Avg Response Latency" },
        { val: "FSM Engine", lbl: "Deterministic State Lock" },
        { val: "WebSockets", lbl: "Realtime Bidirectional" }
      ],
      highlights: [
        "Built Finite State Machine (FSM) managing inventory reservations, cart lease expirations, checkout transitions, and order settlements.",
        "Implemented bidirectional WebSocket communication channels for multi-client instant inventory and cart synchronization.",
        "Maintained an ultra-lean 18.47 ms average endpoint latency under concurrent flash checkout load simulations."
      ],
      tech: ["React", "Flask", "Firebase Realtime DB", "WebSockets", "FSM Architecture", "Python"],
      githubUrl: "https://github.com/ShreyaRaviK",
      hudLeft: "LATENCY: 18.47 MS",
      hudRight: "WEBSOCKET PIPE",
      visualType: "ecommerce"
    }
  ];

  function getProjectVectorVisual(visualType) {
    if (visualType === 'parking') {
      return `
        <svg class="omr-vector-visual" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#151b18" />
          <rect x="25" y="20" width="350" height="200" stroke="#33ff00" stroke-width="1.5" stroke-dasharray="4 2" fill="#1b241e" />
          <text x="40" y="45" fill="#33ff00" font-family="VT323" font-size="16">CAM-04://LOT_IRUNGALUR [YOLOv12 LPR PIPELINE]</text>
          <rect x="40" y="55" width="320" height="1" fill="#33ff00" opacity="0.3" />
          <line x1="45" y1="140" x2="160" y2="140" stroke="#ffb000" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="45" y1="180" x2="160" y2="180" stroke="#ffb000" stroke-width="1" stroke-dasharray="3 3" />
          <text x="45" y="132" fill="#888" font-family="JetBrains Mono" font-size="10">SLOT 14B [OCCUPIED]</text>
          <rect x="60" y="70" width="140" height="95" stroke="#33ff00" stroke-width="2" fill="rgba(51, 255, 0, 0.08)" />
          <text x="65" y="85" fill="#33ff00" font-family="JetBrains Mono" font-size="10">VEHICLE_01 CONF: 0.98</text>
          <rect x="85" y="135" width="90" height="22" fill="#242624" stroke="#ffb000" stroke-width="1.5" />
          <text x="92" y="150" fill="#ffb000" font-family="VT323" font-size="16">KA 01 MJ 2025</text>
          <rect x="220" y="75" width="140" height="80" fill="#111613" stroke="#d2b48c" stroke-width="1" />
          <text x="230" y="95" fill="#d2b48c" font-family="VT323" font-size="14">&gt;&gt; XGBOOST PRICING ENGINE</text>
          <text x="230" y="115" fill="#33ff00" font-family="JetBrains Mono" font-size="11">LOT OCCUPANCY: 88%</text>
          <text x="230" y="132" fill="#ffb000" font-family="JetBrains Mono" font-size="11">DYNAMIC SURGE: 1.35x</text>
          <text x="230" y="148" fill="#e8e0d0" font-family="JetBrains Mono" font-size="10">CURRENT: ₹45.00/HR</text>
          <rect x="220" y="165" width="140" height="30" fill="rgba(51, 255, 0, 0.15)" stroke="#33ff00" stroke-width="1" />
          <text x="236" y="184" fill="#33ff00" font-family="VT323" font-size="15" font-weight="700">IEEE ICDICI 2025</text>
        </svg>
      `;
    } else if (visualType === 'omr') {
      return `
        <svg class="omr-vector-visual" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#1b2838" />
          <rect x="50" y="20" width="300" height="200" stroke="#d2b48c" stroke-width="2" stroke-dasharray="4 2" fill="#242624" />
          <text x="70" y="45" fill="#33ff00" font-family="VT323" font-size="16">OMR DETECT PIPELINE [YOLOv12]</text>
          <rect x="70" y="55" width="260" height="1" fill="#33ff00" opacity="0.4" />
          <circle cx="90" cy="80" r="7" stroke="#33ff00" stroke-width="1.5" />
          <circle cx="120" cy="80" r="7" fill="#33ff00" />
          <circle cx="150" cy="80" r="7" stroke="#33ff00" stroke-width="1.5" />
          <circle cx="180" cy="80" r="7" stroke="#33ff00" stroke-width="1.5" />
          <text x="210" y="84" fill="#ffb000" font-family="JetBrains Mono" font-size="11">Q1: [B] CONF 0.99</text>
          <circle cx="90" cy="115" r="7" stroke="#33ff00" stroke-width="1.5" />
          <circle cx="120" cy="115" r="7" stroke="#33ff00" stroke-width="1.5" />
          <circle cx="150" cy="115" r="7" stroke="#33ff00" stroke-width="1.5" />
          <circle cx="180" cy="115" r="7" fill="#33ff00" />
          <text x="210" y="119" fill="#ffb000" font-family="JetBrains Mono" font-size="11">Q2: [D] CONF 0.98</text>
          <circle cx="90" cy="150" r="7" fill="#33ff00" />
          <circle cx="120" cy="150" r="7" stroke="#33ff00" stroke-width="1.5" />
          <circle cx="150" cy="150" r="7" stroke="#33ff00" stroke-width="1.5" />
          <circle cx="180" cy="150" r="7" stroke="#33ff00" stroke-width="1.5" />
          <text x="210" y="154" fill="#ffb000" font-family="JetBrains Mono" font-size="11">Q3: [A] CONF 0.99</text>
          <rect x="75" y="65" width="125" height="105" stroke="#cc0000" stroke-width="1.5" stroke-dasharray="6 3" />
          <text x="80" y="195" fill="#e8e0d0" font-family="VT323" font-size="14">&gt;&gt; REAL-TIME BUBBLE SCORING ENGINE</text>
          <rect x="255" y="175" width="85" height="25" fill="#33ff00" />
          <text x="264" y="192" fill="#1b2838" font-family="VT323" font-size="15" font-weight="700">₹1,00,000 PASS</text>
        </svg>
      `;
    } else if (visualType === 'crop') {
      return `
        <svg class="omr-vector-visual" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#151b18" />
          <rect x="25" y="20" width="350" height="200" stroke="#33ff00" stroke-width="1.5" stroke-dasharray="4 2" fill="#1b241e" />
          <text x="40" y="45" fill="#33ff00" font-family="VT323" font-size="16">AGRI-VISION://HYBRID DIAGNOSTIC SCANNER</text>
          <rect x="40" y="55" width="320" height="1" fill="#33ff00" opacity="0.3" />
          <path d="M70 160 Q 80 80, 150 75 Q 180 110, 160 180 Q 110 190, 70 160 Z" fill="rgba(51, 255, 0, 0.12)" stroke="#33ff00" stroke-width="1.5" />
          <line x1="85" y1="150" x2="145" y2="90" stroke="#33ff00" stroke-width="1" stroke-dasharray="2 2" />
          <rect x="95" y="105" width="35" height="30" stroke="#cc0000" stroke-width="1.5" stroke-dasharray="3 2" fill="rgba(204, 0, 0, 0.2)" />
          <text x="92" y="100" fill="#ff6666" font-family="JetBrains Mono" font-size="9">LESION 01</text>
          <rect x="125" y="130" width="25" height="25" stroke="#cc0000" stroke-width="1.5" stroke-dasharray="3 2" fill="rgba(204, 0, 0, 0.2)" />
          <rect x="195" y="70" width="165" height="135" fill="#101411" stroke="#d2b48c" stroke-width="1" />
          <text x="205" y="90" fill="#33ff00" font-family="VT323" font-size="15">&gt;&gt; SEQUENTIAL CNN CLASSIFIER</text>
          <text x="205" y="110" fill="#33ff00" font-family="JetBrains Mono" font-size="12" font-weight="700">ACCURACY: 99.13%</text>
          <text x="205" y="128" fill="#e8e0d0" font-family="JetBrains Mono" font-size="10">PATHOGEN: CORN LEAF BLIGHT</text>
          <line x1="205" y1="138" x2="350" y2="138" stroke="#3d463d" />
          <text x="205" y="155" fill="#ffb000" font-family="VT323" font-size="15">&gt;&gt; EFFICIENTNET-B3 SEVERITY</text>
          <text x="205" y="173" fill="#ffb000" font-family="JetBrains Mono" font-size="11">RMSE: 1.47 (LOW ERROR)</text>
          <rect x="205" y="182" width="140" height="10" fill="#222" stroke="#444" />
          <rect x="207" y="184" width="75" height="6" fill="#ffb000" />
        </svg>
      `;
    } else if (visualType === 'mobility') {
      return `
        <svg class="omr-vector-visual" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#151b18" />
          <rect x="25" y="20" width="350" height="200" stroke="#33ff00" stroke-width="1.5" stroke-dasharray="4 2" fill="#1b241e" />
          <text x="40" y="45" fill="#33ff00" font-family="VT323" font-size="16">MOBILITY-HUD://YOLOv8 + OLLAMA LLM [INFOSYS LAB]</text>
          <rect x="40" y="55" width="320" height="1" fill="#33ff00" opacity="0.3" />
          <circle cx="105" cy="130" r="50" stroke="#33ff00" stroke-width="1" stroke-dasharray="4 4" fill="none" />
          <circle cx="105" cy="130" r="26" stroke="#33ff00" stroke-width="1" fill="none" />
          <line x1="105" y1="130" x2="148" y2="98" stroke="#33ff00" stroke-width="1.5" />
          <rect x="120" y="85" width="28" height="28" stroke="#ffb000" stroke-width="1.5" fill="rgba(255, 176, 0, 0.2)" />
          <text x="75" y="198" fill="#ffb000" font-family="JetBrains Mono" font-size="10">PROXIMITY: 1.2M LEFT</text>
          <rect x="175" y="70" width="185" height="85" fill="#101411" stroke="#d2b48c" stroke-width="1" />
          <text x="185" y="90" fill="#d2b48c" font-family="VT323" font-size="14">&gt;&gt; OLLAMA CONTEXTUAL SPEECH</text>
          <text x="185" y="110" fill="#33ff00" font-family="JetBrains Mono" font-size="11">“Caution: static obstacle”</text>
          <text x="185" y="126" fill="#33ff00" font-family="JetBrains Mono" font-size="11">“1.2 meters on your left.”</text>
          <text x="185" y="144" fill="#888" font-family="JetBrains Mono" font-size="9">LATENCY: 42MS // EDGE SYNTH</text>
          <rect x="175" y="165" width="185" height="35" fill="#0d110e" stroke="#33ff00" stroke-width="1" />
          <path d="M185 182 Q 198 168, 212 182 T 240 182 T 268 182 T 296 182 T 324 182" stroke="#33ff00" stroke-width="1.5" fill="none" />
          <text x="270" y="196" fill="#ffb000" font-family="VT323" font-size="12">VOICE FEED ACTIVE</text>
        </svg>
      `;
    } else if (visualType === 'ecommerce') {
      return `
        <svg class="omr-vector-visual" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#151b18" />
          <rect x="25" y="20" width="350" height="200" stroke="#33ff00" stroke-width="1.5" stroke-dasharray="4 2" fill="#1b241e" />
          <text x="40" y="45" fill="#33ff00" font-family="VT323" font-size="16">FSM-COMMERCE://DISTRIBUTED WEBSOCKET PIPELINE</text>
          <rect x="40" y="55" width="320" height="1" fill="#33ff00" opacity="0.3" />
          <rect x="40" y="85" width="65" height="30" rx="3" fill="#1c241e" stroke="#33ff00" stroke-width="1.5" />
          <text x="50" y="104" fill="#33ff00" font-family="JetBrains Mono" font-size="10" font-weight="700">IDLE</text>
          <line x1="105" y1="100" x2="125" y2="100" stroke="#33ff00" stroke-width="1.5" />
          <rect x="125" y="85" width="75" height="30" rx="3" fill="#1c241e" stroke="#ffb000" stroke-width="1.5" />
          <text x="133" y="104" fill="#ffb000" font-family="JetBrains Mono" font-size="10" font-weight="700">RESERVED</text>
          <line x1="200" y1="100" x2="220" y2="100" stroke="#33ff00" stroke-width="1.5" />
          <rect x="220" y="85" width="75" height="30" rx="3" fill="#1c241e" stroke="#ffb000" stroke-width="1.5" />
          <text x="228" y="104" fill="#ffb000" font-family="JetBrains Mono" font-size="10" font-weight="700">CHECKOUT</text>
          <line x1="295" y1="100" x2="315" y2="100" stroke="#33ff00" stroke-width="1.5" />
          <rect x="315" y="85" width="55" height="30" rx="3" fill="#1c241e" stroke="#33ff00" stroke-width="1.5" />
          <text x="323" y="104" fill="#33ff00" font-family="JetBrains Mono" font-size="10" font-weight="700">SETTLED</text>
          <rect x="40" y="130" width="330" height="70" fill="#101411" stroke="#d2b48c" stroke-width="1" />
          <text x="55" y="152" fill="#33ff00" font-family="JetBrains Mono" font-size="13" font-weight="700">BENCHMARK: 18.47 ms AVG RESPONSE LATENCY</text>
          <text x="55" y="170" fill="#ffb000" font-family="JetBrains Mono" font-size="11">&gt;&gt; ZERO RACE CONDITIONS (MUTEX CART LEASE LOCKS)</text>
          <text x="55" y="187" fill="#888" font-family="JetBrains Mono" font-size="10">SYNC: FIREBASE REALTIME DB + WEBSOCKET PIPES</text>
        </svg>
      `;
    }
    return '';
  }

  function applyProjectData(index) {
    currentProjectIndex = index;
    const p = projectsData[index];
    if (!p) return;

    soundFx.cassetteLatch();

    // 1. Update Cassette Tape Graphic
    if (tapeTitleDisplay) tapeTitleDisplay.textContent = p.tapeTitle;
    if (tapeTrackName) tapeTrackName.textContent = p.subHeader;
    if (tapeTrackIndexBadge) tapeTrackIndexBadge.textContent = `TRACK ${p.trackNum} OF 05`;
    if (tapeCounter) tapeCounter.textContent = p.counter;
    if (tapeStatusText) {
      tapeStatusText.textContent = `ENGAGED // TRACK ${p.trackNum} OF 05 // ${p.title.substring(0, 36).toUpperCase()}...`;
    }

    // 2. Update Bank selector (Side A vs Side B)
    if (btnSideA && btnSideB) {
      if (p.side === 'A') {
        btnSideA.classList.add('active');
        btnSideB.classList.remove('active');
      } else {
        btnSideB.classList.add('active');
        btnSideA.classList.remove('active');
      }
    }

    // 3. Update Hardware Track Buttons
    trackButtons.forEach((btn, idx) => {
      const led = btn.querySelector('.track-led');
      if (idx === index) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        if (led) led.classList.add('active');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        if (led) led.classList.remove('active');
      }
    });

    // 4. Update Quick Index Mini Cards
    indexCards.forEach((card, idx) => {
      const statusSpan = card.querySelector('.mini-card-status');
      if (idx === index) {
        card.classList.add('active');
        if (statusSpan) statusSpan.textContent = 'LOADED';
      } else {
        card.classList.remove('active');
        if (statusSpan) statusSpan.textContent = 'READY';
      }
    });

    // 5. Update Project Stage Display Content with subtle flicker
    const stage = document.getElementById('projectStage');
    if (stage) {
      stage.style.opacity = '0.7';
      setTimeout(() => {
        stage.style.opacity = '1';
      }, 150);
    }

    if (stageBadge) {
      stageBadge.className = `bezel-badge ${p.badgeClass}`;
      stageBadge.textContent = p.badge;
    }
    if (stageTrackId) stageTrackId.textContent = p.trackCode;
    if (stageTitle) stageTitle.textContent = p.title;
    if (stageLead) stageLead.textContent = p.lead;
    if (stageHudLeft) stageHudLeft.textContent = p.hudLeft;
    if (stageHudRight) stageHudRight.textContent = p.hudRight;

    // Metrics banner
    if (stageMetricsBanner) {
      stageMetricsBanner.innerHTML = p.metrics.map((m, i) => `
        <div class="metric-block">
          <span class="m-val ${i === 0 ? 'text-green' : i === 1 ? 'text-amber' : 'text-beige'}">${m.val}</span>
          <span class="m-lbl">${m.lbl}</span>
        </div>
        ${i < p.metrics.length - 1 ? '<div class="metric-divider"></div>' : ''}
      `).join('');
    }

    // Highlights list
    if (stageHighlights) {
      stageHighlights.innerHTML = p.highlights.map(h => `<li>${h}</li>`).join('');
    }

    // Tech stack pills
    if (stageTechStack) {
      stageTechStack.innerHTML = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    }

    // Repository link
    if (stageGithubLink) {
      stageGithubLink.href = p.githubUrl;
    }

    // Vector Graphic Visual
    if (stageVectorHolder) {
      stageVectorHolder.innerHTML = getProjectVectorVisual(p.visualType);
    }

    // Spool rotation pulse
    if (cassetteCase) {
      cassetteCase.classList.add('fast-spinning');
      setTimeout(() => {
        if (autoTourActive) {
          cassetteCase.classList.remove('fast-spinning');
          cassetteCase.classList.add('spinning');
        } else {
          cassetteCase.classList.remove('fast-spinning');
        }
      }, 450);
    }
  }

  // Auto-Tour Loop: advances every 8 seconds when playing
  function startAutoTour() {
    autoTourActive = true;
    if (btnPlayTour) btnPlayTour.classList.add('engaged');
    if (btnPauseTour) btnPauseTour.classList.remove('engaged');
    if (cassetteCase) cassetteCase.classList.add('spinning');

    clearInterval(autoTourInterval);
    autoTourInterval = setInterval(() => {
      const nextIndex = (currentProjectIndex + 1) % projectsData.length;
      applyProjectData(nextIndex);
    }, 8500);
  }

  function pauseAutoTour() {
    autoTourActive = false;
    clearInterval(autoTourInterval);
    if (btnPlayTour) btnPlayTour.classList.remove('engaged');
    if (btnPauseTour) btnPauseTour.classList.add('engaged');
    if (cassetteCase) cassetteCase.classList.remove('spinning', 'fast-spinning');
    if (tapeStatusText) {
      tapeStatusText.textContent = `HEAD PAUSED // TRACK ${projectsData[currentProjectIndex].trackNum} OF 05`;
    }
  }

  // Bind controls
  if (btnPrevProject) {
    btnPrevProject.addEventListener('click', () => {
      const prev = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
      applyProjectData(prev);
    });
  }

  if (btnNextProject) {
    btnNextProject.addEventListener('click', () => {
      const next = (currentProjectIndex + 1) % projectsData.length;
      applyProjectData(next);
    });
  }

  if (btnPlayTour) {
    btnPlayTour.addEventListener('click', () => {
      soundFx.click();
      startAutoTour();
    });
  }

  if (btnPauseTour) {
    btnPauseTour.addEventListener('click', () => {
      soundFx.click();
      pauseAutoTour();
    });
  }

  if (btnFlipSide) {
    btnFlipSide.addEventListener('click', () => {
      // Toggle between Side A (0, 1, 2) and Side B (3, 4)
      const next = currentProjectIndex < 3 ? 3 : 0;
      applyProjectData(next);
    });
  }

  // Side Selector Buttons
  if (btnSideA) {
    btnSideA.addEventListener('click', () => {
      applyProjectData(0); // Jump to first track on Side A
    });
  }

  if (btnSideB) {
    btnSideB.addEventListener('click', () => {
      applyProjectData(3); // Jump to first track on Side B
    });
  }

  // Hardware Track Selector Buttons
  trackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-track-index'), 10);
      if (!isNaN(idx)) applyProjectData(idx);
    });
  });

  // Bottom Quick Index Mini Cards
  indexCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-track-index'), 10);
      if (!isNaN(idx)) applyProjectData(idx);
    });
  });

  // Initialize with Project 0 (Smart Parking)
  applyProjectData(0);
  startAutoTour();

  // =========================================================================
  // 4. HERO TYPEWRITER EFFECT
  // =========================================================================
  const typewriterElem = document.getElementById('heroTypewriter');
  if (typewriterElem) {
    const phrases = [
      "Computer Science Engineering student experienced in AI and machine learning applications.",
      "Engineering real-time Computer Vision pipelines using custom YOLOv12 and YOLOv8 models.",
      "Published researcher at IEEE ICDICI 2025 on intelligent infrastructure & dynamic pricing.",
      "Building scalable full-stack architectures with Python, Flask, React, and WebSockets.",
      "B.Tech CSE Honours Scholar in Quantum Computing at SRM IST (CGPA: 9.68 / 10.0)."
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 35;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        typewriterElem.textContent = currentPhrase.substring(0, charIndex);
        if (charIndex % 3 === 0) soundFx.keyClick();

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(typeLoop, 2800);
          return;
        }
      } else {
        charIndex--;
        typewriterElem.textContent = currentPhrase.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, 400);
          return;
        }
      }

      const speed = isDeleting ? 18 : typingSpeed;
      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  // =========================================================================
  // 5. ANALOG VU METER REALTIME JITTER
  // =========================================================================
  const vuVal1 = document.getElementById('vuVal1');
  const vuVal2 = document.getElementById('vuVal2');
  const vuVal3 = document.getElementById('vuVal3');

  setInterval(() => {
    // Subtle jitter to simulate live analog instruments
    if (vuVal1) {
      const v = (97.8 + Math.random() * 1.4).toFixed(1);
      vuVal1.textContent = `${v}%`;
    }
    if (vuVal2) {
      const v = (18.1 + Math.random() * 0.7).toFixed(2);
      vuVal2.textContent = `${v} ms`;
    }
    if (vuVal3) {
      const v = (99.08 + Math.random() * 0.1).toFixed(2);
      vuVal3.textContent = `${v}%`;
    }
  }, 2200);

  // =========================================================================
  // 6. RETRO COMMAND-LINE INTERFACE (CLI TERMINAL)
  // =========================================================================
  const terminalForm = document.getElementById('terminalForm');
  const cliInput = document.getElementById('cliInput');
  const terminalLog = document.getElementById('terminalLog');
  const terminalScreen = document.getElementById('terminalScreen');

  const cliCommands = {
    help: () => [
      "AVAILABLE COMMANDS:",
      "  about        - View operator profile & quantum honours summary",
      "  projects     - List flagship AI & systems engineering projects",
      "  skills       - Print the core memory matrix (AI/CV, Backend, DB)",
      "  deployments  - Experience timeline (IEEE, Infosys, Srishti, Sevabharathi)",
      "  certs        - Verified certifications (STEM Stars, OCI GenAI, Snowflake)",
      "  contact      - Telecommunications coordinates (Email, Phone, GitHub)",
      "  tape [flip]  - Control magnetic cassette deck (play, pause, flip)",
      "  crt          - Toggle CRT scanline & phosphor display overlay",
      "  audio        - Toggle tactile audio synthesizer engine",
      "  clear        - Clear the terminal screen buffer"
    ],

    about: () => [
      "OPERATOR IDENTITY: Shreya Ravi Kottayakkaran",
      "ROLE: AI Researcher & Systems Engineer (B.Tech CSE Honours in Quantum Computing)",
      "INSTITUTION: SRM Institute of Science and Technology (CGPA: 9.68 / 10.0)",
      "SPECIALTY: Edge Computer Vision (YOLOv12/v8), Applied Deep Learning, Real-Time Systems",
      "HONORS: Infosys STEM Stars Scholar, IEEE ICDICI 2025 First Author, Code4EdTech Winner"
    ],

    projects: () => [
      "FEATURED PROJECTS (MAGNETIC TAPE TRACKS):",
      "  [01] Smart Parking Platform & Dynamic Pricing [IEEE ICDICI 2025 First Author]",
      "       YOLOv12 automated license plate recognition & XGBoost occupancy surge tariffs.",
      "  [02] Automated OMR Evaluation System [Code4EdTech 1st Place Winner - ₹1,00,000]",
      "       YOLOv12 edge bubble detector with Streamlit frontend & tamper-proof grading.",
      "  [03] Crop Disease Classification & Severity [99.13% Validation Accuracy]",
      "       Sequential CNN pathogen classifier + EfficientNet-B3 regression (RMSE 1.47).",
      "  [04] Assistive Mobility Companion [Infosys Springboard 6.0 Virtual Lab]",
      "       YOLOv8 obstacle avoidance, Ollama LLM spatial narrative, multilingual audio.",
      "  [05] Dynamic Real-Time E-Commerce Engine [18.47 ms Average Latency]",
      "       Finite State Machine (FSM) zero-race checkout, React, WebSockets, Firebase."
    ],

    skills: () => [
      "MEMORY MATRIX TELEMETRY:",
      "  AI & Vision:     Python, YOLOv12, YOLOv8, TensorFlow, CNNs, EfficientNet, XGBoost",
      "  Backend & DB:    Flask, Django, REST APIs, WebSockets, C, C++, PostgreSQL, SQLite",
      "  Frontend & Tool: JavaScript, React, HTML5, CSS3 Grid, Git, Firebase Realtime DB",
      "  Foundations:     Quantum Computing Honours, State Machine Lifecycle, Edge Systems"
    ],

    deployments: () => [
      "PROFESSIONAL EXPERIENCE / DEPLOYMENTS:",
      "  1. Infosys Springboard 6.0 (Aug - Oct 2025) - AI Systems Engineering Intern",
      "     Real-time assistive mobility tools, YOLOv8, Ollama LLM, Django, PostgreSQL",
      "  2. Sevabharathi Taliparamba (Jun - Jul 2025) - Volunteer & Web Systems Developer",
      "     Palliative patient community healthcare outreach coordination portal",
      "  3. Srishti Innovative, Technopark (Dec 2024) - AI Systems Research Intern",
      "     Core ML pipelines, model tuning workflows, predictive algorithms"
    ],

    certs: () => [
      "VERIFIED ACCREDITATIONS:",
      "  * Infosys STEM Stars Scholar (Prestigious Merit Scholarship)",
      "  * Oracle Cloud Infrastructure - Certified Generative AI Professional",
      "  * Snowflake - SnowPro Associate (Platform Certification)",
      "  * Book Chapter Author - 'The Interconnectedness of Nature and Academia' (The Dawn)",
      "  * AWS Academy Cloud Architecting",
      "  * SAP University Alliances – SAP S/4HANA ERP (GBI 3.30)",
      "  * NPTEL: Introduction to Database Systems"
    ],

    contact: () => [
      "TELECOMMUNICATION DISPATCH:",
      "  Email:      shreyabah05@gmail.com",
      "  Telephone:  +91 8891607494",
      "  GitHub:     https://github.com/ShreyaRaviK",
      "  Locations:  Kannur, Kerala // Tiruchirappalli, Tamil Nadu"
    ],

    crt: () => {
      const active = document.body.classList.toggle('scanlines-active');
      if (crtToggleState) crtToggleState.classList.toggle('active', active);
      if (crtLabel) crtLabel.textContent = active ? 'ON' : 'OFF';
      return [`CRT Scanline Raster Overlay is now: ${active ? 'ENGAGED' : 'BYPASSED'}`];
    },

    audio: () => {
      initAudioContext();
      sfxEnabled = !sfxEnabled;
      if (audioToggleState) audioToggleState.classList.toggle('active', sfxEnabled);
      if (audioLabel) audioLabel.textContent = sfxEnabled ? 'ON' : 'OFF';
      if (sfxEnabled) soundFx.cassetteLatch();
      return [`Mechanical Audio Synthesizer: ${sfxEnabled ? 'ACTIVE (Beeps & Clicks Enabled)' : 'MUTED'}`];
    },

    tape: (arg) => {
      if (arg === 'flip') {
        const next = currentProjectIndex < 3 ? 3 : 0;
        applyProjectData(next);
        return [`Flipped cassette to ${projectsData[next].side === 'A' ? 'SIDE A (TRK 1-3)' : 'SIDE B (TRK 4-5)'}`];
      } else if (arg === 'pause') {
        pauseAutoTour();
        return ["Tape deck auto-tour paused."];
      } else if (arg === 'play') {
        startAutoTour();
        return ["Tape deck auto-tour engaged."];
      } else if (arg && !isNaN(parseInt(arg, 10))) {
        const num = parseInt(arg, 10);
        if (num >= 1 && num <= projectsData.length) {
          applyProjectData(num - 1);
          return [`Loaded Track ${num}: ${projectsData[num - 1].title}`];
        }
      }
      return [`Tape drive running TRACK ${projectsData[currentProjectIndex].trackNum} OF 05. Use 'tape 1-5', 'tape flip', 'tape pause', 'tape play'.`];
    },

    clear: () => {
      if (terminalLog) terminalLog.innerHTML = '';
      return [];
    }
  };

  function executeCliCommand(cmdString) {
    soundFx.keyClick();
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    // Append user input
    const userLine = document.createElement('div');
    userLine.className = 'cli-line user-cmd';
    userLine.textContent = `shreya@quantum-deck:~$ ${trimmed}`;
    terminalLog.appendChild(userLine);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : null;

    if (mainCmd === 'clear') {
      cliCommands.clear();
      return;
    }

    let outputLines = [];
    if (cliCommands[mainCmd]) {
      outputLines = cliCommands[mainCmd](arg);
    } else {
      outputLines = [
        `Command not recognized: '${mainCmd}'.`,
        `Type 'help' to review available terminal directives.`
      ];
    }

    outputLines.forEach(line => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'cli-line cli-result';
      lineDiv.textContent = line;
      terminalLog.appendChild(lineDiv);
    });

    if (terminalScreen) {
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }
  }

  if (terminalForm) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!cliInput) return;
      const cmd = cliInput.value;
      cliInput.value = '';
      executeCliCommand(cmd);
    });
  }

  // Quick Macro Buttons
  document.querySelectorAll('.macro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        if (cliInput) cliInput.value = '';
        executeCliCommand(cmd);
      }
    });
  });

  // =========================================================================
  // 7. CONTACT TELEX TRANSMITTER SIMULATOR
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const transmissionStatus = document.getElementById('transmissionStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudioContext();
      soundFx.telexBeep();

      const name = document.getElementById('senderName')?.value || 'Operator';
      const email = document.getElementById('senderEmail')?.value || '';
      const subject = document.getElementById('senderSubject')?.value || 'Contact';
      const message = document.getElementById('senderMessage')?.value || '';

      if (transmissionStatus) {
        transmissionStatus.className = 'transmission-status-msg';
        transmissionStatus.textContent = 'TRANSMITTING ENCRYPTED PACKET... [CONNECTING TEL-STATION]';

        setTimeout(() => {
          transmissionStatus.className = 'transmission-status-msg success';
          transmissionStatus.textContent = `SUCCESS: DISPATCH ROUTED TO SHREYA RAVI KOTTAYAKKARAN. [ACK 200]`;
          soundFx.cassetteLatch();

          // Prepare standard mailto trigger fallback
          const mailtoUri = `mailto:shreyabah05@gmail.com?subject=${encodeURIComponent('[Portfolio Dispatch] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
          
          const confirmMail = confirm("Transmission ready. Launch default mail client to dispatch direct email payload?");
          if (confirmMail) {
            window.location.href = mailtoUri;
          }
          contactForm.reset();
        }, 900);
      }
    });
  }

  // =========================================================================
  // 8. NAVIGATION SCROLL SPY
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
      const top = section.offsetTop - 180;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
});
