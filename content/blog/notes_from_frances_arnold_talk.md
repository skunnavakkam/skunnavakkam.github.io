+++
title="Notes from a talk from Dr. Arnold"
date=2024-10-03
+++

*Frances Arnold is a nobel laureate in Chemistry and a professor at Caltech. I was able to attend a talk by her on evolving proteins. I thought that this was an exceptionally cool talk, and I wanted to write a little about it! Obviously, none of this is my own research, and is almost entirely paraphrased from Dr. Arnold's talk*

Humans are really bad at engineering proteins. Given that there are $20$ possible amino acids, there are $20^n$ possible proteins of length $n$. This is a huge space for scientists to search through manually, and is likely impossible. Evolution, on the other hand, is able to search through the space of proteins decently well. 

However, nature is bad at generating diversity. Nature usually only searches a small portion of possible proteins, because certain proteins are just not as likely to form. On the other hand, we have the power to make arbitrary synthetic DNA, allowing us to create proteins and compounds, through protein evolution, that do not have counterparts in nature. Notably, given that $20^{300}$ proteins of length $300$ exist, almost None of these have existed, ever, so there are a large space of possibilities that we can search that nobody has ever searched.

$$
20^{300} \approx 10^{400} \textrm{ proteins of length } 300
$$

$$
\frac{10^{100} \text{ particles in universe} \cdot 4 \times 10^7 \text{ seconds since big bang} \cdot 10^{15} \text{ molecules per second}}{10^{400}} 
$$
$$
\approx \frac{4 \times 10^{122}}{10^{400}} \approx 0
$$

Evolution has a nice way to do this, and we reference "Natural Selection and the Concept of a Protein Space" by John Maynard-Smith for this!

> [Salisbury] calculated that the number of possible amino-acid sequences is greater by many orders of m agnitude than the number of proteins which could have existed on Earth since the origin of life, and hence that functionally effective proteins have a vanishingly small chance of arising by mutation.

This is obviously not True, since we do know that functionally effective proteins do exist. Maynard-Smith proposes a model of protein evolution as follows. There are $20$ amino acids that the body works with. Say that a protein is a string of the amino acid language $A$, where $A_1, A_2, \cdots A_{20}$ are the $20$ amino acids.

Then, take some protein 

$$
A_i A_j A_k A_l
$$

Maynard-Smith proposes that evolution is able to walk the path of all *functional* proteins that are Hamming distance 1 from the previous protein, where Hamming distance counts the number of locations where the two proteins differ. For example, 

$$
A_i A_j A_p A_l
$$

is a valid move, but

$$
A_i A_j A_p A_q
$$

is not.

Running this on PDB kinda confirms this, with code findable [here](https://github.com/skunnavakkam/protein-evolution-experiment). When constructing a graph, placing amino acid strings at nodes, and connecting nodes with Levenshtein distance less than 1, you find that a ton of functional proteins are only on levenshtein move away from another functional protein. 

We can establish the chance that any string has a levenshtein neighbour easily. It is simply the number of neighbors $(|\Sigma| - 1) \times L + (|\Sigma|) \times L + L$ divided by the number of possible strings $2 ^ {300}$. This gives


$$
\frac{12000}{2^{300}} \approx 0
$$

This means that seeing *any* connected components is really cool!

However, the unfortunate things is that the loss landscape of the proteins are not great. There often isn't just a single local maxima. However, a lot of randomness and a lot of search are useful to counteract this. I believe that in Arnold's Nobel winning work, her lab searches through $10^{15}$ or so mutations in DNA per "epoch". After this, these proteins are then screened in order to find useful proteins that can then be evolved. After screening, the DNA is then recovered, multiplied, and then mutated again. For the machine learning corollary, this seems to be doing machine learning but with huge batch sizes.

As a test of this, Arnold uses directed **evolution** to synthesize organosillicates, since organosillicates are common by human processes but not found in nature, and this was done through evolving Cytochrome C enzymes to form this bond. I don't quite understand this, but have been reading through this paper in order to :) [link](https://www.science.org/doi/epdf/10.1126/science.aah6219)

As a result, through this process, she was able to engineer C-Si bonds and C-B bonds, both of which are not finable in nature. She concluded this lecture by talking about things that could be achievable through AI modelling, such as making this whole process of ideation and directed evolution achieved using an ML research assistant. 



