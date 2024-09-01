+++
title="Language Model for Social Science"
date=2024-08-28
+++

Language models are generally trained to approximate the outputs of the humans who generated the data. As a result, language models should also accurately approximate the preferences of these humans.

Humans do the sampling before resolving their preference to a single option. This means that we're unable to see their underlying preferences, and it's difficult to crack open a human brain while still retaining useful information (citation needed). Thankfully, this isn't the case with language models.

Since language models output probability distributions over the next token, feeding a language model some arbitary context and soliciting a vote is viable. Furthermore, the probability distribution over this vote is also visible. As a result, simulating more complex behavior, such as real elections, is possible.

One major caveat is that in reality, what the language model is predicting is the chance that each candidate would be the candidate picked by most people. As a result, we are making the assumption that given a candidate $x_j \in x$, where $x$ is a list of all candidates, 
$$
\sum_i P_i(x_j) \approx P(x_j \text{ gets the most votes})
$$

# Toy Scenario 1: Ranked Choice Voting
We want to simulate ranked choice voting. This is simple. Provide the language model some context about itself, context about the election, and some context about the things that the model is voting for, and look at it's logits.

The context about itself might be as simple as randomly picking some values for how much the model cares about the topic. eg: You are strongly against/against/neutral/for/strongly for abortion/gun control/immigration/single payer healthcare etc

Take logits, mask out any tokens that aren't the candidates you want by setting them to $-\infty$ and sort them. This is your ranking (you can add a random vector before softmax if you want). 

You can just evaluate this, and update the context, into the future as a simulation.

# Toy Scenario 2: Gerrymandering
We want to replicate all of voting, especially the good parts. 

AlphaPhoenix has a cool video about gerrymandering, but what if you don't actually have this data? Easy, just simulate the data with a language model, and then gerrymander. 

# Toy Scenario 3: How might certain events update voters?
I think that updating in text, and keeping next-token prediction, should work for this.


