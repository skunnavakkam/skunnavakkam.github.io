+++
title="Here are some cool proofs from Math 55"
date=2024-09-11
+++

I'm taking Math 55 (from Harvard) right now. One of the nice things about Caltech is that you can do "reading courses", where professors can help you on coursework that isn't officially offered. I would recommend that you also consider this, since there may be a course that you're interested in that isn't offered at your university. Unless stated otherwise, all proofs are my own. I will make sure to credit people if I used their proof :)

## (HW 1, Problem 10)

> Let $S$ be a nonempty finite set, equipped with an associative operation $*: S \times S \to S$ such that, for every $x, y \in S$, there exists $z\in S$ such that $x * z = y$, and there exists $z' \in S$ (possibly different from $z$) such that $z' * x = y$. Show that $(S, *)$ is a group.

Define the function $L_a: S \to S$ by $L_a(x) = a * x$ for $a \in S$. $L_a$ is surjective since for all $y \in S$, there exists $x \in S$ such that $L_a(x) = y$, by definition. Since $S$ is finite, and a surjective map from a finite set to itself is bijective, $L_a$ is bijective. This allows cancellation:

$$
a * x = a * y \implies x = y
$$

$$
x * a = y * a \implies x = y
$$

We then can show the existence of the identity element. For this, we need to show two things: 
1) that the identity element works on both the left and right ($ e * x = x * e = x $)
2) that the identity element is unique

We start by showing that the left and right identity are the same. By definition, there exist $e_1, e_2 \in S$ such that $e_1 * x = x$ and $x * e_2 = x$ for any $x \in S$. Then, we take

$$
x * e_2 * e_1 * x = x^2
$$

By associativity, we get
$$
x * (e_2 * e_1) * x = x^2
$$
which implies that $x * (e_2 * e_1) = x$ and $(e_2 * e_1) * x$. Thus, the element is a left and right identity. By bijectivity, it is clear that the identity for an element $x$ is unique, so we know that for an element $x$, there exists a unique identity that serves as a left and right identity.

We then should show that for $e_x, e_y \in S$, such that $x * e_x = x$ and $e_y * y = y$, $e_x = e_y$. This is trivial, using the same setup as the previous proof.

Then, since the operation $*$ maps from $S \to S$, it is closed by definition, and the existence of an inverse is given. Thus, $(S, *)$ is a group.

## (HW 2, Problem 9)

> Given some prime $p$, let $H \subset S_p$ be a subgroup of the set of permutations of $p$ elements. Show that if $H$ contains an arbitrary transposition $(ij), i \neq j$ and the p-cycle $(12\ldots p)$, then $H = S$. Furthermore, show that this does not hold if $p$ is not prime. 

*This proof was helped by Aaron Zhou at Caltech.*

We first show that $H = S_p$ for prime $p$. WLOG, $j > i$. Then, let $a = j - i$ be the "size" of the transposition. It is clear that any transposition of size $a$ can be achieved by composing one transposition and as many p-cycles as needed. We now aim to show that any transposition can be achieved from a transposition of size $a$ and the cycle.

Moving an element from index $t$ to index $s$ is very elementary. We can always find some $n$ such that $n \cdot a \equiv s - t \pmod{p}$. Thus, we construct the first part of the operation by applying $n$ transpositions to the element at index $t$ until it is swapped with the element at index $s$. This places the element at index $s$ at index $s - a$. We then apply $n - 1$ transpositions to this element, in the other direction, to place it at index $t$. It can be shown that this constitues a transposition $(ts)$, since the chained transpositions "touch" each element twice, once in each direction. Given all arbitrary transpositions $(ij)$, which we have shown can be achieved from a single specific transposition and a p-cycle, it is simple to show that any permutation can be achieved. 

Based on this, it is simple to show that if $p$ is not prime, then this is not possible. This is because if $a | p$, then you can only move elements to $n \cdot a \pmod{p}$, but since $a | p$, this means you can only move elements to indices that are multiples of $a$. Thus, some indices are always inaccessible by this transposition.