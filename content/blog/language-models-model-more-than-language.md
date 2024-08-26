+++
title="See how the language model updates its priors to minimize error? Very mindful, very demure"
date=2024-08-21
draft=false
+++

Since I'm going to be talking about two different types of models, one which is a language model and the other which is the language model's model of the context, I'm going to refer to language models as LMs in this post. I'm also still in the process of writing this. If you don't see source code in the next few months, or you want immediate access to source code, just shoot me an email :)

LMs are next token predictors. Through giving the language model a series of tasks in context, where the output of the task is a single token, we can understand the LM's predictions over all possible tokens, and understand how likely the LM thinks that a given token is the correct answer for the task.

Through this, we can also measure how much information we need to feed a LM to allow it to learn a task. If the correct answer for task $i$ is $x_i$, we give the LM 
$$
-\log(P_{i - 1}(x_i))
$$
where $p_i(x)$ is the probability the LM assigns to the token $x$ after the $i$th example. This is just the surprisal. Then, we can find the total amount of information given to the LM to learn the task to be
$$
\sum_{i = 1}^{\infty} -\log(P_{i - 1}(x_i))
$$
Practically, the surprisal goes to zero very quickly if the LM is able to grasp the task, or the LM is never able to grasp the task, and no amount of information is sufficient.

The following is a graph of LM surprisal to learn the task $f(x) = 2x + 3$, and we can see that the surprisal quickly drops to near zero, and very little extra information is given to the LM.

![](../lm-surprisal.png)

It is also interesting to understand how the language model updates it's priors. We only need to consider two cases: when the correct answer is $2x + 3$ and when the correct answer is not. We can call these two states $A$ and $B$ respectively. Initially, the model has some prior $\theta$ over the two, such that $P(A | \theta) + P(B | \theta)$ = 1. To give more granularity, we can say that $\theta_i$ is the prior after $i$ training examples.

Now, we can model this using Bayesian statistics.

|             | A                   | B                        |
| ----------- | ------------------- | ------------------------ |
| Prior       | $\theta_A$          | $\theta_B$               |
| Observation | $c$                 | $1-c$                    |
| Posterior   | $\theta_A \times c$ | $\theta_B \times (1- c)$ |

Our final probability for $\theta_{i +1, A}$ is
$$
\frac{\theta_{i, A} \times c}{\theta_{i, A} \times c + \theta_{i, B} \times (1- c)}
$$
Using this bayesian model to "simulate" the LM updating it's priors, we get a similar looking graph of surprisal over time!

![alt text](../simulated-surprisal.png)

We can also look at the LM's probability of A:
![](../lm-prior.png)

and compare this to our simulated, "bayesian" model:
![](../simulated-prior.png)

As a side note, the value of $c$, or the sensitivity, that best approximated this distribution was $\ln{2}$. This seems very strange! I need to test more types of tasks to see if this is a constant among language models.

We can also probe through the model of the task that the LM forms. Initially, we probed the correctness of the response by looking at the logits.

$$
(x_1, y_1), (x_2, y_2), \cdots, (x_n, \square
$$

With the previous examples, we see what the language model predicts for the square, and with what probability. Now, we instead look at what option the language model thinks is most likely as we vary $x_n$, while maintaining the same context.

The following is the prediction after 0 examples, with the residual being $y_{true} - y_{pred}$. The model starts with the prior that $y \approx x$.

![alt text](../zero-examples.png)

After two examples, the LM updates, knowing that $y \approx 2x$

![alt text](../two-examples.png)

After three examples, the LM realizes that $y$ is always odd.

![alt text](../three-examples.png)

After this, the LM then tunes its model from $2x + \text{odd}$ to $2x + 3$. There are slight errors that are fixed over the course of the remaining examples, but nothing worth writing about.

I think that this is pretty remarkable. In order for the LM to have some idea about it's prior, it would need to know it's prior in the first place. From the original logit lens paper, the author suspects that the LM immediately converts tokens into prediction space. This gives a prior from which we can build off of. 

This logit lens on the token before a y-value shows some surprising behavior! For example, even after 10 layers in the model, the network does not predict that any numerical token (shown in red), let alone the correct y-value, should be the answer. The model first predicts any integer as the topmost token on the 21st layer!

![alt text](../top_tokens_10_layers_in.png)

However, the model does have some really interesting behavior on how it updates its LM of what the most likely answer should be across distribution of integers.

![alt text](../second_harmonic.png)

When the LM starts to form a distribution over the integers that isn't uniform, two distinct peaks emerge. One corresponding approximately to $y = 2x$, and the other to $y = 4x$! In my past Physics research, these **second harmonics** were super common, but seeing them here is super unexpcted (and I'm not sure if this reproduces). As this evolves through layers, a few things happen: the uncertainty around each peak goes down, and the $y=4x$ peak shrinks to being ~0. I'm fairly sure that this is a manifestation of the LMs confidence in what "goes into" a correct answer increasing. 

Now let's look at heads (capped to +- 3):
![jackpot!](../heads.png)

We see very strong contribution from heads in layer 21, which is also where we first start to see a number in the signal. However, more dilligence needs to be put into this. Q: when activation patching at a given layer, when do we first see a task similar to $y=2x+3$? A: layers 12, 13, 14, 15. Patching breaks after layer 15, in an interesting failure mode - the model now outputs what the correct answer is from the string we patch from, internalizing the answer instead of the rule. 
 





