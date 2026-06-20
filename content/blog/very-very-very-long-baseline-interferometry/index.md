+++
title="Very Very Very Long Baseline Interferometry"
date=2026-06-19
description="Give me radio telescopes and a baseline long enough to place it, and I shall image the universe"
+++

In 2019, the Event Horizon Telescope (EHT) released the first image of a black hole.s

M87 is a galaxy 53 million light-years away. It's mostly featureless, appearing
as a blob of light when viewed through a telescope. At the center of the galaxy 
is a supermassive black hole. Being a black hole, you can only see the ring of light
caused by particles orbiting into the black hole. This disk spans 42 microarcseconds.

42 microarcseconds is a very, very small angle. This would be roughly equivilant
to seeing a sulphur atom at a distance of a meter or seeing three quarters on the moon. 
This is incredibly small, and it's a miracle of human engineering that we were able to 
image it.

Around the world, we had a constellation of radio telescopes, each with a position precise 
to a few millimeters, with synced frequencies, imaging around 230 GHz with a wavelength o 1.3
millimeters. 

The resolution of a telescope in radians is about 

$$
1.22 \lambda / D
$$

where $\lambda$ is the wavelength of the radio waves and $D$ is the diameter of the telescope.
We don't really have control over the wavelength we image at - there are only a few frequencies
that don't get attenuated or scattered. This clearly tells us that we have to increase
the diameter of the telescope. 

Why is there this inverse relationship between the resolution and the diameter of the telescope?
Consider what it means for the angular resolution to be small - this means that you can detect
subtle changes in the waves emitted across distance. To do this, you can make the phase
difference between two points close together to be large. Since this phase difference 
depends on the difference in the distance between the point and different points on the
observer, having two far away observers helps you get high resolution.

This infact means that you don't _really_ need a single large telescope, and instead
you can have a bunch of small telescopes, and then combine the signals from each of them
with very precise timing and position information to get near same resolution as a single 
large telescope. This is what Very Large Baseline Interferometry (VLBI) is! You measure the
phase and amplitude of radio waves with very precise timing and position information
across points on the earth and satellites to get high resolution images.

Can we go further? How can we scale our baseline by large amounts? The largest distance
that we have easily accessible to us is the distance between the earth and the sun, 
times two. This is 2 AU, or about 300 million kilometers. If we get anything near this, you 
might be able to do nanoarcsecond resolutions.

Let's not get ahead of ourselves though. There are two key things about VLBI -