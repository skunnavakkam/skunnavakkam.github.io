+++
title="REINFORCEing A Brain"
date=2025-09-19
+++

I think that there are ways that strengthening paths on a graph can be like reinforcement learning, and a reduction of how brains work is strengthening paths on a graph. In real life, brains are wayyyyyy more complex.

Start with a directed acyclic graph $G = (V, E)$ with edge weights $w: E \to \mathbb{R}$. Applying a topological sort, we get an ordered sequence of vertices. The $n$ input nodes are $I = \\{v \in V : \text{in-degree}(v) = 0\\}$ and the $m$ output nodes are $O = \\{v \in V : \text{out-degree}(v) = 0\\}$. 

The graph operates by taking some input observation $\mathbb{R}^n$ and produces a one-hot vector $\mathbb{R}^m$ with the following algorithm:
- Start with $\text{nodes} = I$
- Each node $v \in \text{nodes}$ has a value $v_{v}$ and a bias $v_{b}$. It fires with probability $\text{sigmoid}(v_{v} + v_{b})$.
- For each node $v \in \text{nodes}$ with outgoing edges to nodes in $u \in U$, we have a weight $w_{v, u}$. We update $u_{v}$ by $u_{v} := {u_v} + w_{v, u} \text{if } v \text{ fires}$
- nodes := all nodes with incoming edges from $\text{nodes}$ or the node itself it it's an output node
- Repeat until $\text{nodes} = O$

We can then sample an action  $a \in O$ by $\text{softmax}(O_v)$.

<div id="brain-graph-sim" style="border:2px solid #e0e7ff;border-radius:16px;padding:20px;margin:20px 0;background:linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);box-shadow:0 4px 20px rgba(0,0,0,0.08)">
  <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin-bottom:16px">
    <div style="font-weight:700;font-size:16px;color:#1e293b">Inputs:</div>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px; cursor:pointer; transition:all 0.2s">
      <input type="checkbox" id="input-I1" style="margin:0">
      <span style="font-weight:500;color:#374151">I1</span>
    </label>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px; cursor:pointer; transition:all 0.2s">
      <input type="checkbox" id="input-I2" style="margin:0">
      <span style="font-weight:500;color:#374151">I2</span>
    </label>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px; cursor:pointer; transition:all 0.2s">
      <input type="checkbox" id="input-I3" style="margin:0">
      <span style="font-weight:500;color:#374151">I3</span>
    </label>
    <div style="margin-left:auto;display:flex;gap:10px;align-items:center">
      <label style="display:inline-flex;align-items:center;gap:8px">
        <span style="font-weight:500;color:#374151">Mode:</span>
        <select id="fire-mode" style="padding:6px 12px;border-radius:8px;border:1px solid #d1d5db;background:#ffffff;color:#374151;font-size:14px">
          <option value="sample">Sample</option>
          <option value="deterministic">Deterministic (p > 0.5)</option>
        </select>
      </label>
      <button id="btn-step" style="padding:8px 14px;border:2px solid #1e293b;border-radius:10px;background:#1e293b;color:white;font-weight:600; transition:all 0.2s">Step</button>
      <button id="btn-run" style="padding:8px 14px;border:2px solid #3b82f6;border-radius:10px;background:#3b82f6;color:white;font-weight:600; transition:all 0.2s">Run</button>
      <button id="btn-reset" style="padding:8px 14px;border:2px solid #6b7280;border-radius:10px;background:#ffffff;color:#374151;font-weight:600; transition:all 0.2s">Reset</button>
      <button id="btn-randomize" style="padding:8px 14px;border:2px solid #8b5cf6;border-radius:10px;background:#8b5cf6;color:white;font-weight:600; transition:all 0.2s">Randomize</button>
    </div>
  </div>
  <div style="display:flex;gap:20px;flex-wrap:wrap">
    <svg id="brain-sim-svg" width="760" height="360" viewBox="0 0 760 360" style="background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);border:2px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05)"></svg>
    <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:16px">
      <div style="font-weight:700;font-size:16px;color:#1e293b">Output distribution (softmax over O):</div>
      <div id="output-bars" style="display:flex;flex-direction:column;gap:12px"></div>
      <div id="legend" style="font-size:13px;color:#64748b;background:#ffffff;border-radius:8px;padding:12px;border:1px solid #e2e8f0">
        <div style="margin-bottom:6px"><strong>Color:</strong> Node value (blue = low → red = high)</div>
        <div style="margin-bottom:6px"><strong>Yellow outline:</strong> Fired in last step</div>
        <div style="margin-bottom:6px"><strong>Edge color:</strong> Red (−), Gray (~0), Green (+)</div>
        <div style="margin-bottom:6px"><strong>Red bar:</strong> Sampled action (at end)</div>
        <div><em>Note: Sampling is probabilistic</em></div>
      </div>
    </div>
  </div>
