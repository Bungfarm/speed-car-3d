// ============================================================================
// SPEED CAR 3D: NEED FOR SPEED EDITION
// ============================================================================

const CAR_COLORS = [
  { name: 'Crimson Red', primary: '#ef4444', secondary: '#991b1b', glow: '#f87171', hex: 0xef4444 },
  { name: 'Cyber Cyan', primary: '#06b6d4', secondary: '#155e75', glow: '#22d3ee', hex: 0x06b6d4 },
  { name: 'Neon Lime', primary: '#84cc16', secondary: '#3f6212', glow: '#a3e635', hex: 0x84cc16 },
  { name: 'Solar Gold', primary: '#eab308', secondary: '#854d0e', glow: '#facc15', hex: 0xeab308 },
  { name: 'Plasma Purple', primary: '#a855f7', secondary: '#581c87', glow: '#c084fc', hex: 0xa855f7 },
  { name: 'Blaze Orange', primary: '#f97316', secondary: '#9a3412', glow: '#fb923c', hex: 0xf97316 }
];

// ============================================================================
// CIRCUIT TRACK & CHECKPOINTS
// ============================================================================
const TRACK_RADIUS = 138;
const TRACK_CONTROL_POINTS = [
  { x: 1650, y: 1850 },
  { x: 1100, y: 1850 },
  { x: 520,  y: 1820 },
  { x: 260,  y: 1450 },
  { x: 320,  y: 880  },
  { x: 640,  y: 420  },
  { x: 1220, y: 340  },
  { x: 1680, y: 650  },
  { x: 2150, y: 360  },
  { x: 2650, y: 580  },
  { x: 2740, y: 1220 },
  { x: 2350, y: 1780 }
];

function generateTrackSpline(points, subdivisions = 32) {
  const result = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    for (let step = 0; step < subdivisions; step++) {
      const t = step / subdivisions;
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      result.push({ x, y });
    }
  }
  return result;
}

const trackPoints = generateTrackSpline(TRACK_CONTROL_POINTS, 32);

for (let i = 0; i < trackPoints.length; i++) {
  const pt = trackPoints[i];
  const next = trackPoints[(i + 1) % trackPoints.length];
  const ahead = trackPoints[(i + 12) % trackPoints.length];
  pt.angle = Math.atan2(next.y - pt.y, next.x - pt.x);
  const aheadAngle = Math.atan2(ahead.y - pt.y, ahead.x - pt.x);
  let diff = aheadAngle - pt.angle;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  pt.curvature = diff;
}

const checkpoints = [];
const NUM_CHECKPOINTS = 8;
for (let i = 0; i < NUM_CHECKPOINTS; i++) {
  const idx = (38 + Math.floor((i * trackPoints.length) / NUM_CHECKPOINTS)) % trackPoints.length;
  const p = trackPoints[idx];
  checkpoints.push({ x: p.x, y: p.y, angle: p.angle, index: idx });
}

function getClosestTrackInfo(x, y) {
  let minDistSq = Infinity;
  let closestIdx = 0;
  for (let i = 0; i < trackPoints.length; i++) {
    const dx = x - trackPoints[i].x;
    const dy = y - trackPoints[i].y;
    const dSq = dx * dx + dy * dy;
    if (dSq < minDistSq) {
      minDistSq = dSq;
      closestIdx = i;
    }
  }
  const pt = trackPoints[closestIdx];
  return {
    dist: Math.sqrt(minDistSq),
    point: pt,
    trackAngle: pt.angle,
    curvature: pt.curvature,
    index: closestIdx
  };
}

// ============================================================================
// THREE.JS 3D WORLD (DARK NOIR / NIGHT HIGHWAY THEME)
// ============================================================================
const container = document.getElementById('canvasContainer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020306);
scene.fog = new THREE.FogExp2(0x020306, 0.00065);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 5000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const fxCanvas = document.getElementById('fxCanvas');
const fxCtx = fxCanvas.getContext('2d');
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener('resize', onWindowResize);
onWindowResize();

const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x05070a, 0.85);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0x94a3b8, 0.95);
dirLight.position.set(1500, 1800, 1200);
scene.add(dirLight);

const racingLineGroup = new THREE.Group();
scene.add(racingLineGroup);
let showRacingLine = true;
let checkpointBeacon = null;

function createClearAsphaltTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#0f1118';
  g.fillRect(0, 0, 512, 512);

  g.fillStyle = '#0a0c12';
  g.fillRect(96, 0, 320, 512);

  for (let i = 0; i < 3500; i++) {
    g.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.08)';
    g.fillRect(Math.random() * 512, Math.random() * 512, 2, 3);
  }

  g.fillStyle = 'rgba(255, 255, 255, 0.4)';
  g.fillRect(8, 0, 8, 512);
  g.fillRect(512 - 16, 0, 8, 512);

  g.fillStyle = 'rgba(56, 189, 248, 0.5)';
  g.fillRect(18, 0, 6, 512);
  g.fillRect(512 - 24, 0, 6, 512);

  g.fillStyle = 'rgba(255, 255, 255, 0.25)';
  g.fillRect(172, 40, 5, 170);
  g.fillRect(172, 290, 5, 170);
  g.fillRect(334, 40, 5, 170);
  g.fillRect(334, 290, 5, 170);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function createArrowChevronTexture(colorHexStr) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 128, 128);

  g.fillStyle = colorHexStr;
  g.beginPath();
  g.moveTo(115, 64);
  g.lineTo(25, 16);
  g.lineTo(52, 64);
  g.lineTo(25, 112);
  g.closePath();
  g.fill();

  return new THREE.CanvasTexture(c);
}

function createCornerSignTexture(isRight) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#090d16';
  g.fillRect(0, 0, 128, 64);
  g.strokeStyle = '#facc15';
  g.lineWidth = 4;
  g.strokeRect(2, 2, 124, 60);

  g.fillStyle = '#facc15';
  g.save();
  if (!isRight) {
    g.translate(128, 0);
    g.scale(-1, 1);
  }
  for (let x = 18; x <= 78; x += 30) {
    g.beginPath();
    g.moveTo(x, 12);
    g.lineTo(x + 22, 32);
    g.lineTo(x, 52);
    g.lineTo(x + 10, 52);
    g.lineTo(x + 32, 32);
    g.lineTo(x + 10, 12);
    g.closePath();
    g.fill();
  }
  g.restore();
  return new THREE.CanvasTexture(c);
}

