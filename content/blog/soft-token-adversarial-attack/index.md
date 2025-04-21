+++
title = "Soft Token Adversarial Attack"
date = 2025-04-20
+++

This is a writeup for a quick adversarial attack on a language model. The idea is as follows:

1. Take a language model and some target sequence. This target sequence has space size $length * vocab_size$.
2. Start inference off of a "soft" token. This means just a random embedding, that isn't in the vocabulary.
3. Use the model to generate the next tokens
4. Calculate the loss, $CE(target, output)$
5. Backpropogate the embedding with respect to the loss and gradient descent. 

This works really well! With models such as `qwen1.5-0.5b`, we can generate dozens of tokens with a single soft token!

In addition, one option you could try is to use a soft token and a translation matrix $L$ to target two models $M_1$ and $M_2$. Then, you start $M_1$ with some soft token $x$ and then use $L \cdot x$ as a soft token for $M_2$. This allows some control over the two models.

Trying to use this as a semantic map is unfortunately not possible, since it seems like this local minima is fairly sensitive to the position of the soft token. Trying to use something like Orthogonal Procrustes to solve this and translate between the two spaces thus doesn't work, since even a small error after getting the soft token throws off the entire attack. However, Orthogonal Procrustes does work for translation! [source](https://arxiv.org/pdf/1912.10168)

In fact, the mainstream adversarial attack GCG does something similar, by "descending" through computing discrete gradients of token substitutions, and following them greedily. However, I think this is a much more fun way to do it, although you cannot prompt a public model with soft tokens to do anything. 

The attack can be found [here](https://github.com/skunnavakkam/soft-token-adversarial-attack)