</div>

<script src="brain-sim.js"></script>


Let's suppose that at the end, we receive a reward $r$. This allows us to update the weights of edges and the biases of nodes. Take the firing edges $E_f = \\{ e(u, v) \text{if } u \text{ fired and } v \text{ fired} \\}$. We can update the weights $e(u, v) := e(u, v) + \alpha \cdot r$. 

We can then perform updates. We have two updates, one on the biases and one on the weights. 

We update a neuron $v$'s bias with $v_b := v_b - \Beta[\rho - v_f]$ where $v_f$ is whether or not the neuron fires and $\rho$ is the time-averaged firing rate / probability of firing. We also update the weight $w(v, u) := \alpha \gamma A_u$ where $A_u$ is the advantage at node $u$, so it gets discounted by $\gamma$ as you propogate backwards.

<div id="bandit-brain" style="border:2px solid #e0e7ff;border-radius:16px;padding:20px;margin:20px 0;background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);box-shadow:0 4px 20px rgba(0,0,0,0.08)">
  <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin-bottom:16px">
    <div style="font-weight:700;font-size:16px;color:#1e293b">K-Armed Bandit:</div>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px">
      <span style="color:#374151">Arms</span>
      <input id="num-arms" type="number" min="2" max="12" value="5" style="width:64px;padding:6px 8px;border:1px solid #d1d5db;border-radius:8px" />
    </label>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px">
      <span style="color:#374151">Hidden depth</span>
      <input id="hidden-depth" type="number" min="2" max="6" value="4" style="width:64px;padding:6px 8px;border:1px solid #d1d5db;border-radius:8px" />
    </label>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px">
      <span style="color:#374151">Hidden width</span>
      <input id="hidden-width" type="number" min="4" max="48" value="16" style="width:72px;padding:6px 8px;border:1px solid #d1d5db;border-radius:8px" />
    </label>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px">
      <span style="color:#374151">Alpha</span>
      <input id="alpha" type="number" step="0.0001" min="0" value="0.02" style="width:84px;padding:6px 8px;border:1px solid #d1d5db;border-radius:8px" />
    </label>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px">
      <span style="color:#374151">Beta</span>
      <input id="beta" type="number" step="0.0001" min="0" value="0.01" style="width:84px;padding:6px 8px;border:1px solid #d1d5db;border-radius:8px" />
    </label>
    <label style="display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px">
      <span style="color:#374151">Gamma</span>
      <input id="gamma" type="number" step="0.01" min="0" max="0.999" value="0.95" style="width:84px;padding:6px 8px;border:1px solid #d1d5db;border-radius:8px" />
    </label>
    <div style="margin-left:auto;display:flex;gap:10px;align-items:center">
      <button id="btn-init" style="padding:8px 14px;border:2px solid #0ea5e9;border-radius:10px;background:#0ea5e9;color:white;font-weight:600">Init</button>
      <button id="btn-train" style="padding:8px 14px;border:2px solid #22c55e;border-radius:10px;background:#22c55e;color:white;font-weight:600">Train</button>
      <button id="btn-stop" style="padding:8px 14px;border:2px solid #ef4444;border-radius:10px;background:#ef4444;color:white;font-weight:600">Stop</button>
      <button id="btn-step-ep" style="padding:8px 14px;border:2px solid #6b7280;border-radius:10px;background:#ffffff;color:#374151;font-weight:600">Step Episode</button>
      <button id="btn-reset" style="padding:8px 14px;border:2px solid #6b7280;border-radius:10px;background:#ffffff;color:#374151;font-weight:600">Reset Weights</button>
    </div>
  </div>
  <div style="display:flex;gap:20px;flex-wrap:wrap">
    <svg id="net-viz" width="780" height="420" viewBox="0 0 780 420" style="background:linear-gradient(135deg,#ffffff 0%,#f8fafc 100%);border:2px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.05)"></svg>
    <div style="flex:1;min-width:300px;display:flex;flex-direction:column;gap:12px">
      <div style="font-weight:700;font-size:16px;color:#1e293b">Stats</div>
      <div id="stats" style="font-size:13px;color:#64748b;background:#ffffff;border-radius:8px;padding:12px;border:1px solid #e2e8f0"></div>
      <div style="font-weight:700;font-size:16px;color:#1e293b">Output distribution</div>
      <div id="out-bars" style="display:flex;flex-direction:column;gap:10px"></div>
    </div>
  </div>
</div>

<script src="bandit-brain.js"></script>