function build3DWorld() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(12000, 12000),
    new THREE.MeshStandardMaterial({ color: 0x020305, roughness: 0.98 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(1500, -0.6, 1100);
  scene.add(ground);

  const grid = new THREE.GridHelper(9000, 120, 0x0ea5e9, 0x08090f);
  grid.position.set(1500, -0.3, 1100);
  scene.add(grid);

  const n = trackPoints.length;
  const positions = [], uvs = [], indices = [];
  const curbPositions = [], curbColors = [], curbIndices = [];
  const wallPositions = [], wallColors = [], wallIndices = [];

  let totalDist = 0;

  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const prevIdx = (i - 1 + n) % n;
    const nextIdx = (i + 1) % n;

    const pt = trackPoints[idx];
    const next = trackPoints[nextIdx];
    if (i > 0) {
      const prev = trackPoints[prevIdx];
      totalDist += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    }

    const dx = next.x - pt.x;
    const dy = next.y - pt.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const lx = pt.x + nx * TRACK_RADIUS;
    const lz = pt.y + ny * TRACK_RADIUS;
    const rx = pt.x - nx * TRACK_RADIUS;
    const rz = pt.y - ny * TRACK_RADIUS;

    positions.push(lx, 0.2, lz, rx, 0.2, rz);
    const vCoord = totalDist / 240;
    uvs.push(0, vCoord, 1, vCoord);

    const curbW = 20;
    const clx = pt.x + nx * (TRACK_RADIUS + curbW);
    const clz = pt.y + ny * (TRACK_RADIUS + curbW);
    const crx = pt.x - nx * (TRACK_RADIUS + curbW);
    const crz = pt.y - ny * (TRACK_RADIUS + curbW);

    curbPositions.push(clx, 0.55, clz, lx, 0.35, lz);
    curbPositions.push(rx, 0.35, rz, crx, 0.55, crz);

    const isRed = i % 2 === 0;
    const cR = isRed ? 0.95 : 0.98;
    const cG = isRed ? 0.18 : 0.98;
    const cB = isRed ? 0.25 : 1.0;
    for (let k = 0; k < 4; k++) curbColors.push(cR, cG, cB);

    const wallDist = TRACK_RADIUS + curbW + 4;
    const wallH = 9.5;
    const wlx = pt.x + nx * wallDist;
    const wlz = pt.y + ny * wallDist;
    const wrx = pt.x - nx * wallDist;
    const wrz = pt.y - ny * wallDist;

    wallPositions.push(wlx, 0, wlz, wlx, wallH, wlz);
    wallPositions.push(wrx, 0, wrz, wrx, wallH, wrz);

    const isTurn = Math.abs(pt.curvature) > 0.25;
    const wCol = isTurn ? [0.98, 0.45, 0.08] : [0.05, 0.65, 0.95];
    wallColors.push(0.08, 0.12, 0.22, wCol[0], wCol[1], wCol[2]);
    wallColors.push(0.08, 0.12, 0.22, wCol[0], wCol[1], wCol[2]);

    if (i < n) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);

      const cBase = i * 4;
      curbIndices.push(cBase, cBase + 1, cBase + 4, cBase + 1, cBase + 5, cBase + 4);
      curbIndices.push(cBase + 2, cBase + 3, cBase + 6, cBase + 3, cBase + 7, cBase + 6);

      wallIndices.push(cBase, cBase + 1, cBase + 4, cBase + 1, cBase + 5, cBase + 4);
      wallIndices.push(cBase + 4, cBase + 1, cBase, cBase + 4, cBase + 5, cBase + 1);
      wallIndices.push(cBase + 2, cBase + 3, cBase + 6, cBase + 3, cBase + 7, cBase + 6);
      wallIndices.push(cBase + 6, cBase + 3, cBase + 2, cBase + 6, cBase + 7, cBase + 3);
    }
  }

  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  roadGeo.setIndex(indices);
  roadGeo.computeVertexNormals();
  scene.add(new THREE.Mesh(roadGeo, new THREE.MeshStandardMaterial({
    map: createClearAsphaltTexture(),
    roughness: 0.45,
    metalness: 0.2
  })));

  const curbGeo = new THREE.BufferGeometry();
  curbGeo.setAttribute('position', new THREE.Float32BufferAttribute(curbPositions, 3));
  curbGeo.setAttribute('color', new THREE.Float32BufferAttribute(curbColors, 3));
  curbGeo.setIndex(curbIndices);
  scene.add(new THREE.Mesh(curbGeo, new THREE.MeshBasicMaterial({ vertexColors: true })));

  const wallGeo = new THREE.BufferGeometry();
  wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
  wallGeo.setAttribute('color', new THREE.Float32BufferAttribute(wallColors, 3));
  wallGeo.setIndex(wallIndices);
  scene.add(new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({ vertexColors: true })));

  const texGreen = createArrowChevronTexture('#4ade80');
  const texYellow = createArrowChevronTexture('#facc15');
  const texRed = createArrowChevronTexture('#fb923c');
  const arrowGeo = new THREE.PlaneGeometry(34, 34);
  arrowGeo.rotateX(-Math.PI / 2);

  for (let i = 0; i < n; i += 2) {
    const pt = trackPoints[i];
    const absCurve = Math.abs(pt.curvature);
    const tex = absCurve > 0.36 ? texRed : (absCurve > 0.18 ? texYellow : texGreen);
    const arrowMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMesh.position.set(pt.x, 0.52, pt.y);
    arrowMesh.rotation.y = -pt.angle;
    racingLineGroup.add(arrowMesh);
  }

  const signRightTex = createCornerSignTexture(true);
  const signLeftTex = createCornerSignTexture(false);
  const signGeo = new THREE.BoxGeometry(4, 18, 36);

  for (let i = 0; i < n; i += 5) {
    const pt = trackPoints[i];
    if (Math.abs(pt.curvature) > 0.28) {
      const nx = -Math.sin(pt.angle);
      const nz = Math.cos(pt.angle);
      const outsideSide = pt.curvature > 0 ? 1 : -1;
      const dist = TRACK_RADIUS + 34;

      const signMat = new THREE.MeshBasicMaterial({
        map: pt.curvature > 0 ? signRightTex : signLeftTex
      });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(pt.x + nx * dist * outsideSide, 14, pt.y + nz * dist * outsideSide);
      signMesh.rotation.y = -pt.angle;
      scene.add(signMesh);
    }
  }

  const beaconGroup = new THREE.Group();
  const ringGeo = new THREE.CylinderGeometry(TRACK_RADIUS * 0.9, TRACK_RADIUS * 0.9, 75, 32, 1, true);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.y = 37.5;
  beaconGroup.add(ringMesh);
  scene.add(beaconGroup);
  checkpointBeacon = beaconGroup;

  const cp0 = checkpoints[0];
  const archGroup = new THREE.Group();
  archGroup.position.set(cp0.x, 0, cp0.y);
  archGroup.rotation.y = -cp0.angle;

  const pillarGeo = new THREE.BoxGeometry(12, 95, 12);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
  const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
  leftPillar.position.set(0, 47.5, -TRACK_RADIUS - 16);
  const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
  rightPillar.position.set(0, 47.5, TRACK_RADIUS + 16);

  const bannerGeo = new THREE.BoxGeometry(18, 22, (TRACK_RADIUS + 20) * 2);
  const bannerMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
  const topBanner = new THREE.Mesh(bannerGeo, bannerMat);
  topBanner.position.set(0, 92, 0);

  const checkCanvas = document.createElement('canvas');
  checkCanvas.width = 64;
  checkCanvas.height = 512;
  const cCtx = checkCanvas.getContext('2d');
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 2; c++) {
      cCtx.fillStyle = (r + c) % 2 === 0 ? '#ffffff' : '#090d16';
      cCtx.fillRect(c * 32, r * 32, 32, 32);
    }
  }
  const checkMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(30, TRACK_RADIUS * 2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(checkCanvas) })
  );
  checkMesh.rotation.x = -Math.PI / 2;
  checkMesh.position.y = 0.58;

  archGroup.add(leftPillar, rightPillar, topBanner, checkMesh);
  scene.add(archGroup);

  const buildingTex = createBuildingWindowTexture();
  for (let i = 0; i < 150; i++) {
    const bx = -800 + Math.random() * 4800;
    const bz = -700 + Math.random() * 3600;
    const info = getClosestTrackInfo(bx, bz);
    if (info.dist < TRACK_RADIUS + 155) continue;

    const w = 65 + Math.random() * 95;
    const d = 65 + Math.random() * 95;
    const h = 120 + Math.random() * 420;

    const bMesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0xffffff,
        emissiveMap: buildingTex,
        emissiveIntensity: 0.65,
        roughness: 0.3
      })
    );
    bMesh.position.set(bx, h / 2, bz);
    scene.add(bMesh);
  }
}

function createBuildingWindowTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#000000';
  g.fillRect(0, 0, 128, 256);

  const winColors = ['#38bdf8', '#fde047', '#f472b6', '#e2e8f0'];
  for (let y = 8; y < 248; y += 14) {
    for (let x = 8; x < 120; x += 16) {
      if (Math.random() > 0.42) {
        g.fillStyle = winColors[Math.floor(Math.random() * winColors.length)];
        g.fillRect(x, y, 8, 8);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

build3DWorld();

// ============================================================================
// CAR 3D MESH GENERATION
// ============================================================================
function create3DSportsCar(colorObj) {
  const root = new THREE.Group();
  const bodyTiltGroup = new THREE.Group();
  root.add(bodyTiltGroup);

  const primaryHex = colorObj.hex || new THREE.Color(colorObj.primary).getHex();
  const paintMat = new THREE.MeshStandardMaterial({ color: primaryHex, metalness: 0.72, roughness: 0.22 });
  const carbonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5, roughness: 0.4 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.95, roughness: 0.08 });

  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(50, 9.5, 25), paintMat);
  mainBody.position.set(0, 7.2, 0);
  bodyTiltGroup.add(mainBody);

  const splitter = new THREE.Mesh(new THREE.BoxGeometry(6, 2.5, 26.5), carbonMat);
  splitter.position.set(24, 3.8, 0);
  bodyTiltGroup.add(splitter);

  const skirt = new THREE.Mesh(new THREE.BoxGeometry(32, 2.5, 27), carbonMat);
  skirt.position.set(0, 3.8, 0);
  bodyTiltGroup.add(skirt);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(24, 7.5, 20), glassMat);
  cabin.position.set(-3, 14.8, 0);
  bodyTiltGroup.add(cabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, 18), paintMat);
  roof.position.set(-4, 18.6, 0);
  bodyTiltGroup.add(roof);

  const wingStands = new THREE.Mesh(new THREE.BoxGeometry(3, 7, 16), carbonMat);
  wingStands.position.set(-22, 14, 0);
  const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(7, 1.6, 27), carbonMat);
  wingBlade.position.set(-23, 17.8, 0);
  wingBlade.rotation.z = 0.12;
  bodyTiltGroup.add(wingStands, wingBlade);

  const headMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
  const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 6), headMat);
  hlLeft.position.set(24.5, 8.5, -8.5);
  const hlRight = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 6), headMat);
  hlRight.position.set(24.5, 8.5, 8.5);
  bodyTiltGroup.add(hlLeft, hlRight);

  const beamCanvas = document.createElement('canvas');
  beamCanvas.width = 128;
  beamCanvas.height = 128;
  const bCtx = beamCanvas.getContext('2d');
  const bGrad = bCtx.createLinearGradient(0, 64, 128, 64);
  bGrad.addColorStop(0, 'rgba(224, 242, 254, 0.38)');
  bGrad.addColorStop(1, 'rgba(224, 242, 254, 0)');
  bCtx.fillStyle = bGrad;
  bCtx.beginPath();
  bCtx.moveTo(0, 48);
  bCtx.lineTo(128, 8);
  bCtx.lineTo(128, 120);
  bCtx.lineTo(0, 80);
  bCtx.closePath();
  bCtx.fill();
  const beamMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(110, 56),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(beamCanvas),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  beamMesh.rotation.x = -Math.PI / 2;
  beamMesh.position.set(80, 0.65, 0);
  root.add(beamMesh);

  const tailMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
  const tailLight = new THREE.Mesh(new THREE.BoxGeometry(2, 3.2, 22), tailMat);
  tailLight.position.set(-24.6, 9.2, 0);
  bodyTiltGroup.add(tailLight);

  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 128;
  glowCanvas.height = 128;
  const gCtx = glowCanvas.getContext('2d');
  const grad = gCtx.createRadialGradient(64, 64, 8, 64, 64, 60);
  grad.addColorStop(0, colorObj.glow || colorObj.primary);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  gCtx.fillStyle = grad;
  gCtx.fillRect(0, 0, 128, 128);
  const underglow = new THREE.Mesh(
    new THREE.PlaneGeometry(66, 44),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(glowCanvas),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.62;
  root.add(underglow);

  const flameGeo = new THREE.ConeGeometry(2.6, 18, 8);
  flameGeo.rotateZ(Math.PI / 2);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const flameL = new THREE.Mesh(flameGeo, flameMat);
  flameL.position.set(-34, 4.8, -6);
  const flameR = new THREE.Mesh(flameGeo, flameMat);
  flameR.position.set(-34, 4.8, 6);
  flameL.visible = false;
  flameR.visible = false;
  bodyTiltGroup.add(flameL, flameR);

  const wheelGeo = new THREE.CylinderGeometry(5.2, 5.2, 4.6, 16).rotateX(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.8 });
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });

  const makeWheel = (x, z) => {
    const wGroup = new THREE.Group();
    wGroup.position.set(x, 5.2, z);
    const tire = new THREE.Mesh(wheelGeo, tireMat);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 4.8, 8).rotateX(Math.PI / 2), rimMat);
    wGroup.add(tire, rim);
    root.add(wGroup);
    return wGroup;
  };

  const wheelFL = makeWheel(15.5, -13);
  const wheelFR = makeWheel(15.5, 13);
  const wheelRL = makeWheel(-15.5, -13);
  const wheelRR = makeWheel(-15.5, 13);

  const nameCanvas = document.createElement('canvas');
  nameCanvas.width = 256;
  nameCanvas.height = 64;
  const nameTex = new THREE.CanvasTexture(nameCanvas);
  const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: nameTex, transparent: true }));
  nameSprite.position.set(0, 29, 0);
  nameSprite.scale.set(44, 11, 1);
  root.add(nameSprite);

  const updateLabel = (text, colorStr) => {
    const nCtx = nameCanvas.getContext('2d');
    nCtx.clearRect(0, 0, 256, 64);
    nCtx.fillStyle = 'rgba(9, 13, 28, 0.82)';
    nCtx.beginPath();
    nCtx.roundRect(18, 10, 220, 42, 12);
    nCtx.fill();
    nCtx.strokeStyle = colorStr || '#38bdf8';
    nCtx.lineWidth = 3;
    nCtx.stroke();
    nCtx.font = 'bold 22px "Segoe UI", sans-serif';
    nCtx.fillStyle = '#ffffff';
    nCtx.textAlign = 'center';
    nCtx.fillText(text, 128, 39);
    nameTex.needsUpdate = true;
  };

  scene.add(root);
  return { root, bodyTiltGroup, paintMat, tailMat, flameL, flameR, wheelFL, wheelFR, wheelRL, wheelRR, updateLabel };
}

// ============================================================================
// AUDIO
// ============================================================================
let audioCtx = null;
let engineOsc = null;
let engineGain = null;
let screechGain = null;
let soundEnabled = true;

function initEngineAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    engineOsc = audioCtx.createOscillator();
    const subOsc = audioCtx.createOscillator();
    engineGain = audioCtx.createGain();

    engineOsc.type = 'sawtooth';
    subOsc.type = 'triangle';
    engineOsc.frequency.value = 65;
    subOsc.frequency.value = 32.5;
    engineGain.gain.value = 0.04;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 340;

    engineOsc.connect(filter);
    subOsc.connect(filter);
    filter.connect(engineGain);
    engineGain.connect(audioCtx.destination);
    engineOsc.start();
    subOsc.start();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const screechFilter = audioCtx.createBiquadFilter();
    screechFilter.type = 'bandpass';
    screechFilter.frequency.value = 1150;
    screechFilter.Q.value = 4.5;

    screechGain = audioCtx.createGain();
    screechGain.gain.value = 0;

    whiteNoise.connect(screechFilter);
    screechFilter.connect(screechGain);
    screechGain.connect(audioCtx.destination);
    whiteNoise.start();
  } catch (e) {}
}

function updateEngineAudio(speed, drifting, nitroActive) {
  if (!audioCtx || !soundEnabled || !gameStarted) {
    if (engineGain) engineGain.gain.value = 0;
    if (screechGain) screechGain.gain.value = 0;
    return;
  }
  const normSpeed = Math.min(1, speed / 850);
  const gearProgress = (normSpeed * 5) % 1;
  const baseFreq = 58 + normSpeed * 95 + gearProgress * 55 + (nitroActive ? 35 : 0);
  engineOsc.frequency.setTargetAtTime(baseFreq, audioCtx.currentTime, 0.05);
  engineGain.gain.setTargetAtTime(0.045, audioCtx.currentTime, 0.05);

  const targetScreech = drifting ? Math.min(0.04, (speed / 700) * 0.035) : 0;
  screechGain.gain.setTargetAtTime(targetScreech, audioCtx.currentTime, 0.06);
}

// ============================================================================
// GAME STATE & LOCAL CAR
// ============================================================================
let myId = null;
let mySlot = 0;
let ws = null;
let pingMs = 0;
let cameraMode = 0;
let gameStarted = false;

let gameState = {
  status: 'lobby',
  totalLaps: 3,
  countdownStart: 0,
  raceStartTime: 0,
  hostId: null,
  winner: null
};

const localCar = {
  x: 1260,
  y: 1815,
  vx: 0,
  vy: 0,
  angle: Math.PI,
  angularVelocity: 0,
  steerAngle: 0,
  drifting: false,
  driftScore: 0,
  nitro: 100,
  nitroActive: false,
  lap: 1,
  checkpoint: 0,
  lapStartTime: 0,
  bestLapTime: 0,
  finished: false,
  color: CAR_COLORS[0],
  name: 'Racer #1',
  mesh: create3DSportsCar(CAR_COLORS[0])
};
localCar.mesh.updateLabel('★ ' + localCar.name, localCar.color.primary);

const remotePlayers = new Map();
const aiBots = [];

const smokeParticles = [];
const smokeGeo = new THREE.SphereGeometry(2.5, 6, 6);
const smokeMat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.45 });

const skidGroup = new THREE.Group();
scene.add(skidGroup);
const skidGeo = new THREE.PlaneGeometry(4.5, 3.2).rotateX(-Math.PI / 2);
const skidMat = new THREE.MeshBasicMaterial({ color: 0x05070c, transparent: true, opacity: 0.68, depthWrite: false });
const skidMeshes = [];

function spawn3DDriftEffects(car) {
  const cosA = Math.cos(car.angle);
  const sinA = Math.sin(car.angle);
  const rightX = -sinA;
  const rightZ = cosA;

  for (const side of [-12.5, 12.5]) {
    const wx = car.x - cosA * 15.5 + rightX * side;
    const wz = car.y - sinA * 15.5 + rightZ * side;

    const skid = new THREE.Mesh(skidGeo, skidMat);
    skid.position.set(wx, 0.38, wz);
    skid.rotation.y = -car.angle;
    skidGroup.add(skid);
    skidMeshes.push(skid);
    if (skidMeshes.length > 500) skidGroup.remove(skidMeshes.shift());

    if (Math.random() < 0.45) {
      const puff = new THREE.Mesh(smokeGeo, smokeMat.clone());
      puff.position.set(wx + (Math.random() - 0.5) * 4, 2.2, wz + (Math.random() - 0.5) * 4);
      scene.add(puff);
      smokeParticles.push({ mesh: puff, vy: 14 + Math.random() * 10, scale: 1, alpha: 0.45 });
    }
  }
}

function update3DParticles(dt) {
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    const p = smokeParticles[i];
    p.mesh.position.y += p.vy * dt;
    p.scale += dt * 4.5;
    p.mesh.scale.setScalar(p.scale);
    p.alpha -= dt * 0.9;
    p.mesh.material.opacity = Math.max(0, p.alpha);
    if (p.alpha <= 0) {
      scene.remove(p.mesh);
      smokeParticles.splice(i, 1);
    }
  }
}

// ============================================================================
// CONTROLS & INPUT
// ============================================================================
const keys = { up: false, down: false, left: false, right: false, handbrake: false, nitro: false };

window.addEventListener('keydown', (e) => {
  if (document.activeElement === document.getElementById('playerNameInput')) return;
  if (!gameStarted && (e.code === 'Enter' || e.code === 'Space')) {
    startGame();
    return;
  }
  initEngineAudio();

  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp': keys.up = true; break;
    case 'KeyS':
    case 'ArrowDown': keys.down = true; break;
    case 'KeyA':
    case 'ArrowLeft': keys.left = true; break;
    case 'KeyD':
    case 'ArrowRight': keys.right = true; break;
    case 'Space': keys.handbrake = true; e.preventDefault(); break;
    case 'ShiftLeft':
    case 'ShiftRight': keys.nitro = true; e.preventDefault(); break;
    case 'KeyC': toggleCameraMode(); break;
    case 'KeyG': toggleRacingGuide(); break;
    case 'KeyR': respawnCarOnTrack(); break;
    case 'Escape': toggleSettingsModal(); break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp': keys.up = false; break;
    case 'KeyS':
    case 'ArrowDown': keys.down = false; break;
    case 'KeyA':
    case 'ArrowLeft': keys.left = false; break;
    case 'KeyD':
    case 'ArrowRight': keys.right = false; break;
    case 'Space': keys.handbrake = false; break;
    case 'ShiftLeft':
    case 'ShiftRight': keys.nitro = false; break;
  }
});

function toggleCameraMode() {
  cameraMode = (cameraMode + 1) % 3;
  const names = ['Chase (หลังรถ)', 'Action (ใกล้)', 'Hood (หน้ารถ)'];
  const btn = document.getElementById('camBtn');
  if (btn) btn.textContent = names[cameraMode];
}

function toggleRacingGuide() {
  showRacingLine = !showRacingLine;
  racingLineGroup.visible = showRacingLine;
  const btn = document.getElementById('guideBtn');
  if (btn) btn.textContent = showRacingLine ? 'เปิด' : 'ปิด';
}

function respawnCarOnTrack() {
  const info = getClosestTrackInfo(localCar.x, localCar.y);
  localCar.x = info.point.x;
  localCar.y = info.point.y;
  localCar.vx = 0;
  localCar.vy = 0;
  localCar.angularVelocity = 0;
  localCar.angle = info.trackAngle;
}

