+++
title="DNA as fixed length codings"
date=2024-09-10
+++

We treat DNA as an instruction to synthesis proteins . To formalize this, we can define the program $R$ for ribosome
$$
R: \{0, 1, 2, 3\}^n \to (p_1, p_2, \cdots p_m)
$$
where $p_1, p_2, \cdots, p_m$ are proteins. 

Since proteins are of variable length, we need to encode a delimiter to seperate proteins from each other. These are equivilant to STOP codons. 

A length-$k$ protein $p$ is equivilant to $A^k$, where $|A| = 20$, which are the number of amino acids we humans. synthesize. This expands causes a vocabulary of $20 + 1 = 21$, including the STOP codon. 

We bound the number of bases needed per represented amino acid as 
$$
\log_4(21) < 2.2
$$

If DNA were perfectly compressed, we should expect around $2.2$ bases per amino for very long proteins. This isn't the case. Each amino acid is represented by $3$ bases. This is fairly natural for any fixed length encoding scheme. 

However, through assigning multiple codons to the most common amino acids, DNA can save on the number of comparisions being done by the ribosome. Take a case where there are 16 possible amino acids $\in A$, codons of length $s \geq 2$

Also, suppose that $A_0$ was $85$% of all manufactured amino acids, and each remaning element $A_1, \cdots A_{15}$ each were $1$%. In this case, a map between $A \to {0, 1, 2, 3}^2$ yields $2$ comparisions per amino acid. 

On the other hand, a map $F: A \to {0, 1, 2, 3}^3$ could be much more computationally efficient. Take the output string of this map $S$. Then, if $S_0 = 0$, then $F^{-1}(S) = A_0$. We can dedicate the remaining 8 numbers representable with the first two bits to $A_1, \cdots, A_8$ (this corresponds with the case where $S_0 \neq 0 \land S_0 \neq 3$) and use the combinations where $S_0 = 3$ to represent $A_9, \cdots, A_{15}$. This gives us $7$ computations that take $3$ comparisions each, $8$ that take $2$ each, and $1$ that takes $1$. However, taking the weighted sum 

$$
0.85 * 1 + 0.01 * 8 * 2 + 0.01 * 7 * 3 = 1.22 \text{ comparisions per amino}
$$

This is a constructed scenario, but real DNA is somewhat similar! The four most common aminos each have $\geq 4$ combinations of three bases (or states) assigned to them, while the few least common have only $1$ or $2$

