const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const PORT = 3000;
const MAX_PLAYERS = 6;

const CAR_COLORS = [
  { name: 'Crimson Red', primary: '#ef4444', secondary: '#991b1b', glow: '#f87171' },
  { name: 'Cyber Cyan', primary: '#06b6d4', secondary: '#155e75', glow: '#22d3ee' },
  { name: 'Neon Lime', primary: '#84cc16', secondary: '#3f6212', glow: '#a3e635' },
  { name: 'Solar Gold', primary: '#eab308', secondary: '#854d0e', glow: '#facc15' },
  { name: 'Plasma Purple', primary: '#a855f7', secondary: '#581c87', glow: '#c084fc' },
  { name: 'Blaze Orange', primary: '#f97316', secondary: '#9a3412', glow: '#fb923c' }
];

// Spawn positions on starting grid (Start line at x=1200, y=1850, facing Left: angle = Math.PI)
const START_GRID = [
  { x: 1260, y: 1815, angle: Math.PI },
  { x: 1260, y: 1885, angle: Math.PI },
  { x: 1350, y: 1815, angle: Math.PI },
  { x: 1350, y: 1885, angle: Math.PI },
  { x: 1440, y: 1815, angle: Math.PI },
  { x: 1440, y: 1885, angle: Math.PI }
];

let gameState = {
  status: 'lobby', // 'lobby' | 'countdown' | 'racing' | 'finished'
  totalLaps: 3,
  countdownStart: 0,
  raceStartTime: 0,
  hostId: null,
  winner: null
};

const clients = new Map(); // id -> { socket, player }
const tekkenClients = new Map(); // id -> { socket, player }
let tekkenRoomState = {
  hostId: null,
  status: 'lobby', // 'lobby' | 'fighting'
  stageIdx: 0
};

// Simple RFC 6455 WebSocket Frame Encoder
function encodeWsFrame(data) {
  const payload = Buffer.from(typeof data === 'string' ? data : JSON.stringify(data));
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81; // FIN + Text frame
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
}

// Broadcast to all connected clients
function broadcast(msgObj, excludeId = null) {
  const frame = encodeWsFrame(msgObj);
  for (const [id, client] of clients.entries()) {
    if (id !== excludeId && client.socket && !client.socket.destroyed) {
      try {
        client.socket.write(frame);
      } catch (e) {}
    }
  }
}

function sendTo(id, msgObj) {
  const client = clients.get(id);
  if (client && client.socket && !client.socket.destroyed) {
    try {
      client.socket.write(encodeWsFrame(msgObj));
    } catch (e) {}
  }
}

function getAvailableSlot() {
  const usedSlots = new Set();
  for (const c of clients.values()) {
    usedSlots.add(c.player.slot);
  }
  for (let i = 0; i < MAX_PLAYERS; i++) {
    if (!usedSlots.has(i)) return i;
  }
  return -1;
}

function resetPlayersToGrid() {
  let idx = 0;
  for (const c of clients.values()) {
    const slot = c.player.slot !== undefined ? c.player.slot : idx;
    const grid = START_GRID[slot % START_GRID.length];
    c.player.x = grid.x;
    c.player.y = grid.y;
    c.player.vx = 0;
    c.player.vy = 0;
    c.player.angle = grid.angle;
    c.player.angularVelocity = 0;
    c.player.steerAngle = 0;
    c.player.drifting = false;
    c.player.nitroActive = false;
    c.player.nitro = 100;
    c.player.lap = 1;
    c.player.checkpoint = 0;
    c.player.finished = false;
    c.player.finishTime = 0;
    c.player.bestLapTime = 0;
    idx++;
  }
}

function getPublicGameState() {
  const players = [];
  for (const c of clients.values()) {
    players.push(c.player);
  }
  return {
    type: 'room_state',
    gameState,
    players
  };
}