// ============================================================================
// CAR PHYSICS
// ============================================================================
function updateCarPhysics(car, input, dt) {
  if (gameState.status === 'countdown') {
    car.vx = 0;
    car.vy = 0;
    car.angularVelocity = 0;
    syncCar3DMesh(car, 0, false);
    return;
  }

  const trackInfo = getClosestTrackInfo(car.x, car.y);
  const onShoulder = trackInfo.dist > TRACK_RADIUS - 4;
  const hitBarrier = trackInfo.dist > TRACK_RADIUS + 20;

  const cosA = Math.cos(car.angle);
  const sinA = Math.sin(car.angle);
  const rightX = -sinA;
  const rightY = cosA;

  let forwardVel = car.vx * cosA + car.vy * sinA;
  let lateralVel = car.vx * rightX + car.vy * rightY;
  const speed = Math.hypot(car.vx, car.vy);

  const targetSteer = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  car.steerAngle += (targetSteer - car.steerAngle) * Math.min(1, dt * 11);

  const ENGINE_POWER = 790;
  const REVERSE_POWER = 440;
  const BRAKE_POWER = 1050;

  let accel = 0;
  if (input.up) {
    accel = ENGINE_POWER;
  } else if (input.down) {
    accel = forwardVel > 30 ? -BRAKE_POWER : -REVERSE_POWER;
  }

  car.nitroActive = false;
  if (input.nitro && car.nitro > 1 && input.up) {
    car.nitroActive = true;
    accel *= 1.62;
    car.nitro = Math.max(0, car.nitro - dt * 30);
  } else {
    car.nitro = Math.min(100, car.nitro + dt * 4);
  }

  forwardVel += accel * dt;

  const speedFactor = Math.min(1, speed / 130);
  const reverseDir = forwardVel >= -10 ? 1 : -1;
  const turnRate = input.handbrake ? 3.75 : 2.75;

  const targetAngularVel = car.steerAngle * turnRate * speedFactor * reverseDir;
  car.angularVelocity += (targetAngularVel - car.angularVelocity) * Math.min(1, dt * 10);
  car.angle += car.angularVelocity * dt;

  const slipAngle = Math.abs(Math.atan2(lateralVel, Math.abs(forwardVel) + 1));
  const isPowersliding = input.handbrake || (slipAngle > 0.32 && speed > 220);

  let lateralGrip = 9.0;
  if (input.handbrake) lateralGrip = 1.6;
  else if (isPowersliding) lateralGrip = 3.0;
  if (onShoulder) lateralGrip *= 0.72;

  lateralVel *= Math.exp(-lateralGrip * dt);

  let drag = input.handbrake ? 1.02 : 0.62;
  if (onShoulder) drag = 1.6;
  forwardVel *= Math.exp(-drag * dt);

  const maxSpeed = car.nitroActive ? 1020 : 770;
  if (forwardVel > maxSpeed) forwardVel = maxSpeed;
  if (forwardVel < -260) forwardVel = -260;

  const newCos = Math.cos(car.angle);
  const newSin = Math.sin(car.angle);
  const newRightX = -newSin;
  const newRightY = newCos;

  car.vx = newCos * forwardVel + newRightX * lateralVel;
  car.vy = newSin * forwardVel + newRightY * lateralVel;

  car.x += car.vx * dt;
  car.y += car.vy * dt;

  if (hitBarrier) {
    const dx = car.x - trackInfo.point.x;
    const dy = car.y - trackInfo.point.y;
    const dist = Math.hypot(dx, dy) || 1;
    const maxAllowed = TRACK_RADIUS + 20;
    car.x = trackInfo.point.x + (dx / dist) * maxAllowed;
    car.y = trackInfo.point.y + (dy / dist) * maxAllowed;
    car.vx *= 0.82;
    car.vy *= 0.82;
  }

  car.drifting = (Math.abs(lateralVel) > 85 && speed > 150) || (input.handbrake && speed > 160);
  if (car.drifting) {
    car.nitro = Math.min(100, car.nitro + dt * 18);
    if (car === localCar) car.driftScore += Math.round(Math.abs(lateralVel) * dt * 0.95);
    spawn3DDriftEffects(car);
  } else if (car === localCar) {
    car.driftScore = 0;
  }

  syncCar3DMesh(car, lateralVel, input.down || input.handbrake);
  updateCheckpointsAndLaps(car);
}

function syncCar3DMesh(car, lateralVel = 0, braking = false) {
  if (!car.mesh) return;
  const m = car.mesh;
  m.root.position.set(car.x, 0, car.y);
  m.root.rotation.y = -car.angle;

  const targetRoll = THREE.MathUtils.clamp(lateralVel * 0.00055, -0.14, 0.14);
  m.bodyTiltGroup.rotation.x += (targetRoll - m.bodyTiltGroup.rotation.x) * 0.2;

  const steerYaw = -car.steerAngle * 0.48;
  m.wheelFL.rotation.y = steerYaw;
  m.wheelFR.rotation.y = steerYaw;

  m.tailMat.color.setHex((braking || car.drifting) ? 0xff0044 : 0x7f1d1d);

  m.flameL.visible = Boolean(car.nitroActive);
  m.flameR.visible = Boolean(car.nitroActive);
  if (car.nitroActive) {
    const flicker = 0.8 + Math.random() * 0.5;
    m.flameL.scale.set(flicker, 1, 1);
    m.flameR.scale.set(flicker, 1, 1);
  }
}

function updateCheckpointsAndLaps(car) {
  if (car.finished) return;
  const nextCpIdx = (car.checkpoint + 1) % checkpoints.length;
  const cp = checkpoints[nextCpIdx];
  const dist = Math.hypot(car.x - cp.x, car.y - cp.y);

  if (dist < TRACK_RADIUS + 60) {
    car.checkpoint = nextCpIdx;
    if (nextCpIdx === 0) {
      const now = performance.now();
      if (car.lapStartTime > 0) {
        const lapTime = now - car.lapStartTime;
        if (car.bestLapTime === 0 || lapTime < car.bestLapTime) {
          car.bestLapTime = Math.round(lapTime);
        }
      }
      car.lapStartTime = now;

      if (gameState.status === 'racing') {
        if (car.lap >= gameState.totalLaps) {
          car.finished = true;
          if (car === localCar && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'finish_race' }));
          }
        } else {
          car.lap++;
        }
      } else {
        car.lap++;
      }
    }
  }
}

