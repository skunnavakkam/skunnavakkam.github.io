+++
title="cute graphs of chaotic systems"
date=2025-01-14
+++

This [video](https://www.youtube.com/watch?v=C5Jkgvw-Z6E&t=0s) is shows an example of a chaotic system! There are three *attractors* in this system, laid out in a equilateral triangle. You then release a ball from a point on the graph (assume that the ball is hung from an infinitely long pendulum, so you can use small angle approximations everywhere). The ball will then move towards one of the three attractors, and will eventually settle into one of them. This system is chaotic! Small perturbations in the initial conditions will cause the ball to end up in a different attractor. As a result, we can then color in each point on a square with a color based on which attractor the ball ends up in.

We can work through the freebody diagram of the ball, with position $\vec{i}$. Then, we have our set of attractors $\mathbf{A}$. We then have two components of our force: the restoring force towards the center, and the force from the attractors. We also have an attraction constant $\alpha$ a restoring constant $\beta$, and a damping constant $\gamma$.

Then, we have the force equation 

$$
F_{net} = - β\vec{i} - γ\vec{v} + α\sum_{j \in \mathbf{A}} \frac{\vec{j} - \vec{i}}{|\vec{j} - \vec{i}|^3}
$$

We then evolve the differential equation!