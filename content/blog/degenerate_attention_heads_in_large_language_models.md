+++
title="Redundant Attention Heads in Large Language Models For In Context Learning"
date=2024-08-31
draft=false
+++

This is a cool result I got from working on another interpretability projects. 

In this article, I claim a few things and offer some evidence for these claims. Among these things are:
- Language models have many redundant attention heads for a given task
- In context learning works through addition of features, which are learnt through Bayesian updates
- The model likely breaks down the task into various subtasks, and each of these are added as features. I assume that these are taken care of through MLPs (this is also the claim that I'm least confident about)

To set some context, the task I'm going to be modelling is the task such that we give a pair of $(x, y)$ in the following format:

```
(x, y)\n
```

where for each example, $y = 2x + 3$. As a concrete example, I use:
```
(28, 59)
(86, 175)
(13, 29)
(55, 113)
(84, 171)
(66, 135)
(85, 173)
(27, 57)
(15, 33)
(94, 191)
(37, 77)
(14, 31)
```

All experiments here were done with `llama-3-8b` using TransformerLens running on an A100-40GB unless specified otherwise. 

# Claim 1. Language models have many redundant attention heads for a given task

To probe this, I patch activations from the residual stream of a model given context to a model that doesn't. As a result, it is possible to see where task formation happens. Initially, without any modifications, the hook point that first works to patch over some semblance of the original task was layer 12. At this layer, it seems like the model learns that $y \approx 2x$.

Ablating all attention heads on layers 10 and 11 of the model given context (which I will now reference as Model A, and let the other be model B) does not change the model's answer significantly. However, when repeating patching, the first point that works is the portion of the residual stream before layer 14. 

This can be confirmed through attention patterns, where backup heads on layer 13 activate very strongly after the initial ablation. Ablating layer 13 does something similar, except this time the first layer that works shifts from 14 to 16, with heads on layer 15 activating very strongly in response.

Ablating layer 15 still results in the model coming to the correct answer. However, patching is different in this case. From patching, on no layer of patching does this behavior where the output should be $\approx 2x$ form. Instead, almost the exact answer is copied over from model A. 

Instead, part of the model's strict response is formed. However, not all of it is formed at this layer, and instead parity is learnt after this. 

There are clearly a large number of portions of the model responsible for in-context learning. Otherwise, ablating heads responsible for in-context learning would result in an incorrect answer without redundant heads. This weakly supports Anthropic's initial hypothesis that in-context learning is driven primarily by induction heads, since we also find induction heads *everywhere* in large language models. 

# Claim 2. In context learning works through addition of features, which are learnt through Bayesian updates

This is a weaker claim that the first, and I have less evidence to support it. 

I have a good amount of evidence that shows that language models update approximately Bayesianly to in-context learning tasks. More specifically, if you segregate answers into two buckets, $A$ and $B$ where $A$ represents the probability of the correct answer, and $B$ represents the probability of the incorrect answer. $A_i$ represents probabilities after seeing $i$ examples. 

With each training example seen, a Bayesian update would be:
$$
A_{i + 1} = \frac{A_i \cdot c} {A_i \cdot c + B_i \cdot (1 - c)}
$$

$$
B_{i + 1} = \frac{B_i \cdot (c - 1)} {A \cdot c + B \cdot (1 - c)}
$$

with the model having some prior for $A_0$, with $B_0 = 1 - A_0$, and $c$ being the model's expectation that the observation is true.

As a result, 

$$
\log(A_{i + 1}) = \log(A_i) + \log(c) - norm
$$

We can now drop the normalization constant, instead saying

$$
A_{n}, B_n = \text{softmax}(\log(A_0) + \sum_{i=0}^n \log(c), \log(B_0) + \sum_{i=0}^n \log(1 - c))
$$

Now, we only need to keep this normalization constant around to ensure that the sizes of $\log(A)$ and $\log(B)$ stay reasonable, since they would lose precision as they decrease. In this way, we can represent Bayesian updates as a sequence of additions, with the softmax built in for free with the language model.

This provides a clean reason for why features seem to be updated Bayesianly. For each example, each previous example confirming the pattern attends to the $i$th example, and adds a constant update term (equivilant to $\log(c) + norm$) to the $i$th example. 

Mechanistically, I would expect this to be similar to this feature being added from every pair of examples where the attention head thinks the two examples look similar, thus causing the model's expectation for $y_j$ to be formed from the addition of $j \cdot feature$

This supports the general linear representation hypothesis. In addition, this also plays nicely with the idea that different features are learnt at different points of the model in-context, since no knowledge of the prior is needed for this to work. This allows for parity, the idea that the output is a number, and the idea that the output is $\approx 2x$ to be added at different points in the model.

One thing I'm still slightly unclear about is how the model is able to crystalize this in the answer, and why patching at different points shows different behavior as to when the model crystalizes the answer (such as during my part in claim 1, where model B started reporting the actual answer, instead of learning the task).

My current hypothesis for this is two part:
1. That the point which is represented by the sum of the features $y \approx 2x$, $ y \bmod 2 \equiv 1$ , that $y$ is a number, and a prior for $x$ maps to $y = 2x + 3$
2. That before the layer where we see model B reporting the answer to model A's task, the prior for $x$ formed by model A is already added to the residual stream

# Claim 3. The model breaks down the task into subtasks. MLPs are responsible for this.

Broadly, the algorithm that I have in my head is roughly:

1. One attention head attends from $x \to y$ for a single example $(x, y)$, and brings information about what $x$ is. Hopefully, and likely, these vectors that convey what $x$ is and what $y$ is are both in the residual stream position of $y$, and approximately orthogonal. I think it's fairly likely that this is an induction head!

2. Then, an MLP acts on this, breaking down the two directions into a superposition of a bunch of features representing what the transformation $x \to y$ is, with the size of these features approximating how confident the MLP is that the transformation is the correct one.

3. After this, another attention head attends from the $y_i$ token to the token before $y_j$, with $j > i$. This is responsible for adding the feature that corresponds to the transformation, updating it Bayesianly. I think that the size of this update is probably only proportional to the MLPs confidence in the transformation.

My evidence for this is that of the heads that were ablated to show redundancy, the heads that contributed the most in any given layer had attention patterns that looked similar to what you would expect is point 3 were true. 