function resolveCarCollisions() {
  const allCars = [localCar, ...aiBots, ...Array.from(remotePlayers.values())];
  const CAR_RADIUS = 25;

  for (let i = 0; i < allCars.length; i++) {
    for (let j = i + 1; j < allCars.length; j++) {
      const a = allCars[i];
      const b = allCars[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = CAR_RADIUS * 2;

      if (dist > 0 && dist < minDist) {
        const overlap = (minDist - dist) * 0.5;
        const nx = dx / dist;
        const ny = dy / dist;

        if (a === localCar || a.isBot) {
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          a.vx -= nx * 100;
          a.vy -= ny * 100;
        }
        if (b === localCar || b.isBot) {
          b.x += nx * overlap;
          b.y += ny * overlap;
          b.vx += nx * 100;
          b.vy += ny * 100;
        }
      }
    }
  }
}

function addAiBot() {
  const totalCars = 1 + remotePlayers.size + aiBots.length;
  if (totalCars >= 6) return;

  const slot = totalCars;
  const color = CAR_COLORS[slot % CAR_COLORS.length];
  const mesh = create3DSportsCar(color);
  const name = `AI #${aiBots.length + 1}`;
  mesh.updateLabel(name, color.primary);

  aiBots.push({
    id: 'bot_' + Math.random().toString(36).slice(2, 7),
    name,
    isBot: true,
    color,
    mesh,
    x: 1260 + slot * 46,
    y: 1815 + (slot % 2) * 70,
    vx: 0,
    vy: 0,
    angle: Math.PI,
    angularVelocity: 0,
    steerAngle: 0,
    drifting: false,
    nitro: 100,
    nitroActive: false,
    lap: 1,
    checkpoint: 0,
    lapStartTime: performance.now(),
    bestLapTime: 0,
    finished: false,
    targetIndex: 44
  });
}

function updateAiBots(dt) {
  for (const bot of aiBots) {
    const currentPt = trackPoints[bot.targetIndex];
    const dist = Math.hypot(currentPt.x - bot.x, currentPt.y - bot.y);
    if (dist < 185) {
      bot.targetIndex = (bot.targetIndex + 6) % trackPoints.length;
    }

    const aimPt = trackPoints[bot.targetIndex];
    const desiredAngle = Math.atan2(aimPt.y - bot.y, aimPt.x - bot.x);
    let diff = desiredAngle - bot.angle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    const botInput = {
      up: true,
      down: false,
      left: diff < -0.09,
      right: diff > 0.09,
      handbrake: Math.abs(diff) > 0.65 && Math.hypot(bot.vx, bot.vy) > 380,
      nitro: Math.abs(diff) < 0.16 && bot.nitro > 55
    };

    updateCarPhysics(bot, botInput, dt);
  }
}

// ============================================================================
// CAMERA & TURN NAVIGATOR
// ============================================================================
const camPos = new THREE.Vector3(1400, 60, 1815);
const camLook = new THREE.Vector3(1200, 15, 1815);

function update3DCamera(dt) {
  if (checkpointBeacon) {
    const nextCp = checkpoints[(localCar.checkpoint + 1) % checkpoints.length];
    checkpointBeacon.position.set(nextCp.x, 0, nextCp.y);
    checkpointBeacon.rotation.y += dt * 1.2;
  }

  const speed = Math.hypot(localCar.vx, localCar.vy);
  const velAngle = speed > 65 ? Math.atan2(localCar.vy, localCar.vx) : localCar.angle;

  let angleDiff = velAngle - localCar.angle;
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
  const chaseAngle = localCar.angle + angleDiff * 0.42;

  const cosC = Math.cos(chaseAngle);
  const sinC = Math.sin(chaseAngle);

  let distBack = 92;
  let heightUp = 38;
  let lookAhead = 72;

  if (cameraMode === 1) {
    distBack = 66;
    heightUp = 24;
    lookAhead = 85;
  } else if (cameraMode === 2) {
    distBack = -8;
    heightUp = 15.5;
    lookAhead = 160;
  }

  if (localCar.nitroActive && cameraMode !== 2) distBack += 14;

  const targetX = localCar.x - cosC * distBack;
  const targetZ = localCar.y - sinC * distBack;
  const targetY = heightUp;

  const lerpRate = cameraMode === 2 ? 0.55 : Math.min(1, dt * 10.5);
  camPos.x += (targetX - camPos.x) * lerpRate;
  camPos.y += (targetY - camPos.y) * lerpRate;
  camPos.z += (targetZ - camPos.z) * lerpRate;

  const lookX = localCar.x + Math.cos(localCar.angle) * lookAhead;
  const lookZ = localCar.y + Math.sin(localCar.angle) * lookAhead;
  camLook.x += (lookX - camLook.x) * Math.min(1, dt * 14);
  camLook.y += (12 - camLook.y) * Math.min(1, dt * 14);
  camLook.z += (lookZ - camLook.z) * Math.min(1, dt * 14);

  camera.position.copy(camPos);
  camera.lookAt(camLook);

  const targetFov = localCar.nitroActive ? 84 : 64 + (speed / 950) * 11;
  camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 8);
  camera.updateProjectionMatrix();
}

function updateTurnNavigatorHud() {
  const info = getClosestTrackInfo(localCar.x, localCar.y);

  let headingDiff = localCar.angle - info.trackAngle;
  while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
  while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;

  const wrongWayEl = document.getElementById('wrongWayBanner');
  if (Math.abs(headingDiff) > 1.95 && Math.hypot(localCar.vx, localCar.vy) > 90) {
    wrongWayEl.classList.remove('hidden');
  } else {
    wrongWayEl.classList.add('hidden');
  }

  const lookIdx = (info.index + 16) % trackPoints.length;
  const aheadCurve = trackPoints[lookIdx].curvature;
  const absC = Math.abs(aheadCurve);

  const card = document.getElementById('turnIndicator');
  const icon = document.getElementById('turnArrow');
  const title = document.getElementById('turnTitle');

  if (absC > 0.36) {
    card.className = 'turn-card sharp';
    icon.textContent = aheadCurve > 0 ? '⤵' : '⤴';
    title.textContent = aheadCurve > 0 ? 'SHARP RIGHT DRIFT!' : 'SHARP LEFT DRIFT!';
  } else if (absC > 0.18) {
    card.className = 'turn-card medium';
    icon.textContent = aheadCurve > 0 ? '↗' : '↖';
    title.textContent = aheadCurve > 0 ? 'RIGHT CURVE' : 'LEFT CURVE';
  } else {
    card.className = 'turn-card straight';
    icon.textContent = '⬆';
    title.textContent = 'STRAIGHT AHEAD';
  }
}

// ============================================================================
// HUD INSTRUMENTS
// ============================================================================
const tachoCanvas = document.getElementById('tachoCanvas');
const tachoCtx = tachoCanvas.getContext('2d');
const miniCanvas = document.getElementById('minimapCanvas');
const miniCtx = miniCanvas.getContext('2d');

function drawTachometer(speed, nitroActive) {
  tachoCtx.clearRect(0, 0, 200, 200);
  const cx = 100, cy = 100, r = 82;
  const startAngle = Math.PI * 0.75;
  const endAngle = Math.PI * 2.25;

  tachoCtx.beginPath();
  tachoCtx.arc(cx, cy, r, startAngle, endAngle);
  tachoCtx.strokeStyle = 'rgba(51, 65, 85, 0.55)';
  tachoCtx.lineWidth = 12;
  tachoCtx.lineCap = 'round';
  tachoCtx.stroke();

  const kmh = Math.round(speed * 0.34);
  let gear = 1;
  if (kmh > 250) gear = 6;
  else if (kmh > 200) gear = 5;
  else if (kmh > 145) gear = 4;
  else if (kmh > 95) gear = 3;
  else if (kmh > 45) gear = 2;

  const rpmRatio = kmh < 3 ? 0.08 : Math.min(1, ((kmh % 55) / 55) * 0.65 + (kmh / 320) * 0.45);
  const rpmAngle = startAngle + (endAngle - startAngle) * rpmRatio;

  const grad = tachoCtx.createLinearGradient(0, 200, 200, 0);
  grad.addColorStop(0, '#38bdf8');
  grad.addColorStop(0.7, '#a855f7');
  grad.addColorStop(1, '#f43f5e');

  tachoCtx.beginPath();
  tachoCtx.arc(cx, cy, r, startAngle, rpmAngle);
  tachoCtx.strokeStyle = grad;
  tachoCtx.lineWidth = 12;
  tachoCtx.lineCap = 'round';
  tachoCtx.stroke();

  tachoCtx.save();
  tachoCtx.translate(cx, cy);
  tachoCtx.rotate(rpmAngle);
  tachoCtx.beginPath();
  tachoCtx.moveTo(-10, 0);
  tachoCtx.lineTo(r - 6, 0);
  tachoCtx.strokeStyle = nitroActive ? '#22d3ee' : '#f43f5e';
  tachoCtx.lineWidth = 4;
  tachoCtx.stroke();
  tachoCtx.restore();

  document.getElementById('gearBox').textContent = kmh < 2 ? 'N' : gear;
  document.getElementById('speedVal').textContent = kmh;
}

