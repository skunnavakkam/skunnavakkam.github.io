+++
title="More Interesting Webrings"
date=2026-02-02
description="can we make webrings more than circles?"
+++

me and my friends wanted to make a number of webrings, notably one for the [idealist's collective](https://idealistscollective.org/) and the [south hovses](https://en.wikipedia.org/wiki/House_system_at_the_California_Institute_of_Technology#South_houses). how do you arrange a number of webrings together in an interesting way?

for a single webring, if you enforce that each person has one neighbor on either side, you're kinda out of luck - a graph with no self-loops where every node has degree 2 is necessary cyclic, which means you have nothing but circles all the way down. although this proposition may excite the particle physicsts among us, it does not excite me. 

we can instead have much more complicated graph geometries (and give choice!) if instead of webrings we tiled the plane with webtriangles - where every person in the graph is connected to three other people, like the edges of triangles. unfortunately, such a graph exists only for even $n$, where $n$ is the number of people in the webring, which means that one person would have to link somewhere that isn't a unique person in the case of odd $n$. however, we now have cute geometries! in the case of $n = 4$, we can arrange our webtriangles into a triangular pyramid!

we also have a cute geometry in the case of $k = 4$ connection per-person, in the case where our $n$ nodes are factorable into $n = n_1 \times n_2$, where you can lay your websquares into a $n_1 \times n_2$ rectangle, and connected edges to make a torus, or you can add a half twist when you connect two of the edges to make a webmobiusstrip.

i treat Hexagons are an extension of the triangle case, where it is as if each person were made up of six little homunculi, and i choose not to consider that (you may argue that in the $n = 3$ case it is as if the person is made up of four little homunculi, but you forgot that homunculi do not come in square numbers)

these are only cases with one webring though, but people often have multiple friends, and these multiple friends are often part of different sets. thus, people with rich social lives often may put multiple webrings on their webpage (or so I hear). we need to think of a solution for those people too.

each seperate webring can be a seperate island that are all connected together - and i think an apt name for this metaconnection of webrings is the webweb (which can be shortend to ww, or quadruple u) - and the menu gives you the ability to pick between webrings, or pick within members of the same webring. 

![webweb](webweb.png)

we can think of different webrings within the webweb as islands, with individual people in multiple webrings acting as bridges, and the overall webweb navigation being flights or something between islands. each island has its own geometry induced by the degree of its graph, and the particle physicsts are all on the graph with degree 2. which island are you on if you're part of all three, for the webweb navigation purpose? well, we can bring in cookies.

we can track within webweb which webrings were visited, and fog of war webrings are two degrees away from any visited webrings, so you only see webrings that are distance one from the boundary of webrings you've visited, have leaderboards for the most traveled, and so on and so forth.

go forth! travel the webtriangles

<style>
  #webring-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }

  #nav-widget {
    padding: 1rem;
  }

  #nav-widget svg {
    display: block;
    overflow: visible;
  }

  #nav-widget text {
    font-family: inherit;
    font-size: 16px;
    cursor: pointer;
  }

  #nav-widget text:hover {
    text-decoration: underline;
  }

  #nav-widget .wrap-indicator {
    font-size: 10px;
    opacity: 0.6;
  }

  #triangle-map svg {
    display: block;
  }

  .tri {
    fill: none;
    stroke: currentColor;
    stroke-width: 1;
    cursor: pointer;
  }

  .tri:hover {
    fill: currentColor;
    fill-opacity: 0.1;
  }

  .current-dot {
    fill: var(--webring-accent, #ff6b8a);
  }

  .current-glow-outer {
    fill: var(--webring-accent, #ff6b8a);
    filter: blur(12px);
    opacity: 0.4;
  }

  .current-glow-inner {
    fill: var(--webring-accent, #ff6b8a);
    filter: blur(5px);
    opacity: 0.7;
  }

  #path-display {
    width: 100%;
    text-align: center;
    font-size: 0.85em;
    opacity: 0.6;
    margin-top: 0.5rem;
  }
</style>

<div id="webring-container">
  <div id="nav-widget"></div>
  <div id="triangle-map"></div>
  <div id="path-display"></div>
</div>

<script>
(function() {
  const people = [
    { name: 'you', bg: 'inherit', fg: 'inherit', accent: 'inherit',
      font: 'inherit', transform: 'none', letterSpacing: 'normal', lineHeight: 'inherit',
      extra: '', isDefault: true },
    { name: 'bob', bg: '#f0f0f0', fg: '#111', accent: '#0066cc',
      font: 'Courier New, monospace', transform: 'none', letterSpacing: '0', lineHeight: '1.4',
      extra: 'text-decoration: none; border-bottom: 2px solid currentColor;' },
    { name: 'carol', bg: '#ff69b4', fg: '#000', accent: '#fff',
      font: 'Comic Sans MS, cursive, sans-serif', transform: 'none', letterSpacing: '1px', lineHeight: '1.8',
      extra: 'text-shadow: 2px 2px 0 #ff1493;' },
    { name: 'dave', bg: '#000', fg: '#0f0', accent: '#0f0',
      font: 'Courier New, monospace', transform: 'uppercase', letterSpacing: '2px', lineHeight: '1.5',
      extra: 'text-shadow: 0 0 10px #0f0;' },
    { name: 'eve', bg: '#fff8dc', fg: '#333', accent: '#8b4513',
      font: 'Palatino Linotype, serif', transform: 'none', letterSpacing: '0.5px', lineHeight: '1.9',
      extra: 'font-weight: 300;' },
    { name: 'frank', bg: '#ff4500', fg: '#fff', accent: '#ffff00',
      font: 'Impact, sans-serif', transform: 'uppercase', letterSpacing: '3px', lineHeight: '1.3',
      extra: 'text-shadow: 3px 3px 0 #000;' },
    { name: 'grace', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fg: '#fff', accent: '#ffd700',
      font: 'Trebuchet MS, sans-serif', transform: 'none', letterSpacing: '0', lineHeight: '1.6',
      extra: '' },
    { name: 'heidi', bg: '#1a1a1a', fg: '#e0e0e0', accent: '#9d4edd',
      font: 'Consolas, monospace', transform: 'lowercase', letterSpacing: '1px', lineHeight: '1.7',
      extra: 'font-size: 0.95em;' },
    { name: 'ivan', bg: '#002b36', fg: '#839496', accent: '#2aa198',
      font: 'Source Code Pro, monospace', transform: 'none', letterSpacing: '0', lineHeight: '1.5',
      extra: '' },
    { name: 'judy', bg: '#fdf6e3', fg: '#657b83', accent: '#dc322f',
      font: 'Optima, sans-serif', transform: 'none', letterSpacing: '0.3px', lineHeight: '1.7',
      extra: '' },
    { name: 'karl', bg: '#111', fg: '#ccc', accent: '#ff5555',
      font: 'Helvetica Neue, sans-serif', transform: 'uppercase', letterSpacing: '4px', lineHeight: '2',
      extra: 'font-weight: 300;' },
    { name: 'lisa', bg: 'linear-gradient(180deg, #e0c3fc 0%, #8ec5fc 100%)', fg: '#2d2d2d', accent: '#6a0dad',
      font: 'Didot, serif', transform: 'none', letterSpacing: '1px', lineHeight: '1.8',
      extra: 'font-weight: 400;' },
    { name: 'mallory', bg: '#0d0221', fg: '#ff6ac1', accent: '#00ff9f',
      font: 'VT323, monospace', transform: 'uppercase', letterSpacing: '2px', lineHeight: '1.4',
      extra: 'text-shadow: 0 0 5px #ff6ac1, 0 0 20px #ff6ac1; animation: flicker 0.5s infinite;' },
    { name: 'niaj', bg: '#f5f5dc', fg: '#2f4f4f', accent: '#006400',
      font: 'Garamond, serif', transform: 'none', letterSpacing: '0', lineHeight: '2',
      extra: 'font-size: 1.1em;' },
    { name: 'olivia', bg: '#1a1a1a', fg: '#ff3333', accent: '#ff3333',
      font: 'Arial Black, sans-serif', transform: 'uppercase', letterSpacing: '0', lineHeight: '1.2',
      extra: 'font-weight: 900;' },
    { name: 'peggy', bg: '#191970', fg: '#add8e6', accent: '#ffa500',
      font: 'Lucida Console, monospace', transform: 'none', letterSpacing: '1px', lineHeight: '1.6',
      extra: '' },
    { name: 'quinn', bg: '#8b0000', fg: '#ffd700', accent: '#fff',
      font: 'Times New Roman, serif', transform: 'small-caps', letterSpacing: '2px', lineHeight: '1.7',
      extra: 'font-weight: bold;' },
    { name: 'rupert', bg: '#f4a460', fg: '#2f1810', accent: '#8b4513',
      font: 'Rockwell, serif', transform: 'none', letterSpacing: '0', lineHeight: '1.6',
      extra: '' },
    { name: 'sybil', bg: '#e6e6fa', fg: '#4b0082', accent: '#9400d3',
      font: 'Brush Script MT, cursive', transform: 'none', letterSpacing: '1px', lineHeight: '1.9',
      extra: 'font-size: 1.15em;' },
    { name: 'trent', bg: '#2c3e50', fg: '#ecf0f1', accent: '#e74c3c',
      font: 'Roboto, sans-serif', transform: 'none', letterSpacing: '0.5px', lineHeight: '1.65',
      extra: '' },
    { name: 'ursula', bg: '#000', fg: '#39ff14', accent: '#39ff14',
      font: 'Lucida Console, monospace', transform: 'none', letterSpacing: '0', lineHeight: '1.4',
      extra: 'text-shadow: 0 0 5px #39ff14; animation: scanlines 0.1s infinite;' },
    { name: 'victor', bg: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)', fg: '#fff', accent: '#ffeb3b',
      font: 'Arial, sans-serif', transform: 'none', letterSpacing: '0', lineHeight: '1.6',
      extra: 'text-shadow: 1px 1px 2px rgba(0,0,0,0.5);' },
    { name: 'wendy', bg: '#ffe4e1', fg: '#c71585', accent: '#ff1493',
      font: 'Papyrus, fantasy', transform: 'none', letterSpacing: '2px', lineHeight: '1.8',
      extra: '' },
    { name: 'xavier', bg: '#0c0c0c', fg: '#00ffff', accent: '#ff00ff',
      font: 'Orbitron, monospace', transform: 'uppercase', letterSpacing: '3px', lineHeight: '1.5',
      extra: 'text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;' }
  ];

  const COLS = 12;
  const ROWS = 2;
  const TRI_W = 52;
  const TRI_H = TRI_W * Math.sqrt(3) / 2;

  let currentPos = { row: 0, col: 0 };
  let path = [{ ...currentPos }];
  let visited = new Set([posKey(currentPos)]);

  function posKey(p) { return `${p.row},${p.col}`; }

  function mod(n, m) { return ((n % m) + m) % m; }

  function getPerson(row, col) {
    row = mod(row, ROWS);
    col = mod(col, COLS);
    return people[mod(row * COLS + col, people.length)];
  }

  function applyTheme(person) {
    const style = document.getElementById('webring-theme-style') || document.createElement('style');
    style.id = 'webring-theme-style';

    if (person.isDefault) {
      style.textContent = '';
      document.documentElement.style.removeProperty('--webring-accent');
      if (style.parentNode) style.remove();
      return;
    }

    document.documentElement.style.setProperty('--webring-bg', person.bg);
    document.documentElement.style.setProperty('--webring-fg', person.fg);
    document.documentElement.style.setProperty('--webring-accent', person.accent);

    style.textContent = `
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      @keyframes scanlines {
        0% { background-position: 0 0; }
        100% { background-position: 0 4px; }
      }

      html, body {
        background: ${person.bg} !important;
        color: ${person.fg} !important;
        font-family: ${person.font} !important;
        text-transform: ${person.transform} !important;
        letter-spacing: ${person.letterSpacing} !important;
        line-height: ${person.lineHeight} !important;
        transition: all 0.3s ease !important;
        ${person.extra}
      }

      body * {
        font-family: inherit !important;
        letter-spacing: inherit !important;
      }

      a {
        color: ${person.accent} !important;
        text-decoration: none;
        ${person.extra}
      }
      a:hover {
        opacity: 0.7;
        text-decoration: underline;
      }

      h1, h2, h3, h4, h5, h6 {
        color: ${person.accent} !important;
        ${person.extra}
      }

      p, li, td, th, span, div {
        ${person.extra}
      }

      code, pre {
        background: rgba(128,128,128,0.2) !important;
        color: ${person.accent} !important;
      }

      .current-dot, .current-glow-outer, .current-glow-inner {
        fill: ${person.accent};
      }

      #nav-widget, #triangle-map {
        color: ${person.fg};
      }

      #nav-widget text {
        fill: ${person.fg} !important;
      }

      #nav-widget line, #nav-widget circle, #nav-widget polygon {
        stroke: ${person.fg};
        fill: ${person.fg};
      }

      .tri {
        stroke: ${person.fg};
      }

      ::selection {
        background: ${person.accent};
        color: ${person.bg.startsWith('linear') || person.bg.startsWith('repeating') ? '#fff' : person.bg};
      }
    `;
    if (!style.parentNode) document.head.appendChild(style);
  }

  function pointsUp(row, col) {
    return mod(row + col, 2) === 0;
  }

  function wrapPos(row, col) {
    return { row: mod(row, ROWS), col: mod(col, COLS) };
  }

  function isWrapped(from, to) {
    return Math.abs(from.row - to.row) > 1 || Math.abs(from.col - to.col) > 1;
  }

  function getNeighbors(row, col) {
    const up = pointsUp(row, col);
    // Y based on row: top row points down, bottom row points up
    const angles = row === 0
      ? [90, -150, -30]   // top row: arrow down, top-left, top-right
      : [-90, 150, 30];   // bottom row: arrow up, bottom-left, bottom-right
    const raw = up
      ? [
          { row: row - 1, col: col },   // vertex neighbor (above)
          { row: row, col: col - 1 },   // left edge neighbor
          { row: row, col: col + 1 }    // right edge neighbor
        ]
      : [
          { row: row + 1, col: col },   // vertex neighbor (below)
          { row: row, col: col - 1 },   // left edge neighbor
          { row: row, col: col + 1 }    // right edge neighbor
        ];

    return raw.map((n, i) => {
      const wrapped = wrapPos(n.row, n.col);
      const wraps = isWrapped({ row, col }, { row: n.row, col: n.col });
      return { ...wrapped, angle: angles[i], wraps };
    });
  }

  function renderNav() {
    const container = document.getElementById('nav-widget');
    const neighbors = getNeighbors(currentPos.row, currentPos.col);
    const cx = 140, cy = 140;
    const armLen = 70;
    const textR = 105;

    let svg = `<svg width="280" height="280" viewBox="0 0 280 280">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="currentColor"/>`;

    neighbors.forEach(n => {
      const rad = n.angle * Math.PI / 180;
      const ex = cx + Math.cos(rad) * armLen;
      const ey = cy + Math.sin(rad) * armLen;
      const tx = cx + Math.cos(rad) * textR;
      const ty = cy + Math.sin(rad) * textR;

      svg += `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="currentColor" stroke-width="2"/>`;

      const hs = 8;
      const a1 = rad + 2.5, a2 = rad - 2.5;
      svg += `<polygon fill="currentColor" points="${ex},${ey} ${ex + Math.cos(a1) * hs},${ey + Math.sin(a1) * hs} ${ex + Math.cos(a2) * hs},${ey + Math.sin(a2) * hs}"/>`;

      const person = getPerson(n.row, n.col);
      const anchor = Math.abs(n.angle) < 60 ? 'start' : Math.abs(n.angle) > 120 ? 'end' : 'middle';
      const dy = n.angle > 30 && n.angle < 150 ? '0.9em' : n.angle < -30 && n.angle > -150 ? '-0.3em' : '0.35em';
      const label = n.wraps ? `${person.name}*` : person.name;
      svg += `<text x="${tx}" y="${ty}" text-anchor="${anchor}" dy="${dy}" data-row="${n.row}" data-col="${n.col}">${label}</text>`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;

    container.querySelectorAll('text').forEach(el => {
      el.addEventListener('click', () => {
        moveTo(parseInt(el.dataset.row), parseInt(el.dataset.col));
      });
    });
  }

  function triPoints(row, col) {
    const x = col * (TRI_W / 2);
    const y = row * TRI_H;
    const up = pointsUp(row, col);
    return up
      ? `${x + TRI_W / 2},${y} ${x},${y + TRI_H} ${x + TRI_W},${y + TRI_H}`
      : `${x},${y} ${x + TRI_W},${y} ${x + TRI_W / 2},${y + TRI_H}`;
  }

  function triCenter(row, col) {
    const x = col * (TRI_W / 2) + TRI_W / 2;
    const up = pointsUp(row, col);
    const y = row * TRI_H + (up ? TRI_H * 2 / 3 : TRI_H / 3);
    return { x, y };
  }

  function renderMap() {
    const container = document.getElementById('triangle-map');
    const w = (COLS + 1) * (TRI_W / 2);
    const h = ROWS * TRI_H;

    let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        svg += `<polygon class="tri" points="${triPoints(r, c)}" data-row="${r}" data-col="${c}"><title>${getPerson(r, c).name}</title></polygon>`;
      }
    }

    // Current position dot with layered glow
    const center = triCenter(currentPos.row, currentPos.col);
    svg += `<circle class="current-glow-outer" cx="${center.x}" cy="${center.y}" r="18"/>`;
    svg += `<circle class="current-glow-inner" cx="${center.x}" cy="${center.y}" r="10"/>`;
    svg += `<circle class="current-dot" cx="${center.x}" cy="${center.y}" r="5"/>`;

    svg += `</svg>`;
    container.innerHTML = svg;

    container.querySelectorAll('.tri').forEach(el => {
      el.addEventListener('click', () => {
        moveTo(parseInt(el.dataset.row), parseInt(el.dataset.col));
      });
    });
  }

  function renderPath() {
    document.getElementById('path-display').textContent =
      path.map(p => getPerson(p.row, p.col).name).join(' → ');
  }

  function moveTo(row, col) {
    currentPos = { row, col };
    path.push({ row, col });
    visited.add(posKey(currentPos));
    applyTheme(getPerson(row, col));
    renderNav();
    renderMap();
    renderPath();
  }

  (function init() {
    applyTheme(getPerson(currentPos.row, currentPos.col));
    renderNav();
    renderMap();
    renderPath();
  })();
})();
</script>
