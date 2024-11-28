+++
title = "Sparse Matrix Optimization"
date = 2024-11-26
+++

I used to work a decent amount in scientific computing. One of the most common datastructures encountered was the sparse matrix. Specifically, the ability to solve the equation 

$$
A x = b
$$

where $A$ is a sparse matrix is incredible useful.

Consider the following example: solve the Kirchoff's circuit laws for a large resistor network. This is a set of equations of the form $\sum a_i x_i = b_i$, but only a few of the $a_i$ are non-zero (since each resistor only connects to a few other resistors). We can solve this system of equations using a matrix $A$ and vector $x$ where $A$ represents coefficients $x$ represents the voltage you are trying to solve for.

I've wanted to understand and optimize sparse matrix operations for a while now, and this seems as good a time as any. For convention, assume all matrices are square, and have dimension $n$.

Naively, one might try to solve the equation $A x = b$ by multiplying both sides by $A^{-1}$. However, the sparse matrix requires $O(n)$ memory, whil the inverse $A^{-1}$ is not guaranteed to be sparse, and instead uses $O(n^2)$ memory. Furthermore, inverting a matrix is costly, requiring $O(n^3)$ operations.