function startCountdown() {
  if (gameState.status === 'countdown') return;
  gameState.status = 'countdown';
  gameState.countdownStart = Date.now();
  gameState.winner = null;
  resetPlayersToGrid();
  broadcast(getPublicGameState());

  setTimeout(() => {
    if (gameState.status === 'countdown') {
      gameState.status = 'racing';
      gameState.raceStartTime = Date.now();
      broadcast({
        type: 'race_start',
        raceStartTime: gameState.raceStartTime
      });
      broadcast(getPublicGameState());
    }
  }, 3500);
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/api/info') {
    const nets = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          ips.push({ name, address: net.address });
        }
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ port: PORT, ips }));
    return;
  }

  let filePath = path.join(__dirname, 'public', reqUrl === '/' ? 'index.html' : reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

// Broadcast to all connected tekken clients
function broadcastTekken(msgObj, excludeId = null) {
  const frame = encodeWsFrame(msgObj);
  for (const [id, client] of tekkenClients.entries()) {
    if (id !== excludeId && client.socket && !client.socket.destroyed) {
      try {
        client.socket.write(frame);
      } catch (e) {}
    }
  }
}

function sendToTekken(id, msgObj) {
  const client = tekkenClients.get(id);
  if (client && client.socket && !client.socket.destroyed) {
    try {
      client.socket.write(encodeWsFrame(msgObj));
    } catch (e) {}
  }
}

function getAvailableTekkenSlot() {
  const usedSlots = new Set();
  for (const c of tekkenClients.values()) {
    usedSlots.add(c.player.slot);
  }
  for (let i = 0; i < 6; i++) {
    if (!usedSlots.has(i)) return i;
  }
  return -1;
}

function getPublicTekkenState() {
  const players = [];
  for (const c of tekkenClients.values()) {
    players.push(c.player);
  }
  return {
    type: 'tekken_room',
    roomState: tekkenRoomState,
    players
  };
}

// Upgrade HTTP to WebSocket
server.on('upgrade', (req, socket, head) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }

  const isTekken = req.url && req.url.includes('mode=tekken');

  if (isTekken) {
    const slot = getAvailableTekkenSlot();
    if (slot === -1) {
      socket.destroy();
      return;
    }

    const acceptKey = crypto
      .createHash('sha1')
      .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-Websocket-Accept: ${acceptKey}`,
      '\r\n'
    ];
    socket.write(headers.join('\r\n'));
    socket.setNoDelay(true);

    const id = crypto.randomBytes(6).toString('hex');
    const player = {
      id,
      slot,
      name: `Fighter #${slot + 1}`,
      charIdx: slot % 6,
      wins: 0,
      ready: false
    };

    if (!tekkenRoomState.hostId || !tekkenClients.has(tekkenRoomState.hostId)) {
      tekkenRoomState.hostId = id;
    }

    tekkenClients.set(id, { socket, player });

    sendToTekken(id, {
      type: 'tekken_welcome',
      id,
      slot,
      roomState: tekkenRoomState,
      players: Array.from(tekkenClients.values()).map(c => c.player)
    });

    broadcastTekken(getPublicTekkenState(), id);

    let buffer = Buffer.alloc(0);
    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 2) {
        const firstByte = buffer[0];
        const opcode = firstByte & 0x0f;
        const secondByte = buffer[1];
        const isMasked = Boolean(secondByte & 0x80);
        let payloadLen = secondByte & 0x7f;
        let offset = 2;

        if (payloadLen === 126) {
          if (buffer.length < 4) return;
          payloadLen = buffer.readUInt16BE(2);
          offset = 4;
        } else if (payloadLen === 127) {
          if (buffer.length < 10) return;
          payloadLen = Number(buffer.readBigUInt64BE(2));
          offset = 10;
        }

        const maskLen = isMasked ? 4 : 0;
        if (buffer.length < offset + maskLen + payloadLen) return;

        let payload = buffer.subarray(offset + maskLen, offset + maskLen + payloadLen);
        if (isMasked) {
          const mask = buffer.subarray(offset, offset + 4);
          const unmasked = Buffer.alloc(payloadLen);
          for (let i = 0; i < payloadLen; i++) {
            unmasked[i] = payload[i] ^ mask[i % 4];
          }
          payload = unmasked;
        }

        buffer = buffer.subarray(offset + maskLen + payloadLen);

        if (opcode === 0x08) {
          socket.end();
          return;
        }
        if (opcode === 0x01) {
          try {
            const msg = JSON.parse(payload.toString('utf8'));
            handleTekkenMessage(id, msg);
          } catch (e) {}
        }
      }
    });

    socket.on('close', () => handleTekkenDisconnect(id));
    socket.on('error', () => handleTekkenDisconnect(id));
    return;
  }

  const slot = getAvailableSlot();
  if (slot === -1) {
    socket.destroy();
    return;
  }

  const acceptKey = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-Websocket-Accept: ${acceptKey}`,
    '\r\n'
  ];
  socket.write(headers.join('\r\n'));
  socket.setNoDelay(true);

  const id = crypto.randomBytes(6).toString('hex');
  const grid = START_GRID[slot];
  const color = CAR_COLORS[slot];

  const player = {
    id,
    slot,
    name: `Racer #${slot + 1}`,
    color,
    x: grid.x,
    y: grid.y,
    vx: 0,
    vy: 0,
    angle: grid.angle,
    angularVelocity: 0,
    steerAngle: 0,
    drifting: false,
    nitroActive: false,
    nitro: 100,
    lap: 1,
    checkpoint: 0,
    finished: false,
    finishTime: 0,
    bestLapTime: 0,
    isBot: false
  };

  if (!gameState.hostId || !clients.has(gameState.hostId)) {
    gameState.hostId = id;
  }

  clients.set(id, { socket, player });

  // Send welcome packet
  sendTo(id, {
    type: 'welcome',
    id,
    slot,
    gameState,
    players: Array.from(clients.values()).map(c => c.player)
  });

  broadcast(getPublicGameState(), id);

  let buffer = Buffer.alloc(0);

  socket.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    while (buffer.length >= 2) {
      const firstByte = buffer[0];
      const opcode = firstByte & 0x0f;
      const secondByte = buffer[1];
      const isMasked = Boolean(secondByte & 0x80);
      let payloadLen = secondByte & 0x7f;
      let offset = 2;

      if (payloadLen === 126) {
        if (buffer.length < 4) return;
        payloadLen = buffer.readUInt16BE(2);
        offset = 4;
      } else if (payloadLen === 127) {
        if (buffer.length < 10) return;
        payloadLen = Number(buffer.readBigUInt64BE(2));
        offset = 10;
      }

      const maskLen = isMasked ? 4 : 0;
      if (buffer.length < offset + maskLen + payloadLen) return;

      let payload = buffer.subarray(offset + maskLen, offset + maskLen + payloadLen);
      if (isMasked) {
        const mask = buffer.subarray(offset, offset + 4);
        const unmasked = Buffer.alloc(payloadLen);
        for (let i = 0; i < payloadLen; i++) {
          unmasked[i] = payload[i] ^ mask[i % 4];
        }
        payload = unmasked;
      }

      buffer = buffer.subarray(offset + maskLen + payloadLen);

      if (opcode === 0x08) {
        // Close frame
        socket.end();
        return;
      }

      if (opcode === 0x01) {
        try {
          const msg = JSON.parse(payload.toString('utf8'));
          handleClientMessage(id, msg);
        } catch (e) {}
      }
    }
  });

  socket.on('close', () => handleDisconnect(id));
  socket.on('error', () => handleDisconnect(id));
});