function drawSpeedLines(speed, nitroActive) {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  if (!nitroActive && speed < 680) return;

  const cx = fxCanvas.width / 2;
  const cy = fxCanvas.height / 2;
  const count = nitroActive ? 26 : 10;

  fxCtx.save();
  fxCtx.strokeStyle = nitroActive ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.16)';
  fxCtx.lineWidth = 2;

  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r1 = 220 + Math.random() * 180;
    const r2 = r1 + 140 + Math.random() * 200;
    fxCtx.beginPath();
    fxCtx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    fxCtx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    fxCtx.stroke();
  }
  fxCtx.restore();
}

function drawRadarMinimap() {
  miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
  const scaleX = miniCanvas.width / 3100;
  const scaleY = miniCanvas.height / 2250;

  miniCtx.save();
  miniCtx.scale(scaleX, scaleY);

  miniCtx.beginPath();
  miniCtx.moveTo(trackPoints[0].x, trackPoints[0].y);
  for (let i = 1; i < trackPoints.length; i++) {
    miniCtx.lineTo(trackPoints[i].x, trackPoints[i].y);
  }
  miniCtx.closePath();
  miniCtx.strokeStyle = '#334155';
  miniCtx.lineWidth = 175;
  miniCtx.stroke();

  miniCtx.strokeStyle = '#38bdf8';
  miniCtx.lineWidth = 35;
  miniCtx.stroke();

  const nextCp = checkpoints[(localCar.checkpoint + 1) % checkpoints.length];
  miniCtx.fillStyle = '#4ade80';
  miniCtx.beginPath();
  miniCtx.arc(nextCp.x, nextCp.y, 95, 0, Math.PI * 2);
  miniCtx.fill();

  for (const rp of remotePlayers.values()) {
    miniCtx.fillStyle = rp.color?.primary || '#f43f5e';
    miniCtx.beginPath();
    miniCtx.arc(rp.x, rp.y, 75, 0, Math.PI * 2);
    miniCtx.fill();
  }
  for (const bot of aiBots) {
    miniCtx.fillStyle = bot.color.primary;
    miniCtx.beginPath();
    miniCtx.arc(bot.x, bot.y, 75, 0, Math.PI * 2);
    miniCtx.fill();
  }

  miniCtx.save();
  miniCtx.translate(localCar.x, localCar.y);
  miniCtx.rotate(localCar.angle);
  miniCtx.fillStyle = '#ffffff';
  miniCtx.beginPath();
  miniCtx.moveTo(130, 0);
  miniCtx.lineTo(-90, -85);
  miniCtx.lineTo(-90, 85);
  miniCtx.closePath();
  miniCtx.fill();
  miniCtx.restore();

  miniCtx.restore();
}

function updateHud() {
  const speed = Math.hypot(localCar.vx, localCar.vy);
  drawTachometer(speed, localCar.nitroActive);
  drawSpeedLines(speed, localCar.nitroActive);
  drawRadarMinimap();
  updateTurnNavigatorHud();
  updateEngineAudio(speed, localCar.drifting, localCar.nitroActive);

  const nosPct = Math.round(localCar.nitro);
  document.getElementById('nitroFill').style.width = `${nosPct}%`;
  document.getElementById('nosPct').textContent = `${nosPct}%`;
  document.getElementById('lapVal').textContent = `${localCar.lap}/${gameState.totalLaps}`;

  const all = [localCar, ...Array.from(remotePlayers.values()), ...aiBots];
  all.sort((a, b) => (b.lap * 100 + b.checkpoint) - (a.lap * 100 + a.checkpoint));
  const myPos = all.indexOf(localCar) + 1;
  document.getElementById('posVal').textContent = `${myPos}/${all.length}`;

  const driftBanner = document.getElementById('driftBanner');
  if (localCar.driftScore > 25) {
    driftBanner.classList.remove('hidden');
    document.getElementById('driftPoints').textContent = `+${localCar.driftScore} PTS`;
  } else {
    driftBanner.classList.add('hidden');
  }

  if (gameState.status === 'racing' && gameState.raceStartTime > 0) {
    const elapsed = (Date.now() - gameState.raceStartTime) / 1000;
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = (elapsed % 60).toFixed(1).padStart(4, '0');
    document.getElementById('timeVal').textContent = `${mins}:${secs}`;
  }

  const overlay = document.getElementById('centerOverlay');
  const countText = document.getElementById('countdownText');
  const subText = document.getElementById('subOverlayText');

  if (gameState.status === 'countdown') {
    overlay.classList.remove('hidden');
    const elapsed = (Date.now() - gameState.countdownStart) / 1000;
    const rem = Math.ceil(3 - elapsed);
    if (rem > 0) {
      countText.textContent = rem;
      subText.textContent = 'เตรียมออกตัว!';
    } else {
      countText.textContent = 'GO!!';
      subText.textContent = 'สาดดริฟต์ด้วย Spacebar!';
    }
  } else if (gameState.winner) {
    overlay.classList.remove('hidden');
    countText.textContent = '🏆 WINNER!';
    subText.textContent = `อันดับ 1: ${gameState.winner.name} (${(gameState.winner.time / 1000).toFixed(2)}s)`;
  } else {
    overlay.classList.add('hidden');
  }
}

// ============================================================================
// WEBSOCKET SYNC
// ============================================================================
function connectWebSocket() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${proto}//${location.host}`);

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === 'welcome') {
      myId = msg.id;
      mySlot = msg.slot;
      gameState = msg.gameState;
      const me = msg.players.find(p => p.id === myId);
      if (me) {
        localCar.x = me.x;
        localCar.y = me.y;
        localCar.angle = me.angle;
        localCar.name = me.name;
        const cObj = CAR_COLORS.find(c => c.name === me.color?.name) || CAR_COLORS[mySlot % 6];
        localCar.color = cObj;
        localCar.mesh.paintMat.color.setHex(cObj.hex);
        localCar.mesh.updateLabel('★ ' + localCar.name, cObj.primary);
        document.getElementById('playerNameInput').value = me.name;
      }
      syncRoomPlayers(msg.players);
      renderColorPicker();
    } else if (msg.type === 'room_state') {
      const prevStatus = gameState.status;
      gameState = msg.gameState;
      if (prevStatus !== 'countdown' && gameState.status === 'countdown') {
        const me = msg.players.find(p => p.id === myId);
        if (me) {
          localCar.x = me.x;
          localCar.y = me.y;
          localCar.vx = 0;
          localCar.vy = 0;
          localCar.angle = me.angle;
          localCar.lap = 1;
          localCar.checkpoint = 0;
          localCar.finished = false;
          localCar.nitro = 100;
        }
        aiBots.forEach((b, i) => {
          b.x = 1350 + i * 50;
          b.y = 1815 + (i % 2) * 70;
          b.vx = 0;
          b.vy = 0;
          b.angle = Math.PI;
          b.lap = 1;
          b.checkpoint = 0;
          b.finished = false;
          b.targetIndex = 44;
        });
      }
      syncRoomPlayers(msg.players);
    } else if (msg.type === 'world_tick') {
      for (const snap of msg.p) {
        if (snap.id === myId) continue;
        const rp = remotePlayers.get(snap.id);
        if (rp) {
          rp.targetX = snap.x;
          rp.targetY = snap.y;
          rp.vx = snap.vx;
          rp.vy = snap.vy;
          rp.targetAngle = snap.a;
          rp.steerAngle = snap.s;
          rp.drifting = Boolean(snap.d);
          rp.nitroActive = Boolean(snap.n);
          rp.lap = snap.lap;
          rp.checkpoint = snap.cp;
          rp.finished = Boolean(snap.fin);
        }
      }
    } else if (msg.type === 'pong_check') {
      pingMs = Date.now() - msg.t;
      document.getElementById('pingVal').textContent = `${pingMs}ms`;
    }
  });

  ws.addEventListener('close', () => setTimeout(connectWebSocket, 2000));
}

