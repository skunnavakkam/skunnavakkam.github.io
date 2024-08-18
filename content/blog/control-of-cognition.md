+++
title="WIP: Mixture of Blocks"
date=2024-08-18
+++

The brain is different from language models in many ways, but one important difference is the ability for the brain to control its internal flow of information. At any given time, a very small portion of the brain (<20%) is actually ever active / doing computation. 

A nice benefit of this is that this allows the brain to be more interpretable than if the whole brain were active at any given time. For example, certain parts of the motor cortex are active when certain muscles move, allowing us to interpret these parts as being responsible for particular locomotion. 

From the perspective of energy conservation, this absolutely makes sense. Doing less things is more energy efficient, and not all tasks require the full use of the brain. Being able to reduce the amount of energy used to do tasks is undoubtedly good and evolutionary advantageous. Having the brain activate sparsely, with routing, is a way to achieve this. 

Some language models achieve this efficiency improvement through mixture-of-experts or mixture-of-depths methods, increasing performance per FLOP at the cost of VRAM. 

However, control of cognition not only results in an efficiency increase, but also may result in a significant capabilities increase. 

There is evidence from interpretability that different layers in transformers have different functions, with early layers generally transforming the task into representations that further layers are able to chew on ([citation](https://openreview.net/pdf?id=oFC2LAqS6Z)).  However, other papers show that providing different representations of data to a transformer result in drastically different performance ([citation](https://www.alignmentforum.org/posts/4KLHJY9sPE7q8HK8N/fine-tuning-is-not-sufficient-for-capability-elicitation)). What gives?

In "[When fine-tuning fails to elicit GPT-3.5's chess abilities](https://www.alignmentforum.org/posts/4KLHJY9sPE7q8HK8N/when-fine-tuning-fails-to-elicit-gpt-3-5-s-chess-abilities)", the author argues that the key difference between how Language Models and Humans approach this task is that humans build a model of the task through taking in data and then running an optimizer on this model. Although I have no experiment to argue this, I would argue that building this world model and doing work on it is exactly what language models and humans both do. Instead, I think that the key difference is that language models simply do not have enough layers dedicated to this sort of "model building."

Chain of thought probably does something similar in being able to transform data between representations. However, not only is chain of thought wasteful from a compute perspective, I have doubts about whether sufficient information that is present in the internal representation of the model is contained in the chain of thought output of the model. Chain of thought does give us important insights, namely that you can get a useful model of the task through repeating the same computation.

Allowing the model to skip blocks, repeat blocks multiple times, and in multiple orders, might allow for better processing. However, how do we enable this? Backpropogation does not allow for recursion!

Consider a different mixture-of-experts algorithm that allows for control of cognition. After the embedding layer, we add to the residual stream like standard. However, instead of adding blocks to the residual stream in a standard order, we instead feed in the residual stream to a gating model, adding onto the residual stream in this way, with the Attention + MLP block picked by the gating network.

*This is a work in progress, and I don't quite have a good way to measure the loss after the attention + mlp is applied, nor do I have a good idea for an exit condition*