function handleTekkenDisconnect(id) {
  if (!tekkenClients.has(id)) return;
  tekkenClients.delete(id);

  if (tekkenRoomState.hostId === id) {
    const next = tekkenClients.keys().next().value;
    tekkenRoomState.hostId = next || null;
  }

  if (tekkenClients.size === 0) {
    tekkenRoomState.status = 'lobby';
  }

  broadcastTekken(getPublicTekkenState());
}

function handleTekkenMessage(id, msg) {
  const client = tekkenClients.get(id);
  if (!client) return;
  const p = client.player;

  switch (msg.type) {
    case 'tk_profile':
      if (typeof msg.name === 'string' && msg.name.trim().length > 0) {
        p.name = msg.name.trim().slice(0, 18);
      }
      if (typeof msg.charIdx === 'number' && msg.charIdx >= 0 && msg.charIdx < 6) {
        p.charIdx = msg.charIdx;
      }
      broadcastTekken(getPublicTekkenState());
      break;

    case 'tk_stage':
      if (typeof msg.stageIdx === 'number') {
        tekkenRoomState.stageIdx = msg.stageIdx;
        broadcastTekken(getPublicTekkenState());
      }
      break;

    case 'tk_start_match':
      tekkenRoomState.status = 'fighting';
      broadcastTekken({
        type: 'tk_match_start',
        stageIdx: msg.stageIdx ?? tekkenRoomState.stageIdx,
        p1: msg.p1,
        p2: msg.p2
      });
      broadcastTekken(getPublicTekkenState());
      break;

    case 'tk_fighter_sync':
      // Relay high-frequency fighter state & attacks immediately to opponent/spectators
      broadcastTekken({
        type: 'tk_fighter_sync',
        id,
        slot: p.slot,
        state: msg.state
      }, id);
      break;

    case 'tk_hit_event':
      broadcastTekken({
        type: 'tk_hit_event',
        attackerId: id,
        event: msg.event
      }, id);
      break;

    case 'tk_round_end':
      broadcastTekken({
        type: 'tk_round_end',
        winnerSlot: msg.winnerSlot,
        koType: msg.koType
      });
      break;

    case 'ping_check':
      sendToTekken(id, { type: 'pong_check', t: msg.t });
      break;
  }
}