function syncRoomPlayers(playersList) {
  const activeIds = new Set();
  for (const p of playersList) {
    activeIds.add(p.id);
    const cObj = CAR_COLORS.find(c => c.name === p.color?.name) || CAR_COLORS[0];

    if (p.id === myId) {
      localCar.name = p.name;
      localCar.color = cObj;
      localCar.mesh.paintMat.color.setHex(cObj.hex);
      localCar.mesh.updateLabel('★ ' + localCar.name, cObj.primary);
    } else {
      let rp = remotePlayers.get(p.id);
      if (!rp) {
        const mesh = create3DSportsCar(cObj);
        mesh.updateLabel(p.name, cObj.primary);
        rp = { ...p, color: cObj, mesh, targetX: p.x, targetY: p.y, targetAngle: p.angle };
        remotePlayers.set(p.id, rp);
      } else {
        rp.name = p.name;
        rp.color = cObj;
        rp.mesh.paintMat.color.setHex(cObj.hex);
        rp.mesh.updateLabel(p.name, cObj.primary);
      }
    }
  }

  for (const [id, rp] of remotePlayers.entries()) {
    if (!activeIds.has(id)) {
      scene.remove(rp.mesh.root);
      remotePlayers.delete(id);
    }
  }
}

function updateRemoteCars3D() {
  for (const rp of remotePlayers.values()) {
    rp.x += (rp.targetX - rp.x) * 0.35;
    rp.y += (rp.targetY - rp.y) * 0.35;
    let dAngle = rp.targetAngle - rp.angle;
    while (dAngle > Math.PI) dAngle -= Math.PI * 2;
    while (dAngle < -Math.PI) dAngle += Math.PI * 2;
    rp.angle += dAngle * 0.35;

    if (rp.drifting) spawn3DDriftEffects(rp);
    syncCar3DMesh(rp, rp.drifting ? 150 : 0, rp.drifting);
  }
}

function renderColorPicker() {
  const picker = document.getElementById('colorPicker');
  picker.innerHTML = '';
  CAR_COLORS.forEach((c, idx) => {
    const dot = document.createElement('div');
    dot.className = 'color-dot' + (localCar.color.name === c.name ? ' active' : '');
    dot.style.background = c.primary;
    dot.style.color = c.primary;
    dot.title = c.name;
    dot.addEventListener('click', () => {
      localCar.color = c;
      localCar.mesh.paintMat.color.setHex(c.hex);
      localCar.mesh.updateLabel('★ ' + localCar.name, c.primary);
      renderColorPicker();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'update_profile',
          name: document.getElementById('playerNameInput').value,
          colorIdx: idx
        }));
      }
    });
    picker.appendChild(dot);
  });
}

// ============================================================================
// MENU & SETTINGS INTERACTIONS
// ============================================================================
function startGame() {
  gameStarted = true;
  initEngineAudio();
  document.getElementById('mainMenuScreen').classList.add('fade-out');

  // Reveal In-Game Minimal HUD
  document.getElementById('topHud').classList.remove('hidden');
  document.getElementById('navHud').classList.remove('hidden');
  document.getElementById('radarWrap').classList.remove('hidden');
  document.getElementById('nfsHud').classList.remove('hidden');
}

function toggleSettingsModal() {
  const modal = document.getElementById('settingsModal');
  modal.classList.toggle('hidden');
}

document.getElementById('btnStartGame').addEventListener('click', startGame);
document.getElementById('btnOpenSettings').addEventListener('click', toggleSettingsModal);
document.getElementById('btnCloseSettings').addEventListener('click', toggleSettingsModal);
document.getElementById('btnSaveCloseSettings').addEventListener('click', toggleSettingsModal);
document.getElementById('btnOpenMenuIngame').addEventListener('click', toggleSettingsModal);

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  const name = document.getElementById('playerNameInput').value.trim();
  if (name && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'update_profile', name }));
  }
});

document.getElementById('guideBtn').addEventListener('click', toggleRacingGuide);
document.getElementById('camBtn').addEventListener('click', toggleCameraMode);

document.getElementById('soundBtn').addEventListener('click', (e) => {
  initEngineAudio();
  soundEnabled = !soundEnabled;
  e.target.textContent = soundEnabled ? 'เปิด' : 'ปิด';
});

document.getElementById('startRaceBtn').addEventListener('click', () => {
  initEngineAudio();
  const laps = parseInt(document.getElementById('lapSelect').value, 10) || 3;
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'start_race', laps }));
  }
});

document.getElementById('addBotBtn').addEventListener('click', () => addAiBot());

document.getElementById('radminBanner').addEventListener('click', () => {
  const url = document.getElementById('shareUrl').textContent;
  navigator.clipboard?.writeText(url);
  const btn = document.getElementById('copyBtn');
  btn.textContent = 'คัดลอกแล้ว!';
  setTimeout(() => (btn.textContent = 'คัดลอก'), 1800);
});

fetch('/api/info')
  .then(r => r.json())
  .then(info => {
    const radminIp = info.ips.find(ip => ip.address.startsWith('26.') || ip.name.toLowerCase().includes('radmin'));
    const chosenIp = radminIp ? radminIp.address : (info.ips[0]?.address || location.hostname);
    document.getElementById('shareUrl').textContent = `http://${chosenIp}:${info.port}`;
  })
  .catch(() => {});

setInterval(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'state',
      x: localCar.x,
      y: localCar.y,
      vx: localCar.vx,
      vy: localCar.vy,
      angle: localCar.angle,
      av: localCar.angularVelocity,
      steer: localCar.steerAngle,
      drifting: localCar.drifting,
      nitroActive: localCar.nitroActive,
      nitro: localCar.nitro,
      lap: localCar.lap,
      cp: localCar.checkpoint,
      bestLap: localCar.bestLapTime
    }));
  }
}, 33);

setInterval(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping_check', t: Date.now() }));
  }
}, 1500);

// ============================================================================
// MAIN ANIMATION LOOP
// ============================================================================
let lastTime = performance.now();

function animate(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (gameStarted) {
    updateCarPhysics(localCar, keys, dt);
  } else {
    // Idle demo camera movement around car on the main menu
    const t = now * 0.0006;
    camPos.x = localCar.x + Math.cos(t) * 110;
    camPos.z = localCar.y + Math.sin(t) * 110;
    camPos.y = 42;
    camera.position.copy(camPos);
    camera.lookAt(localCar.x, 14, localCar.y);
  }

  updateAiBots(dt);
  updateRemoteCars3D();
  resolveCarCollisions();
  update3DParticles(dt);

  if (gameStarted) {
    update3DCamera(dt);
    updateHud();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

connectWebSocket();
renderColorPicker();
requestAnimationFrame(animate);
