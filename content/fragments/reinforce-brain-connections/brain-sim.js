(function() {
  const svg = document.getElementById('brain-sim-svg');
  if (!svg) return;

  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
  function softmax(arr) {
    const max = Math.max(...arr);
    const exps = arr.map(v => Math.exp(v - max));
    const sum = exps.reduce((a,b) => a + b, 0);
    return exps.map(v => v / (sum || 1));
  }
  function randn() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  const layers = [
    [{ id: 'I1', label: 'I1', type: 'input' }, { id: 'I2', label: 'I2', type: 'input' }, { id: 'I3', label: 'I3', type: 'input' }],
    [{ id: 'H1', label: 'H1', type: 'hidden' }, { id: 'H2', label: 'H2', type: 'hidden' }, { id: 'H3', label: 'H3', type: 'hidden' }],
    [{ id: 'O1', label: 'O1', type: 'output' }, { id: 'O2', label: 'O2', type: 'output' }]
  ];

  const idToNode = new Map();
  const nodes = [];
  const edges = [];

  // Initialize nodes with positions, biases, values
  const width = 760, height = 360;
  const leftPadding = 60, rightPadding = 60, topPadding = 40, bottomPadding = 40;
  const layerWidth = (width - leftPadding - rightPadding) / (layers.length - 1);

  layers.forEach((layer, layerIndex) => {
    const ySpacing = (height - topPadding - bottomPadding) / (layer.length + 1);
    layer.forEach((n, i) => {
      const node = {
        id: n.id,
        label: n.label,
        type: n.type,
        layer: layerIndex,
        x: leftPadding + layerIndex * layerWidth,
        y: topPadding + (i + 1) * ySpacing,
        bias: randn() * 0.6,
        value: 0,
        willFire: false,
        firedLast: false
      };
      idToNode.set(node.id, node);
      nodes.push(node);
    });
  });

  function addEdge(fromId, toId, w) {
    edges.push({ from: fromId, to: toId, weight: w });
  }

  // Dense connections: inputs -> hidden, hidden -> output
  layers[0].forEach(i => layers[1].forEach(h => addEdge(i.id, h.id, randn() * 0.9)));
  layers[1].forEach(h => layers[2].forEach(o => addEdge(h.id, o.id, randn() * 0.9)));

  // Build adjacency lists
  const outAdj = new Map();
  const inAdj = new Map();
  nodes.forEach(n => { outAdj.set(n.id, []); inAdj.set(n.id, []); });
  edges.forEach(e => { outAdj.get(e.from).push(e); inAdj.get(e.to).push(e); });

  // Current frontier starts at inputs
  let frontier = nodes.filter(n => n.type === 'input');

  // SVG setup
  const svgns = 'http://www.w3.org/2000/svg';

  // Create gradient definitions
  const defs = document.createElementNS(svgns, 'defs');

  // Arrow marker
  const marker = document.createElementNS(svgns, 'marker');
  marker.setAttribute('id', 'arrow');
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('orient', 'auto-start-reverse');
  const markerPath = document.createElementNS(svgns, 'path');
  markerPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  markerPath.setAttribute('fill', '#6b7280');
  marker.appendChild(markerPath);
  defs.appendChild(marker);

  // Gradients for different edge types
  const positiveGradient = document.createElementNS(svgns, 'linearGradient');
  positiveGradient.setAttribute('id', 'positiveEdge');
  positiveGradient.setAttribute('x1', '0%');
  positiveGradient.setAttribute('y1', '0%');
  positiveGradient.setAttribute('x2', '100%');
  positiveGradient.setAttribute('y2', '0%');
  const stop1 = document.createElementNS(svgns, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('style', 'stop-color:#16a34a;stop-opacity:0.8');
  const stop2 = document.createElementNS(svgns, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('style', 'stop-color:#16a34a;stop-opacity:0.4');
  positiveGradient.appendChild(stop1);
  positiveGradient.appendChild(stop2);
  defs.appendChild(positiveGradient);

  const negativeGradient = document.createElementNS(svgns, 'linearGradient');
  negativeGradient.setAttribute('id', 'negativeEdge');
  negativeGradient.setAttribute('x1', '0%');
  negativeGradient.setAttribute('y1', '0%');
  negativeGradient.setAttribute('x2', '100%');
  negativeGradient.setAttribute('y2', '0%');
  const stop3 = document.createElementNS(svgns, 'stop');
  stop3.setAttribute('offset', '0%');
  stop3.setAttribute('style', 'stop-color:#dc2626;stop-opacity:0.8');
  const stop4 = document.createElementNS(svgns, 'stop');
  stop4.setAttribute('offset', '100%');
  stop4.setAttribute('style', 'stop-color:#dc2626;stop-opacity:0.4');
  negativeGradient.appendChild(stop3);
  negativeGradient.appendChild(stop4);
  defs.appendChild(negativeGradient);

  svg.appendChild(defs);

  const gEdges = document.createElementNS(svgns, 'g');
  const gNodes = document.createElementNS(svgns, 'g');
  svg.appendChild(gEdges);
  svg.appendChild(gNodes);

  function edgeColor(w) {
    if (w > 0.25) return '#16a34a';
    if (w < -0.25) return '#dc2626';
    return '#9ca3af';
  }

  function drawEdges() {
    gEdges.innerHTML = '';
    edges.forEach(e => {
      const from = idToNode.get(e.from);
      const to = idToNode.get(e.to);
      const line = document.createElementNS(svgns, 'line');
      const dx = to.x - from.x, dy = to.y - from.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const ux = dx / (len || 1), uy = dy / (len || 1);
      const r = 18; // node radius
      line.setAttribute('x1', (from.x + ux * r).toString());
      line.setAttribute('y1', (from.y + uy * r).toString());
      line.setAttribute('x2', (to.x - ux * r).toString());
      line.setAttribute('y2', (to.y - uy * r).toString());
      line.setAttribute('stroke', edgeColor(e.weight));
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('marker-end', 'url(#arrow)');
      gEdges.appendChild(line);

      // weight label near the middle
      const tx = from.x + dx * 0.5 + (-uy) * 10;
      const ty = from.y + dy * 0.5 + (ux) * 10;
      const label = document.createElementNS(svgns, 'text');
      label.setAttribute('x', tx.toString());
      label.setAttribute('y', ty.toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'central');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', '#6b7280');
      label.textContent = e.weight.toFixed(2);
      gEdges.appendChild(label);
    });
  }

  function valueToColor(v) {
    // Map value to a beautiful gradient: blue (low) → white (zero) → red (high)
    const c = clamp(v, -3, 3);
    if (c < 0) {
      // Blue to white
      const intensity = Math.abs(c) / 3;
      const r = Math.round(135 + (255 - 135) * intensity);
      const g = Math.round(206 + (255 - 206) * intensity);
      const b = Math.round(235 + (255 - 235) * intensity);
      return `rgb(${r},${g},${b})`;
    } else {
      // White to red
      const intensity = c / 3;
      const r = Math.round(255);
      const g = Math.round(255 - 100 * intensity);
      const b = Math.round(255 - 155 * intensity);
      return `rgb(${r},${g},${b})`;
    }
  }

  const nodeGroupById = new Map();
  function drawNodes() {
    gNodes.innerHTML = '';
    nodes.forEach(n => {
      const g = document.createElementNS(svgns, 'g');
      g.setAttribute('transform', `translate(${n.x},${n.y})`);

      // Shadow circle
      const shadow = document.createElementNS(svgns, 'circle');
      shadow.setAttribute('r', '20');
      shadow.setAttribute('fill', 'rgba(0,0,0,0.1)');
      shadow.setAttribute('cx', '2');
      shadow.setAttribute('cy', '2');
      g.appendChild(shadow);

      // Main circle with gradient
      const circle = document.createElementNS(svgns, 'circle');
      circle.setAttribute('r', '18');
      circle.setAttribute('fill', valueToColor(n.value));
      circle.setAttribute('stroke', n.firedLast ? '#fbbf24' : '#374151');
      circle.setAttribute('stroke-width', n.firedLast ? '4' : '2');
      circle.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
      circle.style.transition = 'all 0.3s ease';
      g.appendChild(circle);

      // Highlight ring for input nodes
      if (n.type === 'input') {
        const ring = document.createElementNS(svgns, 'circle');
        ring.setAttribute('r', '22');
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', '#3b82f6');
        ring.setAttribute('stroke-width', n.willFire ? '3' : '0');
        ring.setAttribute('stroke-dasharray', '4,2');
        ring.style.transition = 'stroke-width 0.3s ease';
        g.appendChild(ring);
      }

      const label = document.createElementNS(svgns, 'text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'central');
      label.setAttribute('font-size', '13');
      label.setAttribute('font-weight', '600');
      label.setAttribute('fill', '#1f2937');
      label.textContent = n.label;
      g.appendChild(label);

      const meta = document.createElementNS(svgns, 'text');
      meta.setAttribute('y', '32');
      meta.setAttribute('text-anchor', 'middle');
      meta.setAttribute('font-size', '10');
      meta.setAttribute('font-weight', '500');
      meta.setAttribute('fill', '#6b7280');
      meta.textContent = `v=${n.value.toFixed(2)}  b=${n.bias.toFixed(2)}`;
      g.appendChild(meta);

      if (n.type === 'input') {
        g.style.cursor = 'pointer';
        g.addEventListener('click', () => {
          n.willFire = !n.willFire;
          const cb = document.getElementById('input-' + n.id);
          if (cb) cb.checked = n.willFire;
          update();
        });
      }

      gNodes.appendChild(g);
      nodeGroupById.set(n.id, { group: g, circle, meta });
    });
  }

  function updateNodeVisual(n) {
    const ref = nodeGroupById.get(n.id);
    if (!ref) return;
    ref.circle.setAttribute('fill', valueToColor(n.value));
    ref.circle.setAttribute('stroke', n.firedLast ? '#f59e0b' : '#111827');
    ref.circle.setAttribute('stroke-width', n.firedLast ? '3' : '1.5');
    ref.meta.textContent = `v=${n.value.toFixed(2)}  b=${n.bias.toFixed(2)}`;
  }

  function allFrontierAreOutputs(list) {
    if (!list.length) return false;
    return list.every(n => n.type === 'output');
  }

  function stepOnce() {
    // Clear fired flags
    nodes.forEach(n => n.firedLast = false);
    const nextSet = new Set();

    frontier.forEach(n => {
      let fired = false;
      if (n.type === 'input') {
        fired = !!n.willFire;
      } else {
        const p = sigmoid(n.value + n.bias);
        const mode = document.getElementById('fire-mode').value;
        fired = (mode === 'deterministic') ? (p > 0.5) : (Math.random() < p);
      }
      if (fired) {
        n.firedLast = true;
        const outs = outAdj.get(n.id) || [];
        outs.forEach(e => {
          const target = idToNode.get(e.to);
          target.value += e.weight;
          nextSet.add(target);
        });
      } else {
        // Even if not fired, successors are considered as next frontier if they have incoming from frontier
        const outs = outAdj.get(n.id) || [];
        outs.forEach(e => nextSet.add(idToNode.get(e.to)));
      }
    });

    const next = Array.from(nextSet.values());
    if (next.length) frontier = next;
    update();
  }

  function runToOutput() {
    // Run until frontier is outputs (max a few steps given topology)
    const tick = () => {
      if (allFrontierAreOutputs(frontier)) {
        update();
        return;
      }
      stepOnce();
      setTimeout(tick, 400);
    };
    tick();
  }

  function resetValues(keepRandom = true) {
    nodes.forEach(n => { n.value = 0; n.firedLast = false; n.willFire = false; });
    if (!keepRandom) {
      nodes.forEach(n => n.bias = randn() * 0.6);
      edges.forEach(e => e.weight = randn() * 0.9);
    }
    // reset checkboxes
    ['I1','I2','I3'].forEach(id => {
      const cb = document.getElementById('input-' + id);
      if (cb) cb.checked = false;
    });
    frontier = nodes.filter(n => n.type === 'input');
    sampledIdx = null; // Reset sampling
    update();
  }

  function sampleFromSoftmax(probs) {
    const rand = Math.random();
    let cumsum = 0;
    for (let i = 0; i < probs.length; i++) {
      cumsum += probs[i];
      if (rand < cumsum) return i;
    }
    return probs.length - 1; // fallback
  }

  let sampledIdx = null; // Store the sampled output index

  function renderOutputBars() {
    const container = document.getElementById('output-bars');
    container.innerHTML = '';
    const outputs = nodes.filter(n => n.type === 'output');
    const probs = softmax(outputs.map(o => o.value));

    // Only sample if we're done with propagation (all frontier nodes are outputs)
    const isPropagationComplete = frontier.every(n => n.type === 'output');
    if (isPropagationComplete && sampledIdx === null) {
      // Debug logging
      console.log('Sampling from probabilities:', probs.map(p => p.toFixed(4)));
      sampledIdx = sampleFromSoftmax(probs);
      console.log('Sampled index:', sampledIdx, 'with probability:', probs[sampledIdx].toFixed(4));
    }

    outputs.forEach((o, idx) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';

      // Highlight the sampled output only when propagation is complete
      const shouldHighlight = isPropagationComplete && idx === sampledIdx;
      if (shouldHighlight) {
        row.style.padding = '8px';
        row.style.background = '#dbeafe';
        row.style.border = '2px solid #2563eb';
        row.style.borderRadius = '8px';
      }

      const label = document.createElement('div');
      label.textContent = o.label;
      label.style.width = '28px';
      label.style.fontWeight = '600';
      if (shouldHighlight) {
        label.style.color = '#1e40af';
      }

      const barWrap = document.createElement('div');
      barWrap.style.flex = '1';
      barWrap.style.height = '14px';
      barWrap.style.background = '#f3f4f6';
      barWrap.style.border = '1px solid #e5e7eb';
      barWrap.style.borderRadius = '7px';
      const bar = document.createElement('div');
      bar.style.height = '100%';
      bar.style.width = Math.round(probs[idx] * 100) + '%';
      bar.style.background = shouldHighlight ? '#dc2626' : '#2563eb';
      bar.style.borderRadius = '7px';
      barWrap.appendChild(bar);

      const value = document.createElement('div');
      value.textContent = `p=${probs[idx].toFixed(3)}  v=${o.value.toFixed(2)}`;
      value.style.width = '120px';
      value.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace';
      value.style.fontSize = '12px';
      if (shouldHighlight) {
        value.style.color = '#1e40af';
      }

      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(value);
      container.appendChild(row);
    });
  }

  function update() {
    nodes.forEach(updateNodeVisual);
    // Color arrowheads to match typical edge (use neutral for marker); edges are static lines
    renderOutputBars();
  }

  function wireInputs() {
    ['I1','I2','I3'].forEach(id => {
      const cb = document.getElementById('input-' + id);
      if (cb) {
        cb.addEventListener('change', () => {
          const n = idToNode.get(id);
          n.willFire = cb.checked;
          update();
        });
      }
    });
    const btnStep = document.getElementById('btn-step');
    const btnRun = document.getElementById('btn-run');
    const btnReset = document.getElementById('btn-reset');
    const btnRandomize = document.getElementById('btn-randomize');
    if (btnStep) btnStep.addEventListener('click', stepOnce);
    if (btnRun) btnRun.addEventListener('click', runToOutput);
    if (btnReset) btnReset.addEventListener('click', () => resetValues(true));
    if (btnRandomize) btnRandomize.addEventListener('click', () => resetValues(false));
  }

  // Test sampling function (uncomment to test in console)
  window.testSampling = function() {
    const testProbs = [0.3, 0.7];
    const counts = [0, 0];
    for (let i = 0; i < 1000; i++) {
      const sampled = sampleFromSoftmax(testProbs);
      counts[sampled]++;
    }
    console.log('Sampling test (expected ~300, ~700):', counts);
  };

  // Initial draw
  drawEdges();
  drawNodes();
  wireInputs();
  update();
})();
