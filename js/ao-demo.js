(function(){
  var c = document.getElementById('ao-demo');
  var c2 = document.getElementById('ao-ft');
  if (!c || !c2) return;
  var ctx = c.getContext('2d');
  var ctx2 = c2.getContext('2d');
  var W = c.width, H = c.height;
  var W2 = c2.width, H2 = c2.height;
  var t = 0;
  var cy = H / 2;

  // medium box rest dimensions
  var boxCx = W / 2, boxW0 = 160, boxH0 = 120;
  var stretchAmp = 4;

  // acoustic
  var wa = 0.04;

  // light
  var k = 0.32;
  var w = 0.12;
  var v = w / k;
  var amp = 14;

  // refractive index: n(t) = 1.33 + 0.01 * sin(wa * t), range [1.32, 1.34]
  var n0 = 1.33;
  var dn = 0.05;

  // output wave buffer
  var outputWave = [];

  // FT parameters
  var numBins = 250;
  var maxFreq = 0.7;
  var avgSpectrum = new Float64Array(numBins);
  var ftFrames = 0;
  // plain average across all frames

  function arrow(x, y, dx, dy, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len, uy = dy / len;
    var px = -uy, py = ux;
    ctx.lineTo(x + dx - ux * size + px * size * 0.4, y + dy - uy * size + py * size * 0.4);
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - ux * size - px * size * 0.4, y + dy - uy * size - py * size * 0.4);
    ctx.stroke();
  }

  function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    var s = Math.sin(wa * t);
    var n = n0 + dn * s;
    var kIn = k * n;

    // box deformation: constant area = boxW0 * boxH0
    var ch = boxH0 + stretchAmp * s;
    var cw = (boxW0 * boxH0) / ch;
    var bLeft = boxCx - cw / 2;
    var bRight = boxCx + cw / 2;
    var bTop = cy - ch / 2;
    var bBot = cy + ch / 2;

    // --- draw box ---
    ctx.fillStyle = 'rgba(170, 205, 240, 0.25)';
    ctx.strokeStyle = '#567';
    ctx.lineWidth = 2;
    ctx.fillRect(bLeft, bTop, cw, ch);
    ctx.strokeRect(bLeft, bTop, cw, ch);

    // stretch arrows
    ctx.strokeStyle = '#78a';
    ctx.lineWidth = 1.5;
    var arrowLen = 10 + 6 * Math.abs(s);
    if (s > 0.05) {
      arrow(boxCx, bTop - 4, 0, -arrowLen, 5);
      arrow(boxCx, bBot + 4, 0, arrowLen, 5);
    } else if (s < -0.05) {
      arrow(boxCx, bTop - arrowLen - 4, 0, arrowLen, 5);
      arrow(boxCx, bBot + arrowLen + 4, 0, -arrowLen, 5);
    }

    // --- input wave ---
    ctx.beginPath();
    ctx.strokeStyle = '#c22';
    ctx.lineWidth = 2;
    for (var x = 0; bLeft >= x; x++) {
      var y = cy + amp * Math.sin(k * x - w * t);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // --- wave inside medium ---
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(190, 30, 20, 0.45)';
    ctx.lineWidth = 2;
    for (var x = Math.floor(bLeft); bRight >= x; x++) {
      var phase = k * bLeft - w * t + kIn * (x - bLeft);
      var y = cy + amp * Math.sin(phase);
      if (x === Math.floor(bLeft)) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // --- output wave (simulated) ---
    for (var i = 0; i < outputWave.length; i++) {
      outputWave[i].x += v;
    }
    while (outputWave.length > 0 && outputWave[0].x > W + 5) {
      outputWave.shift();
    }
    var exitPhase = k * bLeft - w * t + kIn * (bRight - bLeft);
    outputWave.push({x: bRight, y: cy + amp * Math.sin(exitPhase)});

    ctx.beginPath();
    ctx.strokeStyle = '#c22';
    ctx.lineWidth = 2;
    var started = false;
    for (var i = outputWave.length - 1; i >= 0; i--) {
      if (outputWave[i].x >= bRight - 1) {
        if (!started) { ctx.moveTo(outputWave[i].x, outputWave[i].y); started = true; }
        else ctx.lineTo(outputWave[i].x, outputWave[i].y);
      }
    }
    ctx.stroke();

    // --- labels ---
    ctx.font = '11px monospace';
    ctx.fillStyle = '#c22';
    ctx.fillText('light \u2192 (+x)', 8, 18);
    ctx.fillStyle = '#78a';
    ctx.fillText('sound \u2191 (-y)', boxCx - 38, bTop - arrowLen - 10);
    ctx.fillStyle = '#345';
    ctx.fillText('n = ' + n.toFixed(3), bLeft + 8, cy - 4);
    ctx.fillStyle = '#888';
    ctx.fillText('f\u2080', 8, cy + amp + 22);
    ctx.fillText('f\u2080 \u00b1 f\u2090', W - 55, cy + amp + 22);

    // === FT of output wave (time-averaged) ===
    var samples = [];
    for (var i = outputWave.length - 1; i >= 0; i--) {
      if (outputWave[i].x >= bRight - 1) {
        samples.push(outputWave[i].y - cy);
      }
    }

    var N = samples.length;
    if (N > 64) {
      // Hann window + DFT, then EMA into avgSpectrum
      for (var bin = 0; numBins > bin; bin++) {
        var freq = (bin / numBins) * maxFreq;
        var re = 0, im = 0;
        for (var j = 0; N > j; j++) {
          var win = 0.5 * (1 - Math.cos(2 * Math.PI * j / (N - 1)));
          var val = samples[j] * win;
          var ph = freq * j * v;
          re += val * Math.cos(ph);
          im -= val * Math.sin(ph);
        }
        var mag = Math.sqrt(re * re + im * im);
        avgSpectrum[bin] = (avgSpectrum[bin] * ftFrames + mag) / (ftFrames + 1);
      }
      ftFrames++;

      // find max for normalization
      var maxSpec = 0;
      for (var bin = 0; numBins > bin; bin++) {
        if (avgSpectrum[bin] > maxSpec) maxSpec = avgSpectrum[bin];
      }

      // draw FT
      ctx2.fillStyle = '#fff';
      ctx2.fillRect(0, 0, W2, H2);

      var padL = 45, padR = 10, padT = 15, padB = 30;
      var plotW = W2 - padL - padR;
      var plotH = H2 - padT - padB;

      // axes
      ctx2.strokeStyle = '#aaa';
      ctx2.lineWidth = 1;
      ctx2.beginPath();
      ctx2.moveTo(padL, padT);
      ctx2.lineTo(padL, H2 - padB);
      ctx2.lineTo(W2 - padR, H2 - padB);
      ctx2.stroke();

      if (maxSpec > 0) {
        // spectrum curve
        ctx2.beginPath();
        ctx2.strokeStyle = '#26a';
        ctx2.lineWidth = 1.5;
        for (var bin = 0; numBins > bin; bin++) {
          var px = padL + (bin / numBins) * plotW;
          var py = H2 - padB - (avgSpectrum[bin] / maxSpec) * plotH;
          if (bin === 0) ctx2.moveTo(px, py); else ctx2.lineTo(px, py);
        }
        ctx2.stroke();

        // mark f0
        var f0Bin = k / maxFreq * numBins;
        var f0X = padL + (f0Bin / numBins) * plotW;
        ctx2.strokeStyle = 'rgba(200, 50, 30, 0.3)';
        ctx2.lineWidth = 1;
        ctx2.setLineDash([3, 3]);
        ctx2.beginPath();
        ctx2.moveTo(f0X, padT);
        ctx2.lineTo(f0X, H2 - padB);
        ctx2.stroke();
        ctx2.setLineDash([]);

        // mark f0 +/- fa
        var ka = wa / v;
        var fmBin = (k - ka) / maxFreq * numBins;
        var fpBin = (k + ka) / maxFreq * numBins;
        var fmX = padL + (fmBin / numBins) * plotW;
        var fpX = padL + (fpBin / numBins) * plotW;
        ctx2.strokeStyle = 'rgba(100, 100, 200, 0.3)';
        ctx2.setLineDash([3, 3]);
        ctx2.beginPath();
        ctx2.moveTo(fmX, padT);
        ctx2.lineTo(fmX, H2 - padB);
        ctx2.moveTo(fpX, padT);
        ctx2.lineTo(fpX, H2 - padB);
        ctx2.stroke();
        ctx2.setLineDash([]);

        // labels
        ctx2.font = '10px monospace';
        ctx2.fillStyle = '#c22';
        ctx2.fillText('f\u2080', f0X - 5, H2 - padB + 14);
        ctx2.fillStyle = '#44a';
        ctx2.fillText('f\u2080-f\u2090', fmX - 12, H2 - padB + 14);
        ctx2.fillText('f\u2080+f\u2090', fpX - 12, H2 - padB + 14);
      }

      ctx2.fillStyle = '#333';
      ctx2.font = '10px monospace';
      ctx2.fillText('|F(f)|', 2, padT + 8);
      ctx2.fillText('frequency \u2192', W2 / 2 - 35, H2 - 4);
      ctx2.fillText('output spectrum (averaged)', W2 - 180, padT + 8);
    }

    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();
