// Simple multi-armed bandit training for a deeper stochastic network without backprop
// Fixed: (1) Only update edges that were actually active (pre AND post) for non-outputs
//        (2) Skip EMA bias update on output layer
//        (3) Proper softmax push-down at output layer: (1[j=a] - pi_j)
//        (4) Deterministic input firing to avoid null trajectories
//        (5) Small per-arm EMA baseline for lower-variance advantages

(function(){
    function sigmoid(x){ return 1/(1+Math.exp(-x)); }
    function softmax(arr){
      const max = Math.max(...arr);
      const exps = arr.map(v => Math.exp(v - max));
      const sum = exps.reduce((a,b)=>a+b,0);
      return exps.map(v=>v/sum);
    }
    function sampleCategorical(p){
      const r = Math.random();
      let acc = 0;
      for(let i=0;i<p.length;i++){ acc += p[i]; if(r<=acc) return i; }
      return p.length-1;
    }
    function clamp(x, lo, hi){ return Math.max(lo, Math.min(hi, x)); }
  
    class Neuron{
      constructor(id){
        this.id = id;
        this.bias = (Math.random()-0.5)*0.2;
        this.value = 0;
        this.fired = 0; // 0/1 last sample
        this.rho = 0.0; // EMA firing rate
      }
    }
  
    class Edge{
      constructor(src, dst){
        this.src = src;
        this.dst = dst;
        this.weight = (Math.random()-0.5)*0.2;
      }
    }
  
    class StochasticNetwork{
      constructor(numInputs, hiddenDepth, hiddenWidth, numOutputs){
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;
        this.layers = [];
        // Input layer
        this.layers.push(Array.from({length:numInputs}, (_,i)=>new Neuron(`I${i}`)));
        for(let d=0; d<hiddenDepth; d++){
          this.layers.push(Array.from({length:hiddenWidth}, (_,i)=>new Neuron(`H${d}_${i}`)));
        }
        this.layers.push(Array.from({length:numOutputs}, (_,i)=>new Neuron(`O${i}`)));
        // fully connect forward
        this.edges = [];
        for(let l=0;l<this.layers.length-1;l++){
          const a = this.layers[l], b = this.layers[l+1];
          for(const u of a){ for(const v of b){ this.edges.push(new Edge(u, v)); } }
        }
        // adjacency for speed
        this.outgoing = new Map();
        for(const e of this.edges){
          if(!this.outgoing.has(e.src)) this.outgoing.set(e.src, []);
          this.outgoing.get(e.src).push(e);
        }
      }
  
      resetState(){
        for(const layer of this.layers){
          for(const n of layer){ n.value = 0; n.fired = 0; }
        }
      }
  
      randomizeWeights(){
        for(const e of this.edges){ e.weight = (Math.random()-0.5)*0.2; }
        for(const layer of this.layers){ for(const n of layer){ n.bias = (Math.random()-0.5)*0.2; } }
      }
  
      // One forward stochastic pass; inputs fire deterministically to avoid null trajectories
      forward(inputs){
        this.resetState();
        // Deterministic inputs (bandit has no informative inputs; use constant 1)
        for(let i=0;i<this.layers[0].length;i++){
          const n = this.layers[0][i];
          n.value = inputs[i] ?? 1;
          n.fired = 1;
        }
        // hidden layers
        for(let l=1; l<this.layers.length-1; l++){
          for(const n of this.layers[l]){ n.value = 0; n.fired = 0; }
          // accumulate from previous layer's fired nodes
          for(const u of this.layers[l-1]){
            if(u.fired===1){
              const outs = this.outgoing.get(u) || [];
              for(const e of outs){ if(e.dst && this.layers[l].includes(e.dst)) e.dst.value += e.weight; }
            }
          }
          // sample firing
          for(const n of this.layers[l]){
            const p = sigmoid(n.value + n.bias);
            n.fired = (Math.random() < p) ? 1 : 0;
          }
        }
        // output layer: accumulate, no Bernoulli; produce logits
        const Lout = this.layers.length-1;
        for(const n of this.layers[Lout]){ n.value = 0; n.fired = 0; }
        for(const u of this.layers[Lout-1]){
          if(u.fired===1){
            const outs = this.outgoing.get(u) || [];
            for(const e of outs){ if(e.dst && this.layers[Lout].includes(e.dst)) e.dst.value += e.weight; }
          }
        }
        const logits = this.layers[Lout].map(n => n.value + n.bias);
        const probs = softmax(logits);
        return { logits, probs };
      }
  
      // Apply bias and weight updates using provided reward and per-node advantages
      // Extra carries { probs, action } for proper output-layer update
      applyUpdates(reward, advantages, alpha, beta, gamma, extra={}){
        const { probs=[], action=null } = extra;
        const outputLayerIndex = this.layers.length-1;
  
        // === Bias update (skip output layer) ===
        for(let l=0; l<outputLayerIndex; l++){
          for(const n of this.layers[l]){
            n.rho = 0.99*n.rho + 0.01*n.fired; // EMA firing-rate estimate
            const delta = beta * (n.rho - n.fired); // push rho toward fired
            n.bias = clamp(n.bias - delta, -5, 5);
          }
        }
  
        // Precompute layer index map
        const layerIndex = new Map();
        for(let l=0;l<this.layers.length;l++){
          for(const n of this.layers[l]) layerIndex.set(n, l);
        }
  
        // === Weight updates ===
        for(const e of this.edges){
          if(e.src.fired !== 1) continue; // require presynaptic activity
          const lsrc = layerIndex.get(e.src);
          const d = Math.max(0, outputLayerIndex - lsrc);
          const Au = advantages.get(e.src) ?? reward;
          let upd = alpha * Math.pow(gamma, d) * Au;
  
          const dstLayer = layerIndex.get(e.dst);
          if(dstLayer === outputLayerIndex){
            // Output-layer policy update: REINFORCE (1[j=a] - pi_j)
            const j = this.layers[outputLayerIndex].indexOf(e.dst);
            const push = ((j === action) ? 1 : 0) - (probs[j] ?? 0);
            upd *= push;
            // No need to check e.dst.fired for outputs
          } else {
            // Hidden: Hebbian gate requires postsynaptic firing
            if(e.dst.fired !== 1) continue;
            // keep upd as is
          }
  
          e.weight = clamp(e.weight + upd, -5, 5);
        }
      }
    }
  
    class BernoulliBandit{
      constructor(k){
        this.k = k;
        // random success probs
        this.ps = Array.from({length:k}, ()=>Math.random()*0.8 + 0.1);
        this.opt = this.ps.indexOf(Math.max(...this.ps));
        this.t = 0;
        this.cumReward = 0;
        this.actionCounts = Array.from({length:k}, ()=>0);
      }
      step(action){
        this.t += 1;
        this.actionCounts[action] += 1;
        const r = Math.random() < this.ps[action] ? 1 : 0;
        this.cumReward += r;
        return r;
      }
    }
  
    // Visualization helpers
    function renderBars(container, probs, chosen){
      container.innerHTML = '';
      for(let i=0;i<probs.length;i++){
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';
        const label = document.createElement('div');
        label.textContent = `Arm ${i}`;
        label.style.width = '60px';
        const barWrap = document.createElement('div');
        barWrap.style.flex = '1';
        barWrap.style.height = '10px';
        barWrap.style.background = '#e5e7eb';
        barWrap.style.borderRadius = '6px';
        const bar = document.createElement('div');
        bar.style.height = '100%';
        bar.style.width = `${(probs[i]*100).toFixed(1)}%`;
        bar.style.background = i===chosen ? '#ef4444' : '#3b82f6';
        bar.style.borderRadius = '6px';
        barWrap.appendChild(bar);
        const pct = document.createElement('div');
        pct.textContent = `${(probs[i]*100).toFixed(1)}%`;
        pct.style.width = '56px';
        pct.style.textAlign = 'right';
        pct.style.color = '#64748b';
        row.appendChild(label); row.appendChild(barWrap); row.appendChild(pct);
        container.appendChild(row);
      }
    }
  
    function renderNet(svg, net){
      while(svg.firstChild) svg.removeChild(svg.firstChild);
      const W = svg.viewBox.baseVal.width || svg.clientWidth;
      const H = svg.viewBox.baseVal.height || svg.clientHeight;
      const L = net.layers.length;
      const marginX = 40, marginY = 30;
      const colW = (W - 2*marginX) / (L-1);
      const layerY = (len, idx) => marginY + (idx+1)*(H - 2*marginY)/(len+1);
      const pos = new Map();
      for(let l=0;l<L;l++){
        const layer = net.layers[l];
        for(let i=0;i<layer.length;i++){
          const x = marginX + l*colW;
          const y = layerY(layer.length, i);
          pos.set(layer[i], {x,y});
        }
      }
      // edges
      for(const e of net.edges){
        const a = pos.get(e.src), b = pos.get(e.dst);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
        const w = clamp(e.weight, -1, 1);
        const col = w>0 ? `rgba(34,197,94,${Math.abs(w)})` : `rgba(239,68,68,${Math.abs(w)})`;
        line.setAttribute('stroke', col);
        line.setAttribute('stroke-width', '1.2');
        svg.appendChild(line);
      }
      // nodes
      for(const layer of net.layers){
        for(const n of layer){
          const p = pos.get(n);
          const circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circ.setAttribute('cx', p.x); circ.setAttribute('cy', p.y);
          circ.setAttribute('r', '8');
          const colorVal = sigmoid(n.value + n.bias);
          const r = Math.floor(255*colorVal), b = Math.floor(255*(1-colorVal));
          circ.setAttribute('fill', `rgb(${r},90,${b})`);
          if(n.fired===1){
            circ.setAttribute('stroke', '#facc15');
            circ.setAttribute('stroke-width', '3');
          }
          svg.appendChild(circ);
        }
      }
    }
  
    // Main controller
    let net = null;
    let bandit = null;
    let running = false;
    let rafId = null;
    let episode = 0;
  
    // Per-arm EMA baselines for lower-variance advantages
    let armBaseline = [];
    const baselineLambda = 0.05; // smoothing factor
  
    function init(){
      const K = parseInt(document.getElementById('num-arms').value, 10);
      const depth = parseInt(document.getElementById('hidden-depth').value, 10);
      const width = parseInt(document.getElementById('hidden-width').value, 10);
      net = new StochasticNetwork(1, depth, width, K);
      bandit = new BernoulliBandit(K);
      armBaseline = Array.from({length:K}, ()=>0.5); // start neutral
      net.randomizeWeights();
      episode = 0;
      updateViz(null);
      updateStats(0, null);
    }
  
    function updateStats(reward, chosen){
      const stats = document.getElementById('stats');
      if(!stats) return;
      const K = bandit ? bandit.k : 0;
      const best = bandit ? bandit.opt : 0;
      const cr = bandit ? bandit.cumReward : 0;
      stats.innerHTML = `Episodes: <strong>${episode}</strong><br/>`+
        `Cumulative reward: <strong>${cr}</strong><br/>`+
        `Best arm: <strong>${best}</strong> with p=${bandit ? bandit.ps[best].toFixed(2) : '-' }<br/>`+
        `Last reward: <strong>${reward!=null?reward: '-'}</strong><br/>`+
        `Action counts: ${bandit ? bandit.actionCounts.map((c,i)=>`Arm ${i}:${c}`).join(' | ') : ''}<br/>`+
        `Arm rewards: ${bandit ? bandit.ps.map((p,i)=>`Arm ${i}:${p.toFixed(2)}`).join(' | ') : ''}`;
      const bars = document.getElementById('out-bars');
      if(net){
        const Lout = net.layers.length-1;
        const logits = net.layers[Lout].map(n=>n.value + n.bias);
        const probs = softmax(logits);
        renderBars(bars, probs, chosen);
      } else {
        bars.innerHTML = '';
      }
    }
  
    function updateViz(chosen){
      const svg = document.getElementById('net-viz');
      if(net && svg){ renderNet(svg, net); }
      const Lout = net.layers.length-1;
      const logits = net.layers[Lout].map(n=>n.value + n.bias);
      const probs = softmax(logits);
      const bars = document.getElementById('out-bars');
      renderBars(bars, probs, chosen);
    }
  
    function stepEpisode(){
      if(!net || !bandit) return;
      // No informative inputs for bandit; use constant 1 input
      const { probs } = net.forward([1]);
      const action = sampleCategorical(probs);
      // mark chosen output as fired for hidden credit gating only
      const Lout = net.layers.length-1;
      for(let i=0;i<net.layers[Lout].length;i++){
        net.layers[Lout][i].fired = (i===action)?1:0;
      }
  
      const reward = bandit.step(action);
  
      // Update per-arm EMA baseline with observed reward for the played arm
      armBaseline[action] = (1 - baselineLambda)*armBaseline[action] + baselineLambda*reward;
      const advantageScalar = reward - armBaseline[action];
  
      // construct per-node advantages: here we use the same scalar for all active nodes
      const advantages = new Map();
      for(const layer of net.layers){
        for(const n of layer){
          advantages.set(n, advantageScalar);
        }
      }
  
      const alpha = parseFloat(document.getElementById('alpha').value);
      const beta = parseFloat(document.getElementById('beta').value);
      const gamma = parseFloat(document.getElementById('gamma').value);
      net.applyUpdates(reward, advantages, alpha, beta, gamma, { probs, action });
  
      episode += 1;
      updateViz(action);
      updateStats(reward, action);
    }
  
    function loop(){
      if(!running) return;
      for(let i=0;i<5;i++) stepEpisode();
      rafId = requestAnimationFrame(loop);
    }
  
    function start(){ if(!running){ running = true; loop(); } }
    function stop(){ running = false; if(rafId) cancelAnimationFrame(rafId); }
    function reset(){ if(net){ net.randomizeWeights(); episode=0; updateViz(null); updateStats(0, null); } }
  
    window.addEventListener('DOMContentLoaded', ()=>{
      const btnInit = document.getElementById('btn-init');
      const btnTrain = document.getElementById('btn-train');
      const btnStop = document.getElementById('btn-stop');
      const btnStep = document.getElementById('btn-step-ep');
      const btnReset = document.getElementById('btn-reset');
      if(btnInit) btnInit.addEventListener('click', init);
      if(btnTrain) btnTrain.addEventListener('click', start);
      if(btnStop) btnStop.addEventListener('click', stop);
      if(btnStep) btnStep.addEventListener('click', ()=>{ stepEpisode(); });
      if(btnReset) btnReset.addEventListener('click', reset);
      init();
    });
  })();