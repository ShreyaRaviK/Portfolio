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
  // 3. CASSETTE DECK INTERACTIVE ENGINE
  // =========================================================================
  const cassetteCase = document.getElementById('cassetteCase');
  const tapeStatusText = document.getElementById('tapeStatusText');
  const tapeTitleDisplay = document.getElementById('tapeTitleDisplay');
  const tapeTrackName = document.getElementById('tapeTrackName');
  const trackBadge = document.getElementById('trackBadge');
  const trackHeader = document.getElementById('trackHeader');
  const trackDescription = document.getElementById('trackDescription');
  const btnSideA = document.getElementById('btnSideA');
  const btnSideB = document.getElementById('btnSideB');

  const btnPlay = document.getElementById('btnPlay');
  const btnPause = document.getElementById('btnPause');
  const btnFastFwd = document.getElementById('btnFastFwd');
  const btnRewind = document.getElementById('btnRewind');
  const btnEject = document.getElementById('btnEject');

  let currentSide = 'A';
  let tapeState = 'PLAYING'; // PLAYING, PAUSED, FAST_FWD, REWIND

  const sideAData = {
    title: 'SIDE A: SMART PARKING & MOBILITY RESEARCH',
    badge: 'CURRENT DISPATCH: SIDE A',
    trackName: 'IEEE ICDICI 2025 // FIRST AUTHOR PAPER',
    header: 'DUAL AI & IoT SMART PARKING + ASSISTIVE MOBILITY PIPELINES',
    desc: 'First author research presented at IEEE ICDICI 2025 integrating YOLOv12 automated license plate recognition with XGBoost dynamic slot pricing. Companion project: 8-week Infosys internship building assistive mobility systems for the visually impaired using YOLOv8, Ollama LLM contextual narrative, and multilingual audio feedback.'
  };

  const sideBData = {
    title: 'SIDE B: OMR YOLOv12 HACKATHON & REALTIME FSM SYSTEMS',
    badge: 'CURRENT DISPATCH: SIDE B',
    trackName: 'INNOMATICS LABS // ₹1,00,000 BOUNTY WINNER',
    header: 'AUTOMATED OMR EVALUATION & REAL-TIME WEBSOCKET COMMERCE ENGINE',
    desc: 'Champion project winning 1st place and ₹1,00,000 at Code4EdTech Challenge Hackathon deploying custom YOLOv12 for millisecond optical mark recognition. Paired with a real-time e-commerce engine leveraging React, Flask, Firebase Realtime DB, and FSM architecture delivering 18.47ms average latency.'
  };

  function applySideData(side) {
    currentSide = side;
    const data = side === 'A' ? sideAData : sideBData;
    if (tapeTitleDisplay) tapeTitleDisplay.textContent = data.title;
    if (tapeTrackName) tapeTrackName.textContent = data.trackName;
    if (trackBadge) trackBadge.textContent = data.badge;
    if (trackHeader) trackHeader.textContent = data.header;
    if (trackDescription) trackDescription.textContent = data.desc;

    if (btnSideA && btnSideB) {
      if (side === 'A') {
        btnSideA.classList.add('active');
        btnSideB.classList.remove('active');
      } else {
        btnSideB.classList.add('active');
        btnSideA.classList.remove('active');
      }
    }
  }

  function setTapeMode(mode) {
    tapeState = mode;
    soundFx.cassetteLatch();

    // Clear animations
    if (cassetteCase) {
      cassetteCase.classList.remove('spinning', 'fast-spinning', 'rewind-spinning');
    }
    clearInterval(counterTimer);

    // Clear engaged state on buttons
    [btnPlay, btnPause, btnFastFwd, btnRewind].forEach(b => {
      if (b) b.classList.remove('engaged');
    });

    if (mode === 'PLAYING') {
      if (cassetteCase) cassetteCase.classList.add('spinning');
      if (btnPlay) btnPlay.classList.add('engaged');
      if (tapeStatusText) tapeStatusText.textContent = `HEAD ENGAGED // PLAYING SIDE ${currentSide}`;
      counterTimer = setInterval(() => updateTapeCounter(1), 1200);
    } else if (mode === 'PAUSED') {
      if (btnPause) btnPause.classList.add('engaged');
      if (tapeStatusText) tapeStatusText.textContent = `HEAD DISENGAGED // PAUSED AT [${String(tapeCounterVal).padStart(4, '0')}]`;
    } else if (mode === 'FAST_FWD') {
      if (cassetteCase) cassetteCase.classList.add('fast-spinning');
      if (btnFastFwd) btnFastFwd.classList.add('engaged');
      if (tapeStatusText) tapeStatusText.textContent = `FAST FORWARDING // 4X TAPE DRIVE`;
      counterTimer = setInterval(() => updateTapeCounter(5), 250);
    } else if (mode === 'REWIND') {
      if (cassetteCase) cassetteCase.classList.add('rewind-spinning');
      if (btnRewind) btnRewind.classList.add('engaged');
      if (tapeStatusText) tapeStatusText.textContent = `REWINDING TAPE SPINDLE`;
      counterTimer = setInterval(() => {
        tapeCounterVal = tapeCounterVal > 5 ? tapeCounterVal - 5 : 0;
        if (tapeCounter) tapeCounter.textContent = String(tapeCounterVal).padStart(4, '0');
      }, 250);
    }
  }

  // Default start in playing mode
  setTapeMode('PLAYING');

  if (btnPlay) btnPlay.addEventListener('click', () => setTapeMode('PLAYING'));
  if (btnPause) btnPause.addEventListener('click', () => setTapeMode('PAUSED'));
  if (btnFastFwd) btnFastFwd.addEventListener('click', () => setTapeMode('FAST_FWD'));
  if (btnRewind) btnRewind.addEventListener('click', () => setTapeMode('REWIND'));

  // Side Selector Buttons
  if (btnSideA) btnSideA.addEventListener('click', () => {
    applySideData('A');
    setTapeMode('PLAYING');
  });

  if (btnSideB) btnSideB.addEventListener('click', () => {
    applySideData('B');
    setTapeMode('PLAYING');
  });

  if (btnEject) btnEject.addEventListener('click', () => {
    const nextSide = currentSide === 'A' ? 'B' : 'A';
    applySideData(nextSide);
    setTapeMode('PLAYING');
  });

  // =========================================================================
  // 4. HERO TYPEWRITER EFFECT
  // =========================================================================
  const typewriterElem = document.getElementById('heroTypewriter');
  if (typewriterElem) {
    const phrases = [
      "Computer Science Engineering researcher engineering real-world AI, Computer Vision pipelines, and intelligent infrastructure platforms.",
      "First Author IEEE (ICDICI 2025) on Smart Parking, License Plate Recognition & Dynamic Pricing.",
      "Winner of ₹1,00,000 1st Prize at Code4EdTech Challenge Hackathon with custom YOLOv12.",
      "Honours Scholar in Quantum Computing at SRM Institute of Science and Technology (CGPA 9.68).",
      "Full-stack & distributed systems engineer: Python, Flask, React, WebSockets, Firebase, C++."
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
      "AWARDS: ₹1,00,000 Hackathon Champion, Infosys STEM Stars Scholar, IEEE First Author"
    ],

    projects: () => [
      "FLAGSHIP REPOSITORY PROJECTS:",
      "1. Automated OMR Evaluation System [YOLOv12, Streamlit, Flask]",
      "   -> Won 1st Place & ₹1,00,000 bounty at Code4EdTech Challenge (Innomatics Labs).",
      "2. Crop Disease Classification & Severity Stratification [CNN, EfficientNet-B3, TF]",
      "   -> 99.13% validation accuracy, 1.47 RMSE severity prediction.",
      "3. Dynamic E-Commerce Real-Time Platform [React, Flask, Firebase, WebSockets]",
      "   -> FSM product lifecycle engine with 18.47 ms average response latency."
    ],

    skills: () => [
      "MEMORY MATRIX TELEMETRY:",
      "  AI & Vision:     Python, YOLOv12, YOLOv8, TensorFlow, CNNs, EfficientNet, XGBoost",
      "  Backend & DB:    Flask, Django, REST APIs, WebSockets, C, C++, PostgreSQL, SQLite",
      "  Frontend & Tool: JavaScript, React, HTML5, CSS3 Grid, Git, Firebase Realtime DB",
      "  Foundations:     Quantum Computing Honours, State Machine Lifecycle, Edge Systems"
    ],

    deployments: () => [
      "OPERATIONAL MISSIONS / EXPERIENCE:",
      "  1. IEEE (ICDICI 2025) [July 2025] - First Author Researcher",
      "     Smart Parking with YOLOv12 LPR & XGBoost Dynamic Pricing",
      "  2. Infosys Springboard 6.0 [Aug - Oct 2025] - Virtual AI Intern",
      "     Assistive Mobility Tool: YOLOv8, Ollama LLM contextual text, Multilingual voice",
      "  3. Srishti Innovative, Technopark [Dec 2024] - AI Systems Intern",
      "  4. Sevabharathi Taliparamba [June - July 2025] - Civic Outreach Web Portal"
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
        const next = currentSide === 'A' ? 'B' : 'A';
        applySideData(next);
        setTapeMode('PLAYING');
        return [`Flipped cassette to SIDE ${next}`];
      } else if (arg === 'pause') {
        setTapeMode('PAUSED');
        return ["Tape drive paused."];
      } else {
        setTapeMode('PLAYING');
        return [`Tape drive running SIDE ${currentSide}. Use 'tape flip' to switch.`];
      }
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
