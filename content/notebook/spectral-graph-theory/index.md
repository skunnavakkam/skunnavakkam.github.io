+++
title="Eigenvectors of the Graph Laplacian hold Spectral Information"
date=2024-10-06
+++

Start by defining the laplacian operator 
$$
L = \frac{\partial F^2}{\partial^2 x}
$$

We want to find some eigenfunction, which is a function $f$ such that 
$$
Lf = \lambda f
$$
for some eigenvalue $\lambda$. 

We can show that the *only* functions that satisfy this are of the form $f(x) = A\sin(kx) + B\cos(kx)$. It is trivial to verify this, and it's a little more involved to prove this (but it is true!)

As a result, for some function $F(x) = A\sin(kx) + B\cos(kx)$, we have that that $F''(x) = -k^2 A \sin(kx) - k^2 B \cos(kx) = -k^2 F(x)$. Thus, for the eigenvalue $\lambda$, we know that it corresponds to a component with frequency $k = \sqrt{-\lambda}$. A result from the theory of Fourier analysis is that you can decompose any function into a sum of sines and cosines and that the eigenvectors of the laplacian are the components of the function. 

We can then extend this to the discrete case. 