+++
title="Multi-Armed Bandit Brain"
date=2025-09-19
+++

This demo trains a deeper stochastic network (no backprop) on a $K$-armed bandit using the neural update rules described earlier:

- Bias update: For each neuron $v$ with firing indicator $v_f \in \{0,1\}$ and EMA firing-rate estimate $\rho$, update bias as $v_b := v_b - \Beta(\rho - v_f)$.
- Weight update: For each edge $(u\to v)$ that was active during a trajectory, update $w(u,v) := w(u,v) + \alpha\,\gamma^{d}\,A_u$ where $A_u$ is an advantage assigned at node $u$ and $d$ is the backward distance discount.

We interact with a bandit environment with $K$ arms and Bernoulli rewards. The network outputs an action distribution via softmax over output nodes.

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


