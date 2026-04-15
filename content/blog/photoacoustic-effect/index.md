+++
title="Acousto-optics"
date=2026-01-31
+++

When you propogate sound through a medium, you may be able to induce nonlinear effects
on light shining through the medium using sound, such that the input light is shifted in frequency
by the frequency of the sound.

If we assume that we have an acoustic wave travelling through the medium in the $+ \hat{y}$ direction and have the light propogate in the $+ \hat{x}$ direction, we have the medium contracting and expanding along the $\hat{y}$ direction. However, an increase in the size of a portion of the medium in the $\hat{y}$ direction causes a decrease in the size of the medium in the $\hat{x}$ direction. This causes some portion of the light to be frequency modulated by the stimulation acoustic beam, due to a change in the refractive index of the medium due to the photoelastic effect.

<div style="display:flex;flex-direction:column;align-items:center;gap:6px;margin:1.5em 0;">
<canvas id="ao-demo" width="500" height="280" style="border:1px solid #ccc;border-radius:4px;background:#fff;max-width:100%;height:auto;"></canvas>
<canvas id="ao-ft" width="500" height="140" style="border:1px solid #ccc;border-radius:4px;background:#fff;max-width:100%;height:auto;"></canvas>
</div>
<script src="/js/ao-demo.js"></script>

You can see peaks at $f_e \pm f_s$ in the frequency domain plot.

As far as I can tell, or as of the writing of this blog post, the Wikipedia entry on this topic is either incorrect or incomplete; this isn't trying to rectify that, but I think it's worth pointing out.

What is the photoelastic effect, and why do things have different refractive indices in the first place? 

In free space, the refractive index of light is $1$, by definition. Between two atoms in a medium, the phase velocity of light is travelling at the phase velocity in free space. However, each atom provides a "kick" back to the light, which causes the phase of the light to change, and typically slow down. A few exotic materials have refractive indices less than $1$ in the visible range, and many have refractive indices less than $1$ in the x-ray range. Modelling the refractive index of a material as a function of frequency is fairly involved, and is often broken up into talking about majority behaviors in different domains - for example, there is a domain in which the Drude model, which models electrons as being charges on springs, is a good approximation for the behavior of electrons in a material, and other domains where this breaks down, and other models dominate.

<div style="display:flex;justify-content:center;margin:1.5em 0;">
<canvas id="ri-demo" width="500" height="180" style="border:1px solid #ccc;border-radius:4px;background:#fff;max-width:100%;height:auto;"></canvas>
</div>
<script src="/js/ri-demo.js"></script>

Then, if you consider each atom as contributing a phase shift to the overall wave, the light "sees" more atoms per unit time if you compress atoms together in the direction of propogation - this contributes to a decrease in the phase velocity of light, and an increase in the refractive index in that direction; similarly, if you expand atoms apart in the direction of propogation, you get a decrease in the refractive index in that direction.

You probably could do cool things with this, though I'm not super sure what.