function handleDisconnect(id) {
  if (!clients.has(id)) return;
  clients.delete(id);

  if (gameState.hostId === id) {
    const next = clients.keys().next().value;
    gameState.hostId = next || null;
  }

  if (clients.size === 0) {
    gameState.status = 'lobby';
    gameState.winner = null;
  }

  broadcast(getPublicGameState());
}

function handleClientMessage(id, msg) {
  const client = clients.get(id);
  if (!client) return;
  const p = client.player;

  switch (msg.type) {
    case 'update_profile':
      if (typeof msg.name === 'string' && msg.name.trim().length > 0) {
        p.name = msg.name.trim().slice(0, 18);
      }
      if (typeof msg.colorIdx === 'number' && CAR_COLORS[msg.colorIdx]) {
        p.color = CAR_COLORS[msg.colorIdx];
      }
      broadcast(getPublicGameState());
      break;

    case 'state':
      // High frequency vehicle physics sync
      p.x = msg.x;
      p.y = msg.y;
      p.vx = msg.vx;
      p.vy = msg.vy;
      p.angle = msg.angle;
      p.angularVelocity = msg.av || 0;
      p.steerAngle = msg.steer || 0;
      p.drifting = Boolean(msg.drifting);
      p.nitroActive = Boolean(msg.nitroActive);
      p.nitro = msg.nitro ?? p.nitro;
      p.lap = msg.lap ?? p.lap;
      p.checkpoint = msg.cp ?? p.checkpoint;
      p.bestLapTime = msg.bestLap ?? p.bestLapTime;
      break;

    case 'start_race':
      if (typeof msg.laps === 'number' && msg.laps >= 1 && msg.laps <= 10) {
        gameState.totalLaps = msg.laps;
      }
      startCountdown();
      break;

    case 'reset_lobby':
      gameState.status = 'lobby';
      gameState.winner = null;
      resetPlayersToGrid();
      broadcast(getPublicGameState());
      break;

    case 'finish_race':
      if (!p.finished && gameState.status === 'racing') {
        p.finished = true;
        p.finishTime = Date.now() - gameState.raceStartTime;
        if (!gameState.winner) {
          gameState.winner = { id: p.id, name: p.name, time: p.finishTime, color: p.color.primary };
        }
        broadcast(getPublicGameState());
      }
      break;

    case 'ping_check':
      sendTo(id, { type: 'pong_check', t: msg.t });
      break;
  }
}

// High-frequency 30Hz world snapshot broadcast
setInterval(() => {
  if (clients.size === 0) return;
  const snapshot = [];
  for (const c of clients.values()) {
    const p = c.player;
    snapshot.push({
      id: p.id,
      x: Math.round(p.x * 10) / 10,
      y: Math.round(p.y * 10) / 10,
      vx: Math.round(p.vx * 10) / 10,
      vy: Math.round(p.vy * 10) / 10,
      a: Math.round(p.angle * 1000) / 1000,
      s: Math.round(p.steerAngle * 100) / 100,
      d: p.drifting ? 1 : 0,
      n: p.nitroActive ? 1 : 0,
      lap: p.lap,
      cp: p.checkpoint,
      fin: p.finished ? 1 : 0,
      ft: p.finishTime,
      bl: p.bestLapTime
    });
  }
  broadcast({ type: 'world_tick', p: snapshot });
}, 33);

server.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log('   SPEED CAR: RADMIN VPN DRIFT RACING SERVER');
  console.log('====================================================');
  console.log(`Local Link   : http://localhost:${PORT}`);
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`${name.padEnd(12)} : http://${net.address}:${PORT}`);
      }
    }
  }
  console.log('====================================================');
});
