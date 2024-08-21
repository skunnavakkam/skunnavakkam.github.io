+++
title="See how the language model update its priors to minimize error? Very mindful, very demure"
+++

Since I'm going to be talking about two different types of models, one which is a language model and the other which is the language model's model of the context, I'm going to refer to language models as LMs in this post. 

LMs are next token predictors. Through giving the language model a series of tasks in context, where the output of the task is a single token, we can understand the LM's predictions over all possible tokens, and understand how likely the LM thinks that a given token is the correct answer for the task.

Through this, we can also measure how much information we need to feed a LM to allow it to learn a task. If the correct answer for task $i$ is $x_i$, we give the LM 
$$
- \log(P_{i - 1}(x_i))
$$
where $p_i(x)$ is the probability the LM assigns to the token $x$ after the $i$th example. This is just the surprisal. Then, we can find the total amount of information given to the LM to learn the task to be
$$
\sum_{i = 1}^{\infty} -\log(P_{i - 1}(x_i))
$$
Practically, the surprisal goes to zero very quickly if the LM is able to grasp the task, or the LM is never able to grasp the task, and no amount of information is sufficient.

The following is a graph of LM surprisal to learn the task $f(x) = 2x + 3$, and we can see that the surprisal quickly drops to near zero, and very little extra information is given to the LM.

![[Pasted image 20240821144847.png]]

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
![[Pasted image 20240821143643.png]]
We can also look at the LM's probability of A:
![[Pasted image 20240821144824.png]]
and compare this to our simulated, "bayesian" model:
![[Pasted image 20240821145133.png]]
As a side note, the value of $c$ that best approximated this distribution was $\ln{2}$. This seems very strange!