(function(){
  var c = document.getElementById('ri-demo');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var t = 0;
  var cy = H / 2;

  // atoms
  var numAtoms = 5;
  var atomStart = 160;
  var atomSpacing = 36;
  var atomRadius = 5;
  var medLeft = atomStart - 10;
  var medRight = atomStart + (numAtoms - 1) * atomSpacing + 10;

  // wave parameters
  var lambda = 50;
  var speed = 0.5;
  var nEff = 1.6;

  // wavefront positions (simulated)
  var fronts = [];
  var spawnInterval = lambda / speed;
  var spawnTimer = spawnInterval; // spawn immediately

  // also track free-space reference fronts
  var refFronts = [];
  var refTimer = spawnInterval;

  function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // spawn wavefronts
    spawnTimer += 1;
    if (spawnTimer >= spawnInterval) {
      fronts.push(-1);
      refFronts.push(-1);
      spawnTimer = 0;
    }

    // advance reference fronts (always at free-space speed)
    for (var i = refFronts.length - 1; i >= 0; i--) {
      refFronts[i] += speed;
      if (refFronts[i] > W + 10) { refFronts.splice(i, 1); }
    }

    // advance actual fronts (slow inside medium)
    for (var i = fronts.length - 1; i >= 0; i--) {
      if (fronts[i] >= medLeft && fronts[i] <= medRight) {
        fronts[i] += speed / nEff;
      } else {
        fronts[i] += speed;
      }
      if (fronts[i] > W + 10) { fronts.splice(i, 1); }
    }

    // draw atoms
    for (var i = 0; numAtoms > i; i++) {
      var ax = atomStart + i * atomSpacing;
      ctx.beginPath();
      ctx.arc(ax, cy, atomRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(80, 110, 160, 0.5)';
      ctx.fill();
      ctx.strokeStyle = '#345';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // draw reference wavefronts (dashed)
    for (var i = 0; refFronts.length > i; i++) {
      var x = refFronts[i];
      if (x >= 0 && x <= W) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.25)';
        ctx.setLineDash([3, 4]);
        ctx.lineWidth = 1;
        ctx.moveTo(x, cy - 35);
        ctx.lineTo(x, cy + 35);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // draw actual wavefronts (solid)
    for (var i = 0; fronts.length > i; i++) {
      var x = fronts[i];
      if (x >= 0 && x <= W) {
        ctx.beginPath();
        ctx.strokeStyle = '#c22';
        ctx.lineWidth = 2;
        ctx.moveTo(x, cy - 35);
        ctx.lineTo(x, cy + 35);
        ctx.stroke();
      }
    }

    // labels
    ctx.font = '11px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('vacuum (dashed)', 8, 16);
    ctx.fillStyle = '#c22';
    ctx.fillText('with atoms', 8, 30);

    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();
