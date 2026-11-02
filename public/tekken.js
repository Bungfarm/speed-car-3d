/* ============================================================================
 * IRON FIST 8: CYBER TEKKEN 3D (WebGL + Three.js Next-Gen Fighting Engine)
 * Features:
 *  - 6 Iconic Tekken Archetypes with Articulated 3D Skeletons & Glowing Auras
 *  - 3 Interactive 3D Stages (Volcanic Devil Dojo, Neo-Tokyo Rooftop, Golden Temple)
 *  - Authentic 4-Limb Tekken Combat: Jabs, Heavy Punches, Electric Uppercut Launchers,
 *    Air Juggle Physics, Low Sweeps, Tornado Kicks, Grapple Throws, Wall Splat,
 *    Heat Engager, and Cinematic Camera-Zoom RAGE ART!
 *  - Modes: VS Smart AI CPU, 2-Player Local Keyboard, and Radmin VPN Online Multiplayer
 * ============================================================================ */

(() => {
  // ==========================================================================
  // 1. FIGHTER ROSTER & STAGE DEFINITIONS
  // ==========================================================================
  const FIGHTER_ROSTER = [
    {
      id: 'jin',
      name: 'JIN KAZAMA',
      style: 'DEVIL KARATE',
      icon: '⚡',
      stats: '⚡ สมดุล • สายฟ้าสีแดง-ดำ',
      skinColor: 0xf1c27d,
      hairColor: 0x0f172a,
      hairStyle: 'spiky',
      topType: 'open_chest',
      pantsColor: 0x111827,
      flameColor: 0xdc2626,
      gloveColor: 0xdc2626,
      auraColor: '#ef4444',
      sparkHex: 0xef4444,
      secondarySpark: 0x38bdf8,
      speedMult: 1.04,
      powerMult: 1.05,
      specialName: '⚡ ELECTRIC WIND GOD FIST',
      rageArtName: '😈 DEVIL GENE OBLITERATION'
    },
    {
      id: 'kazuya',
      name: 'KAZUYA MISHIMA',
      style: 'MISHIMA THUNDER',
      icon: '😈',
      stats: '💥 หมัดหนักรุนแรง • สายฟ้าสีม่วง',
      skinColor: 0xe0ac69,
      hairColor: 0x1e1b4b,
      hairStyle: 'swept_back',
      topType: 'sleeveless_gi',
      giColor: 0xf8fafc,
      pantsColor: 0xf8fafc,
      flameColor: 0x9333ea,
      gloveColor: 0x7e22ce,
      auraColor: '#a855f7',
      sparkHex: 0xa855f7,
      secondarySpark: 0xfacc15,
      speedMult: 0.98,
      powerMult: 1.14,
      specialName: '🌩️ HELLSWEEP THUNDER GOD FIST',
      rageArtName: '👁️ DEMONIC LASER ANNIHILATION'
    },
    {
      id: 'yoshimitsu',
      name: 'YOSHIMITSU',
      style: 'MANJI CYBER NINJA',
      icon: '🗡️',
      stats: '⚔️ ดาบคาตานะพลาสม่า • ความเร็วสูง',
      skinColor: 0x1e293b,
      hairColor: 0x10b981,
      hairStyle: 'cyber_oni',
      topType: 'cyber_armor',
      giColor: 0x064e3b,
      pantsColor: 0x0f172a,
      flameColor: 0x10b981,
      gloveColor: 0x34d399,
      hasKatana: true,
      auraColor: '#10b981',
      sparkHex: 0x10b981,
      secondarySpark: 0x6ee7b7,
      speedMult: 1.12,
      powerMult: 1.0,
      specialName: '🗡️ MANJI DRAGONFLY SLASH',
      rageArtName: '🌀 SPACE NINJA DIMENSION CUT'
    },
    {
      id: 'king',
      name: 'KING JAGUAR',
      style: 'PRO WRESTLING',
      icon: '🐯',
      stats: '💪 ท่าทุ่มทรงพลัง • เกราะหนัก',
      skinColor: 0xd99b66,
      hairColor: 0xfacc15,
      hairStyle: 'jaguar_mask',
      topType: 'wrestler',
      giColor: 0xeab308,
      pantsColor: 0x1d4ed8,
      flameColor: 0xfacc15,
      gloveColor: 0xf59e0b,
      auraColor: '#eab308',
      sparkHex: 0xfacc15,
      secondarySpark: 0xf97316,
      speedMult: 0.94,
      powerMult: 1.18,
      specialName: '🐯 JAGUAR ROLLING DRIVER',
      rageArtName: '👑 MUSCLE BUSTER SUPLEX SUPREME'
    },
    {
      id: 'reina',
      name: 'REINA MISHIMA',
      style: 'TAIDO LIGHTNING',
      icon: '🔮',
      stats: '⚡ ว่องไวสูงสุด • สายฟ้าม่วงคราม',
      skinColor: 0xf7d7b5,
      hairColor: 0x3b0764,
      hairStyle: 'twin_cyber',
      topType: 'jacket_crop',
      giColor: 0x6b21a8,
      pantsColor: 0x0f172a,
      flameColor: 0xc084fc,
      gloveColor: 0xe879f9,
      auraColor: '#c084fc',
      sparkHex: 0xd946ef,
      secondarySpark: 0x38bdf8,
      speedMult: 1.15,
      powerMult: 0.96,
      specialName: '⚡ RAIJIN TAIDO SPIN KICK',
      rageArtName: '🔮 EMPRESS OF LIGHTNING BARRAGE'
    },
    {
      id: 'bryan',
      name: 'BRYAN FURY',
      style: 'CYBORG KICKBOXING',
      icon: '🦾',
      stats: '🔥 เตะหนักทำลายล้าง • แขนกลไซบอร์ก',
      skinColor: 0xd6b598,
      hairColor: 0xe2e8f0,
      hairStyle: 'mohawk_silver',
      topType: 'cyborg_vest',
      giColor: 0x334155,
      pantsColor: 0x3f6212,
      flameColor: 0xf97316,
      gloveColor: 0x94a3b8,
      auraColor: '#f97316',
      sparkHex: 0xf97316,
      secondarySpark: 0xef4444,
      speedMult: 1.0,
      powerMult: 1.15,
      specialName: '🦾 MACH BREAKER & JET UPPER',
      rageArtName: '💣 GATLING VULCAN ANNIHILATOR'
    }
  ];

  const STAGES = [
    {
      id: 'volcano',
      name: 'VOLCANIC DEVIL DOJO',
      desc: 'สังเวียนหินลาวาภูเขาไฟ ตระกูลมิชิมะ พร้อมเสาโทริอิไฟและสะเก็ดลาวาปะทุ',
      skyTop: 0x1a0505,
      skyBot: 0x450a0a,
      fogColor: 0x2a0808,
      floorColor: 0x1c1917,
      gridColor: 0xdc2626,
      ambientColor: 0xff6b6b,
      keyLightColor: 0xffedd5,
      rimLightColor: 0xef4444
    },
    {
      id: 'neotokyo',
      name: 'NEO-TOKYO HELIPAD ROOFTOP',
      desc: 'ลานจอดเฮลิคอปเตอร์ตึกระฟ้าไซเบอร์พังก์ ท่ามกลางป้ายโฮโลแกรมและสปอตไลท์',
      skyTop: 0x020617,
      skyBot: 0x0f172a,
      fogColor: 0x091326,
      floorColor: 0x0f172a,
      gridColor: 0x06b6d4,
      ambientColor: 0x38bdf8,
      keyLightColor: 0xe0f2fe,
      rimLightColor: 0xd946ef
    },
    {
      id: 'sanctum',
      name: 'GOLDEN MISHIMA SANCTUM',
      desc: 'วิหารทองคำศักดิ์สิทธิ์ เสาหินอ่อนสะท้อนเงาและโคมไฟทองคำโบราณ',
      skyTop: 0x1c1406,
      skyBot: 0x3f2e0e,
      fogColor: 0x291d08,
      floorColor: 0x272015,
      gridColor: 0xeab308,
      ambientColor: 0xfde047,
      keyLightColor: 0xfef9c3,
      rimLightColor: 0xf59e0b
    }
  ];

  // ==========================================================================
  // 2. MOVE DEFINITIONS (4-LIMB TEKKEN FRAME DATA & HITBOXES)
  // ==========================================================================
  const MOVES = {
    jab: {
      name: 'LEFT JAB COMBO',
      startup: 0.08,
      active: 0.12,
      recovery: 0.16,
      damage: 8,
      hitStun: 0.28,
      blockStun: 0.14,
      pushback: 0.9,
      range: 2.35,
      height: 'high',
      launchY: 0,
      limb: 'leftArm'
    },
    heavyPunch: {
      name: 'STRAIGHT DEMON FIST',
      startup: 0.14,
      active: 0.15,
      recovery: 0.25,
      damage: 16,
      hitStun: 0.42,
      blockStun: 0.22,
      pushback: 2.1,
      range: 2.65,
      height: 'mid',
      launchY: 0,
      limb: 'rightArm',
      heavySpark: true
    },
    uppercut: {
      name: 'ELECTRIC WIND GOD FIST',
      startup: 0.15,
      active: 0.16,
      recovery: 0.34,
      damage: 21,
      hitStun: 0.65,
      blockStun: 0.25,
      pushback: 1.5,
      range: 2.6,
      height: 'mid',
      launchY: 13.5, // Launches opponent into the air for Tekken Juggles!
      limb: 'rightArm',
      heavySpark: true,
      electric: true
    },
    quickKick: {
      name: 'HIGH ROUNDHOUSE KICK',
      startup: 0.11,
      active: 0.14,
      recovery: 0.20,
      damage: 12,
      hitStun: 0.35,
      blockStun: 0.18,
      pushback: 1.4,
      range: 2.75,
      height: 'mid',
      launchY: 0,
      limb: 'leftLeg'
    },
    lowSweep: {
      name: 'HELLSWEEP LOW KICK',
      startup: 0.16,
      active: 0.16,
      recovery: 0.32,
      damage: 15,
      hitStun: 0.55,
      blockStun: 0.30,
      pushback: 1.2,
      range: 2.7,
      height: 'low', // Hits standing blockers! trips opponent
      launchY: 6.5,
      knockdown: true,
      limb: 'leftLeg',
      electric: true
    },
    tornadoKick: {
      name: 'CYCLONE HEAT SMASH KICK',
      startup: 0.18,
      active: 0.22,
      recovery: 0.34,
      damage: 24,
      hitStun: 0.55,
      blockStun: 0.25,
      pushback: 3.6, // Huge wall splat potential!
      range: 2.95,
      height: 'mid',
      launchY: 8.5,
      knockdown: true,
      limb: 'rightLeg',
      heavySpark: true,
      electric: true
    },
    throwMove: {
      name: 'IRON FIST BONE BREAKER THROW',
      startup: 0.12,
      active: 0.14,
      recovery: 0.35,
      damage: 28,
      hitStun: 0.85,
      blockStun: 0,
      pushback: 3.2,
      range: 2.15,
      height: 'unblockable_throw',
      launchY: 9.0,
      knockdown: true,
      limb: 'bothArms',
      heavySpark: true
    },
    rageArt: {
      name: 'RAGE ART: ULTIMATE OBLITERATION',
      startup: 0.20,
      active: 0.38,
      recovery: 0.50,
      damage: 42,
      hitStun: 1.1,
      blockStun: 0.4,
      pushback: 4.8,
      range: 3.8,
      height: 'mid',
      launchY: 15.0,
      knockdown: true,
      limb: 'rageArt',
      heavySpark: true,
      electric: true,
      cinematic: true
    }
  };

  // ==========================================================================
  // 3. SYNTHESIZED TEKKEN ARCADE SOUND ENGINE (WEB AUDIO API)
  // ==========================================================================
  class TekkenAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playWhoosh(pitch = 220) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }

    playHit(heavy = false, electric = false) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Low punch bass thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = heavy ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(heavy ? 150 : 190, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + (heavy ? 0.26 : 0.14));
      gain.gain.setValueAtTime(heavy ? 0.45 : 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (heavy ? 0.27 : 0.15));
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);

      // Electric crackle ("DORYA!" spark sound)
      if (electric) {
        const eOsc = this.ctx.createOscillator();
        const eGain = this.ctx.createGain();
        eOsc.type = 'square';
        eOsc.frequency.setValueAtTime(920, now);
        eOsc.frequency.setValueAtTime(440, now + 0.04);
        eOsc.frequency.setValueAtTime(1280, now + 0.08);
        eOsc.frequency.exponentialRampToValueAtTime(180, now + 0.24);
        eGain.gain.setValueAtTime(0.22, now);
        eGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        eOsc.connect(eGain);
        eGain.connect(this.ctx.destination);
        eOsc.start(now);
        eOsc.stop(now + 0.26);
      }
    }

    playBlock() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.09);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    }

    playRageTrigger() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [220, 330, 440, 660].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.05 + 0.35);
        gain.gain.setValueAtTime(0.15, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.36);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.37);
      });
    }

    playKO() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(22, now + 0.85);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.88);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    }
  }

  const sfx = new TekkenAudio();

  // ==========================================================================
  // 4. 3D WEBGL SCENE, CAMERA & STAGE BUILDER
  // ==========================================================================
  const arenaContainer = document.getElementById('arenaContainer');
  const vfxCanvas = document.getElementById('vfxCanvas');
  const vfxCtx = vfxCanvas.getContext('2d');

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x2a0808, 0.022);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 250);
  camera.position.set(0, 3.8, 12.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  arenaContainer.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xff6b6b, 0.75);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
  keyLight.position.set(8, 18, 12);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 50;
  const d = 16;
  keyLight.shadow.camera.left = -d;
  keyLight.shadow.camera.right = d;
  keyLight.shadow.camera.top = d;
  keyLight.shadow.camera.bottom = -d;
  scene.add(keyLight);

  const rimLightLeft = new THREE.PointLight(0x38bdf8, 4.5, 28);
  rimLightLeft.position.set(-10, 5, -3);
  scene.add(rimLightLeft);

  const rimLightRight = new THREE.PointLight(0xef4444, 4.5, 28);
  rimLightRight.position.set(10, 5, -3);
  scene.add(rimLightRight);

  const stageGroup = new THREE.Group();
  scene.add(stageGroup);

  let currentStageIdx = 0;
  let stageFloatingProps = [];
  const ARENA_WALL_X = 11.2;

  function buildStage(stageIdx) {
    currentStageIdx = stageIdx;
    const st = STAGES[stageIdx] || STAGES[0];
    document.getElementById('hudStageName').textContent = st.name;

    while (stageGroup.children.length > 0) {
      stageGroup.remove(stageGroup.children[0]);
    }
    stageFloatingProps = [];

    scene.fog.color.setHex(st.fogColor);
    renderer.setClearColor(st.skyTop);
    ambientLight.color.setHex(st.ambientColor);
    keyLight.color.setHex(st.keyLightColor);
    rimLightRight.color.setHex(st.rimLightColor);

    // Main Octagonal Martial Arts Arena Floor
    const floorGeo = new THREE.CylinderGeometry(16, 17.5, 1.2, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: st.floorColor,
      roughness: 0.28,
      metalness: 0.65
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMeshMatWithGrid(st));
    floorMesh.position.y = -0.6;
    floorMesh.receiveShadow = true;
    stageGroup.add(floorMesh);

    // Glowing Arena Ring Boundary
    const ringGeo = new THREE.RingGeometry(11.2, 11.55, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: st.gridColor,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.02;
    stageGroup.add(ringMesh);

    // Center Tekken Tournament Emblem Ring
    const centerRingGeo = new THREE.RingGeometry(3.2, 3.45, 32);
    const centerRing = new THREE.Mesh(centerRingGeo, ringMat);
    centerRing.rotation.x = -Math.PI / 2;
    centerRing.position.y = 0.02;
    stageGroup.add(centerRing);

    // Arena Side Laser / Energy Wall Posts (at X = -11.5 and +11.5)
    [-ARENA_WALL_X - 0.6, ARENA_WALL_X + 0.6].forEach((wx) => {
      const postGeo = new THREE.BoxGeometry(0.45, 4.2, 8.5);
      const postMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: st.gridColor,
        emissiveIntensity: 0.28,
        roughness: 0.2,
        metalness: 0.8
      });
      const wallMesh = new THREE.Mesh(postGeo, postMat);
      wallMesh.position.set(wx, 2.1, 0);
      stageGroup.add(wallMesh);
    });

    // Stage-Specific Next-Gen Scenery
    if (st.id === 'volcano') {
      // Giant Torii Gate in background + glowing magma pillars
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x7f1d1d,
        emissive: 0xdc2626,
        emissiveIntensity: 0.35,
        roughness: 0.4
      });
      [-5.5, 5.5].forEach((px) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.8, 9.5, 12), pillarMat);
        col.position.set(px, 4.5, -9.5);
        col.castShadow = true;
        stageGroup.add(col);
      });
      const topBeam = new THREE.Mesh(new THREE.BoxGeometry(15.5, 1.1, 1.2), pillarMat);
      topBeam.position.set(0, 8.8, -9.5);
      stageGroup.add(topBeam);
      const subBeam = new THREE.Mesh(new THREE.BoxGeometry(13.0, 0.7, 0.9), pillarMat);
      subBeam.position.set(0, 7.0, -9.5);
      stageGroup.add(subBeam);

      // Lava Sea & Floating Volcanic Rocks
      const lavaSea = new THREE.Mesh(
        new THREE.PlaneGeometry(180, 180),
        new THREE.MeshBasicMaterial({ color: 0x991b1b })
      );
      lavaSea.rotation.x = -Math.PI / 2;
      lavaSea.position.y = -2.2;
      stageGroup.add(lavaSea);

      for (let i = 0; i < 14; i++) {
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.2 + Math.random() * 1.8, 0),
          new THREE.MeshStandardMaterial({
            color: 0x1c1917,
            emissive: 0xea580c,
            emissiveIntensity: 0.4,
            roughness: 0.8
          })
        );
        const angle = (i / 14) * Math.PI * 1.4 - Math.PI * 0.2;
        const rad = 18 + Math.random() * 14;
        rock.position.set(Math.cos(angle) * rad, 1 + Math.random() * 6, -Math.abs(Math.sin(angle) * rad) - 4);
        stageGroup.add(rock);
        stageFloatingProps.push({ mesh: rock, baseY: rock.position.y, speed: 1.2 + Math.random(), phase: i });
      }
    } else if (st.id === 'neotokyo') {
      // Cyberpunk Skyscrapers & Hologram Rings
      for (let i = 0; i < 22; i++) {
        const bw = 3 + Math.random() * 4;
        const bh = 18 + Math.random() * 38;
        const bMat = new THREE.MeshStandardMaterial({
          color: 0x090d16,
          emissive: i % 2 === 0 ? 0x0284c7 : 0xc026d3,
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.9
        });
        const bldg = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bw), bMat);
        const xPos = (i - 11) * 5.2;
        const zPos = -18 - Math.random() * 22;
        bldg.position.set(xPos, bh / 2 - 12, zPos);
        stageGroup.add(bldg);
      }

      // Giant Neon Holo Torus behind stage
      const holo = new THREE.Mesh(
        new THREE.TorusGeometry(6.5, 0.18, 16, 64),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee })
      );
      holo.position.set(0, 6.2, -12);
      stageGroup.add(holo);
      stageFloatingProps.push({ mesh: holo, baseY: 6.2, speed: 1.5, phase: 0, rotateZ: true });
    } else {
      // Golden Mishima Sanctum Pillars & Braziers
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xa16207,
        emissiveIntensity: 0.3,
        roughness: 0.18,
        metalness: 0.92
      });
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 10, 16), goldMat);
        col.position.set(i * 3.8, 5, -10.5);
        col.castShadow = true;
        stageGroup.add(col);
      }
      // Giant Golden Buddha/Mishima Sun Halo
      const halo = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.35, 16, 48), goldMat);
      halo.position.set(0, 5.8, -11);
      stageGroup.add(halo);
      stageFloatingProps.push({ mesh: halo, baseY: 5.8, speed: 1.0, phase: 1 });
    }
  }

  function floorMeshMatWithGrid(st) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#' + st.floorColor.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#' + st.gridColor.toString(16).padStart(6, '0');
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.42;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.25,
      metalness: 0.65
    });
  }

  // ==========================================================================
  // 5. ARTICULATED 3D FIGHTER MODEL BUILDER (HUMANOID RIG + GLOWING GAUNTLETS)
  // ==========================================================================
  function createFighterRig(charDef) {
    const root = new THREE.Group();

    const hips = new THREE.Group();
    hips.position.y = 1.95;
    root.add(hips);

    const skinMat = new THREE.MeshStandardMaterial({
      color: charDef.skinColor,
      roughness: 0.38,
      metalness: 0.1
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: charDef.pantsColor,
      roughness: 0.45,
      metalness: 0.25
    });

    const flameTrimMat = new THREE.MeshStandardMaterial({
      color: charDef.flameColor,
      emissive: charDef.flameColor,
      emissiveIntensity: 0.55,
      roughness: 0.25
    });

    const gloveMat = new THREE.MeshStandardMaterial({
      color: charDef.gloveColor,
      emissive: charDef.gloveColor,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.75
    });

    // Pelvis / Belt
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.36, 0.48), pantsMat);
    pelvis.castShadow = true;
    hips.add(pelvis);

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.14, 0.52), flameTrimMat);
    belt.position.y = 0.14;
    hips.add(belt);

    // Torso Pivot
    const torso = new THREE.Group();
    torso.position.y = 0.2;
    hips.add(torso);

    const chestMat = charDef.topType === 'open_chest' || charDef.topType === 'wrestler'
      ? skinMat
      : new THREE.MeshStandardMaterial({
          color: charDef.giColor || 0x1e293b,
          roughness: 0.35,
          metalness: charDef.topType === 'cyber_armor' ? 0.85 : 0.2
        });

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.96, 1.05, 0.52), chestMat);
    chest.position.y = 0.52;
    chest.castShadow = true;
    torso.add(chest);

    // Muscular Pectorals / Armor Plates
    const pecGeo = new THREE.BoxGeometry(0.42, 0.36, 0.14);
    const leftPec = new THREE.Mesh(pecGeo, chestMat);
    leftPec.position.set(-0.22, 0.72, 0.24);
    const rightPec = new THREE.Mesh(pecGeo, chestMat);
    rightPec.position.set(0.22, 0.72, 0.24);
    torso.add(leftPec, rightPec);

    // Glowing Devil / Cyber Chest Core Emblem
    const coreEmblem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.16, 0),
      flameTrimMat
    );
    coreEmblem.position.set(0, 0.68, 0.28);
    torso.add(coreEmblem);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.28, 0);
    torso.add(headGroup);

    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.56, 0.52), skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Glowing Cyber/Devil Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: charDef.flameColor });
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.05), eyeMat);
    leftEye.position.set(-0.12, 0.06, 0.26);
    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.05), eyeMat);
    rightEye.position.set(0.12, 0.06, 0.26);
    headGroup.add(leftEye, rightEye);

    // Iconic Tekken Hair / Mask Styles
    const hairMat = new THREE.MeshStandardMaterial({
      color: charDef.hairColor,
      roughness: 0.3,
      metalness: 0.4
    });

    if (charDef.hairStyle === 'jaguar_mask') {
      const earGeo = new THREE.ConeGeometry(0.12, 0.24, 6);
      const earL = new THREE.Mesh(earGeo, hairMat);
      earL.position.set(-0.2, 0.36, 0);
      const earR = new THREE.Mesh(earGeo, hairMat);
      earR.position.set(0.2, 0.36, 0);
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.22), hairMat);
      snout.position.set(0, -0.08, 0.28);
      headGroup.add(earL, earR, snout);
    } else {
      for (let i = 0; i < 5; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.48, 5), hairMat);
        spike.position.set((i - 2) * 0.1, 0.36, -0.05 - (i % 2) * 0.08);
        spike.rotation.x = -0.45;
        spike.rotation.z = (i - 2) * -0.25;
        headGroup.add(spike);
      }
    }

    // Helper for Articulated Arms (Shoulder -> UpperArm -> Elbow -> Forearm -> Glowing Fist)
    function createArm(isLeft) {
      const shoulder = new THREE.Group();
      shoulder.position.set(isLeft ? -0.64 : 0.64, 0.92, 0);
      torso.add(shoulder);

      const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.56, 0.28), skinMat);
      upperArm.position.y = -0.24;
      upperArm.castShadow = true;
      shoulder.add(upperArm);

      const elbow = new THREE.Group();
      elbow.position.y = -0.52;
      shoulder.add(elbow);

      const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.52, 0.26), gloveMat);
      forearm.position.y = -0.24;
      forearm.castShadow = true;
      elbow.add(forearm);

      const fist = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), gloveMat);
      fist.position.y = -0.52;
      fist.castShadow = true;
      elbow.add(fist);

      // Optional Yoshimitsu Plasma Katana in Right Hand
      if (!isLeft && charDef.hasKatana) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 1.85, 0.12),
          new THREE.MeshBasicMaterial({ color: 0x34d399 })
        );
        blade.position.set(0, -1.35, 0.15);
        elbow.add(blade);
      }

      return { shoulder, elbow, fist };
    }

    // Helper for Articulated Legs (HipJoint -> Thigh -> Knee -> Shin -> Boot)
    function createLeg(isLeft) {
      const hipJoint = new THREE.Group();
      hipJoint.position.set(isLeft ? -0.26 : 0.26, -0.1, 0);
      hips.add(hipJoint);

      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.85, 0.36), pantsMat);
      thigh.position.y = -0.42;
      thigh.castShadow = true;
      hipJoint.add(thigh);

      // Flame Pattern Stripe on Pants
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.12), flameTrimMat);
      stripe.position.set(0, -0.5, 0.14);
      hipJoint.add(stripe);

      const knee = new THREE.Group();
      knee.position.y = -0.85;
      hipJoint.add(knee);

      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.85, 0.30), pantsMat);
      shin.position.y = -0.42;
      shin.castShadow = true;
      knee.add(shin);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.24, 0.56), flameTrimMat);
      foot.position.set(0, -0.88, 0.12);
      foot.castShadow = true;
      knee.add(foot);

      return { hipJoint, knee, foot };
    }

    const leftArm = createArm(true);
    const rightArm = createArm(false);
    const leftLeg = createLeg(true);
    const rightLeg = createLeg(false);

    // Ground Aura Circle under Fighter
    const auraGeo = new THREE.RingGeometry(0.85, 1.15, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: charDef.flameColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const auraRing = new THREE.Mesh(auraGeo, auraMat);
    auraRing.rotation.x = -Math.PI / 2;
    auraRing.position.y = 0.03;
    root.add(auraRing);

    return {
      root,
      hips,
      torso,
      headGroup,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      auraRing,
      gloveMat
    };
  }

  // ==========================================================================
  // 6. 2D ELECTRIC LIGHTNING & HIT SPARK PARTICLE SYSTEM
  // ==========================================================================
  const sparks = [];
  const lightningBolts = [];
  const shockwaves = [];

  function projectTo2D(x, y, z) {
    const v = new THREE.Vector3(x, y, z);
    v.project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * vfxCanvas.width,
      y: (-v.y * 0.5 + 0.5) * vfxCanvas.height
    };
  }

  function spawnHitSparks(worldX, worldY, colorHex, count = 28, isElectric = false) {
    const pt = projectTo2D(worldX, worldY, 0.4);
    const colorStr = '#' + colorHex.toString(16).padStart(6, '0');

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 140 + Math.random() * 520;
      sparks.push({
        x: pt.x,
        y: pt.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        size: 3 + Math.random() * 6,
        life: 0.22 + Math.random() * 0.25,
        maxLife: 0.45,
        color: i % 3 === 0 ? '#ffffff' : colorStr
      });
    }

    shockwaves.push({
      x: pt.x,
      y: pt.y,
      radius: 10,
      maxRadius: isElectric ? 175 : 110,
      life: 0.26,
      maxLife: 0.26,
      color: colorStr
    });

    if (isElectric) {
      for (let b = 0; b < 5; b++) {
        const segments = [];
        let cx = pt.x;
        let cy = pt.y;
        const baseAngle = Math.random() * Math.PI * 2;
        for (let s = 0; s < 6; s++) {
          cx += Math.cos(baseAngle + (Math.random() - 0.5) * 1.5) * (25 + Math.random() * 32);
          cy += Math.sin(baseAngle + (Math.random() - 0.5) * 1.5) * (25 + Math.random() * 32);
          segments.push({ x: cx, y: cy });
        }
        lightningBolts.push({
          startX: pt.x,
          startY: pt.y,
          segments,
          life: 0.18,
          color: b % 2 === 0 ? '#fef08a' : colorStr
        });
      }
    }
  }

  function renderVfxOverlay(dt) {
    vfxCtx.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

    // Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.life -= dt;
      if (sw.life <= 0) {
        shockwaves.splice(i, 1);
        continue;
      }
      const p = 1 - sw.life / sw.maxLife;
      const r = sw.radius + (sw.maxRadius - sw.radius) * p;
      vfxCtx.save();
      vfxCtx.beginPath();
      vfxCtx.arc(sw.x, sw.y, r, 0, Math.PI * 2);
      vfxCtx.strokeStyle = sw.color;
      vfxCtx.lineWidth = 6 * (1 - p);
      vfxCtx.globalAlpha = 1 - p;
      vfxCtx.stroke();
      vfxCtx.restore();
    }

    // Sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const sp = sparks[i];
      sp.life -= dt;
      if (sp.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.vy += 900 * dt; // Gravity

      vfxCtx.save();
      vfxCtx.strokeStyle = sp.color;
      vfxCtx.lineWidth = sp.size;
      vfxCtx.lineCap = 'round';
      vfxCtx.globalAlpha = Math.max(0, sp.life / sp.maxLife);
      vfxCtx.beginPath();
      vfxCtx.moveTo(sp.x, sp.y);
      vfxCtx.lineTo(sp.x - sp.vx * 0.028, sp.y - sp.vy * 0.028);
      vfxCtx.stroke();
      vfxCtx.restore();
    }

    // Electric Mishima Lightning Bolts
    for (let i = lightningBolts.length - 1; i >= 0; i--) {
      const lb = lightningBolts[i];
      lb.life -= dt;
      if (lb.life <= 0) {
        lightningBolts.splice(i, 1);
        continue;
      }
      vfxCtx.save();
      vfxCtx.strokeStyle = lb.color;
      vfxCtx.shadowColor = lb.color;
      vfxCtx.shadowBlur = 18;
      vfxCtx.lineWidth = 3.5;
      vfxCtx.beginPath();
      vfxCtx.moveTo(lb.startX, lb.startY);
      for (const seg of lb.segments) {
        vfxCtx.lineTo(seg.x, seg.y);
      }
      vfxCtx.stroke();
      vfxCtx.restore();
    }
  }

  // ==========================================================================
  // 7. FIGHTER CLASS (STATE MACHINE, POSE ANIMATION, COMBOS, RAGE ART)
  // ==========================================================================
  class Fighter {
    constructor(slot, charIdx) {
      this.slot = slot; // 0 = P1, 1 = P2
      this.setCharacter(charIdx);
      this.wins = 0;
      this.resetForRound();
    }

    setCharacter(charIdx) {
      this.charIdx = charIdx;
      this.def = FIGHTER_ROSTER[charIdx] || FIGHTER_ROSTER[0];
      if (this.rig) {
        scene.remove(this.rig.root);
      }
      this.rig = createFighterRig(this.def);
      scene.add(this.rig.root);
    }

    resetForRound() {
      this.x = this.slot === 0 ? -3.4 : 3.4;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.facing = this.slot === 0 ? 1 : -1;

      this.maxHp = 100;
      this.hp = 100;
      this.trailHp = 100;
      this.heat = 100;
      this.inRage = false;
      this.rageArtUsed = false;

      this.state = 'idle'; // idle | walk | crouch | jump | attack | hitstun | blockstun | launched | knockdown | ko
      this.stateTimer = 0;
      this.animTime = 0;

      this.currentMove = null;
      this.moveHasHit = false;
      this.comboCount = 0;
      this.comboDamage = 0;
      this.comboResetTimer = 0;
      this.jabChainStep = 0;
      this.jabChainWindow = 0;
    }

    startMove(moveKey) {
      if (this.state === 'hitstun' || this.state === 'blockstun' || this.state === 'launched' || this.state === 'knockdown' || this.state === 'ko') {
        return false;
      }
      if (this.state === 'attack') {
        // Allow 3-hit Jab string cancel (Jab -> Jab -> Heavy/Uppercut)
        if (this.currentMove === MOVES.jab && this.stateTimer > 0.14) {
          // cancel allowed!
        } else {
          return false;
        }
      }

      if (moveKey === 'rageArt') {
        if (this.heat < 45 && !this.inRage) return false;
        this.heat = Math.max(0, this.heat - 65);
        triggerCinematicFlash();
        sfx.playRageTrigger();
      } else {
        sfx.playWhoosh(moveKey === 'jab' ? 280 : 190);
      }

      this.currentMove = MOVES[moveKey];
      this.state = 'attack';
      this.stateTimer = 0;
      this.moveHasHit = false;

      // Forward lunge momentum on attacks
      const lunge = moveKey === 'rageArt' ? 9.5 : moveKey === 'tornadoKick' ? 6.5 : moveKey === 'uppercut' ? 5.0 : 2.2;
      this.vx = this.facing * lunge * this.def.speedMult;
      return true;
    }

    update(dt, opponent, input) {
      this.animTime += dt;
      this.stateTimer += dt;

      // Smooth red health damage trail
      if (this.trailHp > this.hp) {
        this.trailHp = Math.max(this.hp, this.trailHp - 28 * dt);
      }

      // Regenerate Heat gauge slowly
      if (this.heat < 100 && this.state !== 'attack') {
        this.heat = Math.min(100, this.heat + 7 * dt);
      }

      // Rage Mode Activation (< 30% HP)
      this.inRage = this.hp > 0 && this.hp <= 30;

      // Combo UI timeout
      if (this.comboCount > 0) {
        this.comboResetTimer -= dt;
        if (this.comboResetTimer <= 0 && opponent.state !== 'hitstun' && opponent.state !== 'launched') {
          this.comboCount = 0;
          this.comboDamage = 0;
          hideComboBanner(this.slot);
        }
      }

      // Auto-face opponent when on ground and not attacking
      if (this.y === 0 && (this.state === 'idle' || this.state === 'walk' || this.state === 'crouch')) {
        this.facing = opponent.x >= this.x ? 1 : -1;
      }

      // Handle States
      if (this.state === 'ko') {
        this.vx *= 0.88;
        this.applyPhysics(dt);
        this.animateRig(dt);
        return;
      }

      if (this.state === 'knockdown') {
        this.vx *= 0.88;
        this.applyPhysics(dt);
        if (this.stateTimer >= 0.75) {
          this.state = 'idle';
          this.stateTimer = 0;
        }
        this.animateRig(dt);
        return;
      }

      if (this.state === 'launched') {
        this.applyPhysics(dt);
        if (this.y <= 0 && this.vy <= 0) {
          this.y = 0;
          this.vy = 0;
          if (this.hp <= 0) {
            this.state = 'ko';
          } else {
            this.state = 'knockdown';
            this.stateTimer = 0;
          }
        }
        this.animateRig(dt);
        return;
      }

      if (this.state === 'hitstun' || this.state === 'blockstun') {
        this.vx *= 0.84;
        this.applyPhysics(dt);
        if (this.stateTimer >= this.stunDuration) {
          this.state = 'idle';
          this.stateTimer = 0;
        }
        this.animateRig(dt);
        return;
      }

      if (this.state === 'attack') {
        const mv = this.currentMove;
        this.vx *= 0.85;
        this.applyPhysics(dt);

        // Check Hit Frame Window
        const totalDur = mv.startup + mv.active + mv.recovery;
        if (!this.moveHasHit && this.stateTimer >= mv.startup && this.stateTimer <= mv.startup + mv.active) {
          this.checkHitConfirmation(opponent, mv);
        }

        if (this.stateTimer >= totalDur) {
          this.state = 'idle';
          this.stateTimer = 0;
          this.currentMove = null;
        }
        this.animateRig(dt);
        return;
      }

      // Neutral / Movement Input Handling
      const walkSpeed = 5.4 * this.def.speedMult;
      if (input.attackKey) {
        this.startMove(input.attackKey);
      } else if (input.up && this.y === 0) {
        this.state = 'jump';
        this.vy = 12.2;
        this.vx = input.moveDir * walkSpeed * 0.9;
      } else if (input.down && this.y === 0) {
        this.state = 'crouch';
        this.vx *= 0.7;
      } else if (this.y === 0) {
        if (input.moveDir !== 0) {
          this.state = 'walk';
          this.vx = input.moveDir * walkSpeed;
        } else {
          this.state = 'idle';
          this.vx *= 0.75;
        }
      }

      this.applyPhysics(dt);
      this.animateRig(dt);
    }

    applyPhysics(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      if (this.y > 0) {
        this.vy -= 30.0 * dt; // Gravity
        if (this.y <= 0 && this.state !== 'launched') {
          this.y = 0;
          this.vy = 0;
          if (this.state === 'jump') this.state = 'idle';
        }
      }

      // Arena Wall Collision & Wall Splat Mechanic!
      if (this.x < -ARENA_WALL_X) {
        if ((this.state === 'hitstun' || this.state === 'launched') && Math.abs(this.vx) > 3.5) {
          this.triggerWallSplat(-ARENA_WALL_X);
        }
        this.x = -ARENA_WALL_X;
        this.vx = 0;
      } else if (this.x > ARENA_WALL_X) {
        if ((this.state === 'hitstun' || this.state === 'launched') && Math.abs(this.vx) > 3.5) {
          this.triggerWallSplat(ARENA_WALL_X);
        }
        this.x = ARENA_WALL_X;
        this.vx = 0;
      }
    }

    triggerWallSplat(wallX) {
      this.hp = Math.max(0, this.hp - 6);
      this.vy = Math.max(this.vy, 5.5);
      spawnHitSparks(wallX, this.y + 2.0, 0x38bdf8, 30, true);
      sfx.playHit(true, true);
      cameraShake = Math.max(cameraShake, 0.35);
    }

    checkHitConfirmation(defender, mv) {
      if (defender.state === 'ko' || defender.state === 'knockdown') return;

      const dist = Math.abs(defender.x - this.x);
      const effectiveRange = mv.range + (this.inRage ? 0.25 : 0);
      if (dist > effectiveRange) return;

      // Vertical proximity check for juggles
      if (defender.y > 3.2 && mv.launchY === 0 && mv !== MOVES.rageArt) return;

      // High attack whiffing against crouching opponent
      if (mv.height === 'high' && defender.state === 'crouch') return;

      this.moveHasHit = true;

      // Determine if defender is holding Back to Guard
      const defenderInput = getFighterInputState(defender.slot);
      const holdingBack = (defender.facing === 1 && defenderInput.moveDir < 0) ||
                          (defender.facing === -1 && defenderInput.moveDir > 0);
      const canGuardState = defender.y === 0 && (defender.state === 'idle' || defender.state === 'walk' || defender.state === 'crouch');

      let isBlocked = false;
      if (canGuardState && holdingBack && mv.height !== 'unblockable_throw') {
        if (mv.height === 'low' && defender.state !== 'crouch') {
          isBlocked = false; // Low sweep hits standing guard!
        } else if (mv.height === 'mid' && defender.state === 'crouch') {
          isBlocked = false; // Mid attacks crush crouching guard!
        } else {
          isBlocked = true;
        }
      }

      const impactX = (this.x + defender.x) * 0.5 + this.facing * 0.4;
      const impactY = defender.y + (mv.height === 'low' ? 0.6 : 2.1);

      if (isBlocked) {
        defender.state = 'blockstun';
        defender.stateTimer = 0;
        defender.stunDuration = mv.blockStun;
        defender.vx = this.facing * mv.pushback * 4.5;
        // Chip damage on heavy/electric moves
        if (mv.electric || mv.cinematic) {
          defender.hp = Math.max(1, defender.hp - Math.round(mv.damage * 0.18));
        }
        spawnHitSparks(impactX, impactY, 0x38bdf8, 16, false);
        sfx.playBlock();
        cameraShake = Math.max(cameraShake, 0.12);
        return;
      }

      // Clean Hit or Juggle Hit!
      const isAirJuggle = defender.y > 0.25 || defender.state === 'launched';
      const rageMult = this.inRage ? 1.2 : 1.0;
      const scaleMult = isAirJuggle ? Math.max(0.45, 1 - this.comboCount * 0.12) : 1.0;
      const finalDamage = Math.max(3, Math.round(mv.damage * this.def.powerMult * rageMult * scaleMult));

      defender.hp = Math.max(0, defender.hp - finalDamage);
      this.heat = Math.min(100, this.heat + 14);

      this.comboCount += 1;
      this.comboDamage += finalDamage;
      this.comboResetTimer = 1.6;

      const customTitle = mv === MOVES.uppercut ? this.def.specialName
                        : mv === MOVES.rageArt ? this.def.rageArtName
                        : mv.name;
      showComboBanner(this.slot, this.comboCount, this.comboDamage, customTitle, isAirJuggle);

      // Hit Stop / Cinematic Camera Shake
      hitStopTimer = mv.cinematic ? 0.18 : mv.heavySpark ? 0.075 : 0.035;
      cameraShake = mv.cinematic ? 0.65 : mv.heavySpark ? 0.35 : 0.14;

      if (mv.cinematic) {
        cinematicZoomTimer = 0.75;
        triggerCinematicFlash();
      }

      spawnHitSparks(
        impactX,
        impactY,
        this.def.sparkHex,
        mv.heavySpark ? 42 : 22,
        mv.electric
      );
      sfx.playHit(mv.heavySpark, mv.electric);

      // Apply Launch / Juggle / Hitstun to Defender
      if (defender.hp <= 0) {
        defender.state = 'launched';
        defender.stateTimer = 0;
        defender.vy = 11.5;
        defender.vx = this.facing * 8.5;
        onFighterKO(this.slot, mv.cinematic ? 'RAGE FINISH!' : 'K.O.!');
      } else if (mv.launchY > 0 || isAirJuggle) {
        defender.state = 'launched';
        defender.stateTimer = 0;
        defender.vy = isAirJuggle ? Math.max(7.8, mv.launchY * 0.68) : mv.launchY;
        defender.vx = this.facing * (mv.pushback * 2.2);
      } else {
        defender.state = 'hitstun';
        defender.stateTimer = 0;
        defender.stunDuration = mv.hitStun;
        defender.vx = this.facing * mv.pushback * 5.2;
      }

      // Broadcast Hit Event over Radmin if online
      if (gameMode === 'radmin' && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'tk_hit_event',
          event: {
            attackerSlot: this.slot,
            defenderHp: defender.hp,
            comboCount: this.comboCount,
            comboDamage: this.comboDamage,
            moveTitle: customTitle
          }
        }));
      }
    }

    animateRig() {
      const r = this.rig;
      r.root.position.set(this.x, this.y, 0);
      r.root.rotation.y = this.facing === 1 ? Math.PI * 0.42 : -Math.PI * 0.42;

      // Pulse Aura & Gauntlet Glow in Rage Mode
      const pulse = 0.55 + Math.sin(this.animTime * 8) * 0.25;
      r.auraRing.scale.setScalar(this.inRage ? 1.25 + Math.sin(this.animTime * 12) * 0.12 : 1.0);
      r.gloveMat.emissiveIntensity = this.inRage ? 1.25 : pulse;

      // Reset joint rotations to neutral martial arts guard
      r.hips.position.y = 1.95;
      r.hips.rotation.set(0, 0, 0);
      r.torso.rotation.set(0, 0, 0);

      r.leftArm.shoulder.rotation.set(-0.65, 0.25, -0.25);
      r.leftArm.elbow.rotation.set(-1.35, 0, 0);
      r.rightArm.shoulder.rotation.set(-0.55, -0.25, 0.25);
      r.rightArm.elbow.rotation.set(-1.45, 0, 0);

      r.leftLeg.hipJoint.rotation.set(-0.22, 0, -0.08);
      r.leftLeg.knee.rotation.set(0.38, 0, 0);
      r.rightLeg.hipJoint.rotation.set(0.26, 0, 0.08);
      r.rightLeg.knee.rotation.set(0.32, 0, 0);

      const t = this.animTime;

      if (this.state === 'idle') {
        const bob = Math.sin(t * 6.5) * 0.07;
        r.hips.position.y = 1.92 + bob;
        r.torso.rotation.x = 0.08;
        r.leftArm.shoulder.rotation.x = -0.7 + Math.sin(t * 6.5) * 0.1;
        r.rightArm.shoulder.rotation.x = -0.6 - Math.sin(t * 6.5) * 0.1;
      } else if (this.state === 'walk') {
        const stride = Math.sin(t * 14);
        r.hips.position.y = 1.88 + Math.abs(stride) * 0.08;
        r.torso.rotation.x = 0.16;
        r.leftLeg.hipJoint.rotation.x = stride * 0.65;
        r.rightLeg.hipJoint.rotation.x = -stride * 0.65;
        r.leftLeg.knee.rotation.x = Math.max(0.15, -stride * 0.6);
        r.rightLeg.knee.rotation.x = Math.max(0.15, stride * 0.6);
      } else if (this.state === 'crouch') {
        r.hips.position.y = 1.25;
        r.torso.rotation.x = 0.35;
        r.leftLeg.hipJoint.rotation.x = -0.95;
        r.leftLeg.knee.rotation.x = 1.45;
        r.rightLeg.hipJoint.rotation.x = -0.85;
        r.rightLeg.knee.rotation.x = 1.35;
      } else if (this.state === 'blockstun') {
        r.torso.rotation.x = -0.12;
        r.leftArm.shoulder.rotation.set(-1.35, 0.5, 0);
        r.rightArm.shoulder.rotation.set(-1.35, -0.5, 0);
      } else if (this.state === 'hitstun') {
        r.torso.rotation.x = -0.48;
        r.headGroup.rotation.x = -0.35;
        r.leftArm.shoulder.rotation.z = -0.75;
        r.rightArm.shoulder.rotation.z = 0.75;
      } else if (this.state === 'launched') {
        r.hips.rotation.x = -1.25;
        r.hips.rotation.z = Math.sin(t * 18) * 0.35;
        r.leftArm.shoulder.rotation.x = -2.2;
        r.rightArm.shoulder.rotation.x = -2.0;
      } else if (this.state === 'knockdown' || this.state === 'ko') {
        r.hips.position.y = 0.42;
        r.hips.rotation.x = -1.52;
        r.leftLeg.hipJoint.rotation.x = 0.1;
        r.rightLeg.hipJoint.rotation.x = -0.15;
      } else if (this.state === 'attack' && this.currentMove) {
        const mv = this.currentMove;
        if (mv.limb === 'leftArm') {
          r.torso.rotation.y = -0.55;
          r.leftArm.shoulder.rotation.set(-1.55, 0, 0);
          r.leftArm.elbow.rotation.set(-0.08, 0, 0);
        } else if (mv.limb === 'rightArm') {
          r.torso.rotation.y = 0.68;
          if (mv === MOVES.uppercut) {
            // Iconic Mishima Electric Uppercut Pose!
            r.hips.position.y = 2.15;
            r.rightArm.shoulder.rotation.set(-2.45, 0, 0.15);
            r.rightArm.elbow.rotation.set(-0.35, 0, 0);
          } else {
            r.rightArm.shoulder.rotation.set(-1.58, 0, 0);
            r.rightArm.elbow.rotation.set(-0.05, 0, 0);
          }
        } else if (mv.limb === 'leftLeg') {
          if (mv === MOVES.lowSweep) {
            r.hips.position.y = 1.15;
            r.hips.rotation.y = -this.stateTimer * 14;
            r.leftLeg.hipJoint.rotation.set(-1.35, 0, -0.4);
            r.leftLeg.knee.rotation.set(0.1, 0, 0);
          } else {
            r.torso.rotation.x = -0.28;
            r.leftLeg.hipJoint.rotation.set(-1.68, 0, -0.2);
            r.leftLeg.knee.rotation.set(0.08, 0, 0);
          }
        } else if (mv.limb === 'rightLeg') {
          // Spinning Cyclone Tornado Kick
          r.hips.position.y = 2.25;
          r.hips.rotation.y = this.stateTimer * 18;
          r.rightLeg.hipJoint.rotation.set(-1.75, 0, 0.35);
          r.rightLeg.knee.rotation.set(0.05, 0, 0);
        } else if (mv.limb === 'bothArms' || mv.limb === 'rageArt') {
          r.torso.rotation.x = 0.25;
          r.leftArm.shoulder.rotation.set(-1.65, 0.2, 0);
          r.leftArm.elbow.rotation.set(-0.1, 0, 0);
          r.rightArm.shoulder.rotation.set(-1.65, -0.2, 0);
          r.rightArm.elbow.rotation.set(-0.1, 0, 0);
        }
      }
    }
  }

  // ==========================================================================
  // 8. INPUT CONTROLLER & SMART TEKKEN AI BRAIN
  // ==========================================================================
  const keysDown = new Set();
  let p1QueuedAttack = null;
  let p2QueuedAttack = null;
  let lastTapKey = null;
  let lastTapTime = 0;

  window.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    const code = e.code;

    // Double-tap Wave Dash detection for P1 (A/D)
    if (!keysDown.has(code) && (code === 'KeyA' || code === 'KeyD')) {
      const now = performance.now();
      if (lastTapKey === code && now - lastTapTime < 240 && p1 && p1.y === 0 && p1.state !== 'attack') {
        const dir = code === 'KeyD' ? 1 : -1;
        p1.vx = dir * 13.5;
        spawnHitSparks(p1.x, 0.2, 0x38bdf8, 8, false);
      }
      lastTapKey = code;
      lastTapTime = now;
    }

    keysDown.add(code);

    // Shortcut R for quick round reset
    if (code === 'KeyR' && document.getElementById('selectModal').classList.contains('hidden')) {
      startNewMatch();
    }

    // Player 1 Attack Triggers (U, I, J, K, H, L)
    const p1Crouching = keysDown.has('KeyS');
    if (code === 'KeyU') {
      if (keysDown.has('KeyJ')) p1QueuedAttack = 'throwMove';
      else p1QueuedAttack = 'jab';
    } else if (code === 'KeyI') {
      p1QueuedAttack = p1Crouching ? 'uppercut' : 'heavyPunch';
    } else if (code === 'KeyJ') {
      if (keysDown.has('KeyU')) p1QueuedAttack = 'throwMove';
      else p1QueuedAttack = p1Crouching ? 'lowSweep' : 'quickKick';
    } else if (code === 'KeyK') {
      p1QueuedAttack = 'tornadoKick';
    } else if (code === 'KeyH') {
      p1QueuedAttack = 'throwMove';
    } else if (code === 'KeyL') {
      p1QueuedAttack = 'rageArt';
    }

    // Player 2 Local Keyboard Attack Triggers (Numpad or Top Row 1,2,3,4,0)
    const p2Crouching = keysDown.has('ArrowDown');
    if (code === 'Numpad4' || code === 'Digit1') {
      p2QueuedAttack = 'jab';
    } else if (code === 'Numpad5' || code === 'Digit2') {
      p2QueuedAttack = p2Crouching ? 'uppercut' : 'heavyPunch';
    } else if (code === 'Numpad1' || code === 'Digit3') {
      p2QueuedAttack = p2Crouching ? 'lowSweep' : 'quickKick';
    } else if (code === 'Numpad2' || code === 'Digit4') {
      p2QueuedAttack = 'tornadoKick';
    } else if (code === 'Numpad3' || code === 'Digit5') {
      p2QueuedAttack = 'throwMove';
    } else if (code === 'Numpad6' || code === 'Digit0') {
      p2QueuedAttack = 'rageArt';
    }
  });

  window.addEventListener('keyup', (e) => {
    keysDown.delete(e.code);
  });

  let aiDifficulty = 0.78;
  let aiDecisionTimer = 0;
  let aiCurrentAction = { moveDir: 0, up: false, down: false, attackKey: null };

  function computeAiInput(ai, enemy, dt) {
    aiDecisionTimer -= dt;
    const attackKey = aiCurrentAction.attackKey;
    aiCurrentAction.attackKey = null;

    if (aiDecisionTimer > 0) {
      return { ...aiCurrentAction, attackKey };
    }

    aiDecisionTimer = 0.14 + (1 - aiDifficulty) * 0.22;
    const dist = Math.abs(enemy.x - ai.x);
    const dirToEnemy = enemy.x > ai.x ? 1 : -1;

    // 1. If enemy is launched in the air, juggle them relentlessly!
    if (enemy.state === 'launched' && dist < 3.1) {
      aiCurrentAction = {
        moveDir: dirToEnemy,
        up: false,
        down: false,
        attackKey: Math.random() < 0.5 ? 'tornadoKick' : 'heavyPunch'
      };
      return aiCurrentAction;
    }

    // 2. Defensive reaction if enemy is attacking at close range
    if (enemy.state === 'attack' && dist < 3.2 && Math.random() < aiDifficulty * 0.72) {
      aiCurrentAction = {
        moveDir: -dirToEnemy, // Hold back to block!
        up: false,
        down: enemy.currentMove === MOVES.lowSweep,
        attackKey: null
      };
      return aiCurrentAction;
    }

    // 3. Far range: approach or Wave Dash in
    if (dist > 2.75) {
      aiCurrentAction = {
        moveDir: dirToEnemy,
        up: Math.random() < 0.04,
        down: false,
        attackKey: dist < 3.6 && Math.random() < 0.25 ? 'tornadoKick' : null
      };
      return aiCurrentAction;
    }

    // 4. Close quarters Tekken Mixup (Jab strings, Electric Uppercuts, Low Sweeps, Throws, Rage Art)
    const roll = Math.random();
    let chosenAttack = null;
    if ((ai.inRage || ai.heat >= 75) && roll < 0.16 * aiDifficulty) {
      chosenAttack = 'rageArt';
    } else if (roll < 0.28) {
      chosenAttack = 'jab';
    } else if (roll < 0.48) {
      chosenAttack = 'uppercut';
    } else if (roll < 0.64) {
      chosenAttack = 'lowSweep';
    } else if (roll < 0.80) {
      chosenAttack = 'quickKick';
    } else if (roll < 0.92) {
      chosenAttack = 'tornadoKick';
    } else {
      chosenAttack = 'throwMove';
    }

    aiCurrentAction = {
      moveDir: Math.random() < 0.25 ? -dirToEnemy : 0,
      up: false,
      down: false,
      attackKey: chosenAttack
    };
    return aiCurrentAction;
  }

  function getFighterInputState(slot) {
    if (slot === 0) {
      const moveDir = (keysDown.has('KeyD') ? 1 : 0) - (keysDown.has('KeyA') ? 1 : 0);
      const atk = p1QueuedAttack;
      p1QueuedAttack = null;
      return {
        moveDir,
        up: keysDown.has('KeyW'),
        down: keysDown.has('KeyS'),
        attackKey: atk
      };
    } else {
      if (gameMode === 'ai') {
        return computeAiInput(p2, p1, 0.016);
      }
      const moveDir = (keysDown.has('ArrowRight') ? 1 : 0) - (keysDown.has('ArrowLeft') ? 1 : 0);
      const atk = p2QueuedAttack;
      p2QueuedAttack = null;
      return {
        moveDir,
        up: keysDown.has('ArrowUp'),
        down: keysDown.has('ArrowDown'),
        attackKey: atk
      };
    }
  }

  // ==========================================================================
  // 9. MATCH STATE, ROUNDS, TIMER & HUD UPDATES
  // ==========================================================================
  let gameMode = 'ai'; // 'ai' | 'local2p' | 'radmin'
  let p1PickIdx = 0; // Jin Kazama
  let p2PickIdx = 1; // Kazuya Mishima
  let pickingTarget = 1; // 1 = P1, 2 = P2

  const p1 = new Fighter(0, p1PickIdx);
  const p2 = new Fighter(1, p2PickIdx);

  let roundNumber = 1;
  let roundTimer = 60;
  let matchPhase = 'intro'; // 'select' | 'intro' | 'fighting' | 'round_over' | 'match_over'
  let phaseCountdown = 0;
  let hitStopTimer = 0;
  let cameraShake = 0;
  let cinematicZoomTimer = 0;

  function showAnnouncer(subText, mainText, duration = 1.6) {
    const overlay = document.getElementById('announcerOverlay');
    const subEl = document.getElementById('announcerSub');
    const mainEl = document.getElementById('announcerMain');
    subEl.textContent = subText;
    mainEl.textContent = mainText;
    overlay.classList.remove('hidden');

    // Re-trigger zoom animation
    mainEl.style.animation = 'none';
    void mainEl.offsetWidth;
    mainEl.style.animation = '';

    if (duration > 0) {
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, duration * 1000);
    }
  }

  function triggerCinematicFlash() {
    const fl = document.getElementById('cinematicFlash');
    fl.classList.remove('hidden');
    setTimeout(() => fl.classList.add('hidden'), 340);
  }

  function showComboBanner(slot, hits, dmg, moveName, isJuggle) {
    const prefix = slot === 0 ? 'p1' : 'p2';
    const box = document.getElementById(`${prefix}ComboBox`);
    document.getElementById(`${prefix}ComboNum`).textContent = hits;
    document.getElementById(`${prefix}ComboDmg`).textContent = `${dmg} DMG${isJuggle ? ' • AIR JUGGLE!' : ''}`;
    document.getElementById(`${prefix}MoveName`).textContent = moveName;
    box.classList.remove('hidden');
  }

  function hideComboBanner(slot) {
    const prefix = slot === 0 ? 'p1' : 'p2';
    document.getElementById(`${prefix}ComboBox`).classList.add('hidden');
  }

  function updateHudDOM() {
    // P1 Bars
    document.getElementById('p1HpFill').style.width = `${p1.hp}%`;
    document.getElementById('p1HpTrail').style.width = `${p1.trailHp}%`;
    document.getElementById('p1HeatFill').style.width = `${p1.heat}%`;
    document.getElementById('p1HpFill').classList.toggle('rage-mode', p1.inRage);
    document.getElementById('p1RageBadge').classList.toggle('hidden', !p1.inRage);

    // P2 Bars
    document.getElementById('p2HpFill').style.width = `${p2.hp}%`;
    document.getElementById('p2HpTrail').style.width = `${p2.trailHp}%`;
    document.getElementById('p2HeatFill').style.width = `${p2.heat}%`;
    document.getElementById('p2HpFill').classList.toggle('rage-mode', p2.inRage);
    document.getElementById('p2RageBadge').classList.toggle('hidden', !p2.inRage);

    // Timer & Round Orbs
    document.getElementById('timerDigits').textContent = Math.ceil(Math.max(0, roundTimer));
    document.getElementById('roundLabel').textContent = `ROUND ${roundNumber}`;

    const p1Orbs = document.querySelectorAll('#p1Orbs .orb');
    p1Orbs.forEach((orb, idx) => orb.classList.toggle('won', idx < p1.wins));
    const p2Orbs = document.querySelectorAll('#p2Orbs .orb');
    p2Orbs.forEach((orb, idx) => orb.classList.toggle('won', idx < p2.wins));
  }

  function refreshFighterHudIdentity() {
    document.getElementById('p1Icon').textContent = p1.def.icon;
    document.getElementById('p1Name').textContent = p1.def.name;
    document.getElementById('p1Style').textContent = p1.def.style;

    document.getElementById('p2Icon').textContent = p2.def.icon;
    document.getElementById('p2Name').textContent = p2.def.name;
    document.getElementById('p2Style').textContent = p2.def.style;
  }

  function startNewMatch() {
    p1.setCharacter(p1PickIdx);
    p2.setCharacter(p2PickIdx);
    p1.wins = 0;
    p2.wins = 0;
    roundNumber = 1;
    refreshFighterHudIdentity();
    startNextRound();
  }

  function startNextRound() {
    p1.resetForRound();
    p2.resetForRound();
    hideComboBanner(0);
    hideComboBanner(1);
    roundTimer = 60;
    matchPhase = 'intro';
    phaseCountdown = 1.65;
    updateHudDOM();

    showAnnouncer('GET READY FOR THE NEXT BATTLE', `ROUND ${roundNumber} • FIGHT!`, 1.6);
  }

  function onFighterKO(winnerSlot, koTitle = 'K.O.!') {
    if (matchPhase !== 'fighting') return;
    matchPhase = 'round_over';
    phaseCountdown = 3.2;
    sfx.playKO();
    triggerCinematicFlash();

    const winner = winnerSlot === 0 ? p1 : p2;
    winner.wins += 1;
    updateHudDOM();

    if (winner.wins >= 3) {
      matchPhase = 'match_over';
      showAnnouncer('THE KING OF IRON FIST CHAMPION', `${winner.def.name} WINS!`, 4.0);
      setTimeout(() => {
        if (matchPhase === 'match_over') startNewMatch();
      }, 4200);
    } else {
      showAnnouncer(`${winner.def.name} WINS ROUND ${roundNumber}`, koTitle, 2.8);
      setTimeout(() => {
        roundNumber += 1;
        startNextRound();
      }, 3100);
    }
  }

  // ==========================================================================
  // 10. RADMIN VPN / LAN MULTIPLAYER WEBSOCKET SYNC
  // ==========================================================================
  let ws = null;
  let myNetSlot = 0;
  let onlinePlayers = [];

  function initNetworkAndRadminBanner() {
    fetch('/api/info')
      .then((r) => r.json())
      .then((info) => {
        const rIp = info.ips.find((ip) => ip.address.startsWith('26.')) || info.ips[0];
        const hostAddr = rIp ? `${rIp.address}:${info.port}` : window.location.host;
        document.getElementById('tkShareUrl').textContent = `http://${hostAddr}/tekken.html`;
      })
      .catch(() => {
        document.getElementById('tkShareUrl').textContent = window.location.href;
      });

    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    ws = new WebSocket(`${proto}://${window.location.host}/?mode=tekken`);

    ws.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'tekken_welcome') {
          myNetSlot = msg.slot;
          onlinePlayers = msg.players || [];
          renderOnlineLobbyChips();
        } else if (msg.type === 'tekken_room') {
          onlinePlayers = msg.players || [];
          renderOnlineLobbyChips();
        } else if (msg.type === 'tk_match_start' && gameMode === 'radmin') {
          p1PickIdx = msg.p1 ?? 0;
          p2PickIdx = msg.p2 ?? 1;
          buildStage(msg.stageIdx ?? 0);
          document.getElementById('selectModal').classList.add('hidden');
          startNewMatch();
        } else if (msg.type === 'tk_fighter_sync' && gameMode === 'radmin') {
          const remoteFighter = msg.slot === 0 ? p1 : p2;
          const st = msg.state;
          if (st) {
            remoteFighter.x = st.x;
            remoteFighter.y = st.y;
            remoteFighter.vx = st.vx;
            remoteFighter.vy = st.vy;
            remoteFighter.hp = st.hp;
            remoteFighter.heat = st.heat;
            remoteFighter.state = st.state;
            if (st.moveKey && remoteFighter.state !== 'attack') {
              remoteFighter.startMove(st.moveKey);
            }
          }
        }
      } catch (e) {}
    });
  }

  function renderOnlineLobbyChips() {
    document.getElementById('tkOnlineCount').textContent = onlinePlayers.length;
    const container = document.getElementById('tkOnlinePlayersList');
    container.innerHTML = onlinePlayers
      .map((p) => `<span class="online-chip">🥊 ${p.name} (P${p.slot + 1})</span>`)
      .join('');
  }

  // Broadcast local fighter state at 30Hz when in Radmin mode
  setInterval(() => {
    if (gameMode === 'radmin' && ws && ws.readyState === WebSocket.OPEN && matchPhase === 'fighting') {
      const me = myNetSlot === 1 ? p2 : p1;
      ws.send(JSON.stringify({
        type: 'tk_fighter_sync',
        state: {
          x: me.x,
          y: me.y,
          vx: me.vx,
          vy: me.vy,
          hp: me.hp,
          heat: me.heat,
          state: me.state
        }
      }));
    }
  }, 33);

  // ==========================================================================
  // 11. UI MODAL & ROSTER / STAGE SELECTION WIRING
  // ==========================================================================
  function renderSelectModalRoster() {
    const rosterGrid = document.getElementById('rosterGrid');
    rosterGrid.innerHTML = FIGHTER_ROSTER.map((ch, idx) => {
      const isP1 = idx === p1PickIdx;
      const isP2 = idx === p2PickIdx;
      return `
        <div class="char-card ${isP1 ? 'selected-p1' : ''} ${isP2 ? 'selected-p2' : ''}" data-idx="${idx}">
          <div class="char-badge-row">
            <span>${isP1 ? '<span class="p-tag p1">P1</span>' : ''}</span>
            <span>${isP2 ? '<span class="p-tag p2">P2</span>' : ''}</span>
          </div>
          <div class="char-emoji">${ch.icon}</div>
          <div class="char-title">${ch.name}</div>
          <div class="char-sub">${ch.style}</div>
          <div class="char-stats">${ch.stats}</div>
        </div>
      `;
    }).join('');

    rosterGrid.querySelectorAll('.char-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = Number(card.dataset.idx);
        if (pickingTarget === 1) {
          p1PickIdx = idx;
          p1.setCharacter(idx);
        } else {
          p2PickIdx = idx;
          p2.setCharacter(idx);
        }
        refreshFighterHudIdentity();
        renderSelectModalRoster();
      });

      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const idx = Number(card.dataset.idx);
        p2PickIdx = idx;
        p2.setCharacter(idx);
        refreshFighterHudIdentity();
        renderSelectModalRoster();
      });
    });

    const stageGrid = document.getElementById('stageGrid');
    stageGrid.innerHTML = STAGES.map((st, idx) => `
      <div class="stage-card ${idx === currentStageIdx ? 'active' : ''}" data-idx="${idx}">
        <div class="stage-name">🏟️ ${st.name}</div>
        <div class="stage-desc">${st.desc}</div>
      </div>
    `).join('');

    stageGrid.querySelectorAll('.stage-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = Number(card.dataset.idx);
        buildStage(idx);
        renderSelectModalRoster();
      });
    });
  }

  document.getElementById('pickP1Btn').addEventListener('click', () => {
    pickingTarget = 1;
    document.getElementById('pickP1Btn').classList.add('active');
    document.getElementById('pickP2Btn').classList.remove('active');
  });

  document.getElementById('pickP2Btn').addEventListener('click', () => {
    pickingTarget = 2;
    document.getElementById('pickP2Btn').classList.add('active');
    document.getElementById('pickP1Btn').classList.remove('active');
  });

  document.querySelectorAll('.mode-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      gameMode = tab.dataset.mode;

      document.getElementById('aiConfigRow').classList.toggle('hidden', gameMode !== 'ai');
      document.getElementById('radminLobbyRow').classList.toggle('hidden', gameMode !== 'radmin');

      const badge = document.getElementById('currentModeBadge');
      if (gameMode === 'ai') badge.textContent = '🤖 VS AI CPU';
      else if (gameMode === 'local2p') badge.textContent = '👥 2P LOCAL VERSUS';
      else badge.textContent = '🌐 RADMIN VPN ONLINE';
    });
  });

  document.querySelectorAll('.diff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      aiDifficulty = Number(btn.dataset.diff);
    });
  });

  document.getElementById('startBattleBtn').addEventListener('click', () => {
    sfx.init();
    document.getElementById('selectModal').classList.add('hidden');
    if (gameMode === 'radmin' && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'tk_start_match',
        stageIdx: currentStageIdx,
        p1: p1PickIdx,
        p2: p2PickIdx
      }));
    }
    startNewMatch();
  });

  document.getElementById('openSelectBtn').addEventListener('click', () => {
    document.getElementById('selectModal').classList.remove('hidden');
  });

  document.getElementById('toggleMoveListBtn').addEventListener('click', () => {
    document.getElementById('moveListPanel').classList.toggle('hidden');
  });

  document.getElementById('closeMoveListBtn').addEventListener('click', () => {
    document.getElementById('moveListPanel').classList.add('hidden');
  });

  document.getElementById('rematchBtn').addEventListener('click', () => {
    startNewMatch();
  });

  document.getElementById('soundToggleBtn').addEventListener('click', (e) => {
    sfx.enabled = !sfx.enabled;
    e.currentTarget.textContent = sfx.enabled ? '🔊 เสียง: เปิด' : '🔇 เสียง: ปิด';
  });

  document.getElementById('radminCopyBox').addEventListener('click', () => {
    const url = document.getElementById('tkShareUrl').textContent;
    navigator.clipboard.writeText(url).catch(() => {});
    const btn = document.getElementById('tkCopyBtn');
    btn.textContent = 'คัดลอกแล้ว!';
    setTimeout(() => (btn.textContent = 'คัดลอกลิงก์ท้าดวล'), 1800);
  });

  // ==========================================================================
  // 12. MAIN 60FPS GAME & DYNAMIC CINEMATIC CAMERA LOOP
  // ==========================================================================
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    vfxCanvas.width = window.innerWidth;
    vfxCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', handleResize);
  handleResize();

  buildStage(0);
  renderSelectModalRoster();
  refreshFighterHudIdentity();
  initNetworkAndRadminBanner();

  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    let dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // Animate Stage Floating Lava Rocks / Cyber Holograms
    for (const prop of stageFloatingProps) {
      prop.mesh.position.y = prop.baseY + Math.sin(now * 0.0015 * prop.speed + prop.phase) * 0.45;
      if (prop.rotateZ) prop.mesh.rotation.z += dt * 0.5;
    }

    // Hit-stop freeze frame for heavy Tekken impact feel
    if (hitStopTimer > 0) {
      hitStopTimer -= dt;
      renderVfxOverlay(dt * 0.35);
      renderer.render(scene, camera);
      return;
    }

    if (matchPhase === 'intro') {
      phaseCountdown -= dt;
      p1.animateRig();
      p2.animateRig();
      if (phaseCountdown <= 0) {
        matchPhase = 'fighting';
      }
    } else if (matchPhase === 'fighting') {
      roundTimer -= dt;
      if (roundTimer <= 0) {
        roundTimer = 0;
        const winnerSlot = p1.hp >= p2.hp ? 0 : 1;
        onFighterKO(winnerSlot, 'TIME UP!');
      }

      const in1 = getFighterInputState(0);
      const in2 = getFighterInputState(1);

      p1.update(dt, p2, in1);
      p2.update(dt, p1, in2);

      // Prevent fighters from overlapping through each other's bodies
      const minSeparation = 1.25;
      const dx = p2.x - p1.x;
      if (Math.abs(dx) < minSeparation && Math.abs(p1.y - p2.y) < 1.5) {
        const push = (minSeparation - Math.abs(dx)) * 0.5;
        if (dx >= 0) {
          p1.x -= push;
          p2.x += push;
        } else {
          p1.x += push;
          p2.x -= push;
        }
      }

      updateHudDOM();
    } else {
      // round_over or match_over physics settle
      p1.update(dt * 0.35, p2, { moveDir: 0, up: false, down: false, attackKey: null });
      p2.update(dt * 0.35, p1, { moveDir: 0, up: false, down: false, attackKey: null });
    }

    // Dynamic Tekken 8 Broadcast Camera (Tracks Midpoint, Distance Zoom & Rage Art Zoom)
    const midX = (p1.x + p2.x) * 0.5;
    const midY = 1.9 + Math.max(p1.y, p2.y) * 0.35;
    const distBetween = Math.abs(p1.x - p2.x);

    let targetZ = Math.max(8.2, Math.min(14.5, 6.8 + distBetween * 0.72));
    let targetY = midY + 1.1;

    if (cinematicZoomTimer > 0) {
      cinematicZoomTimer -= dt;
      targetZ = 5.6;
      targetY = midY + 0.35;
    }

    camera.position.x += (midX - camera.position.x) * 8 * dt;
    camera.position.y += (targetY - camera.position.y) * 8 * dt;
    camera.position.z += (targetZ - camera.position.z) * 8 * dt;

    if (cameraShake > 0) {
      camera.position.x += (Math.random() - 0.5) * cameraShake;
      camera.position.y += (Math.random() - 0.5) * cameraShake;
      cameraShake = Math.max(0, cameraShake - 1.8 * dt);
    }

    camera.lookAt(midX, midY, 0);

    renderVfxOverlay(dt);
    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
})();
