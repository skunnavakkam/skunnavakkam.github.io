+++
title="Trying to improve Long Term Planning"
date=2024-03-16
+++

In this piece I will propose a framework to allow AI models to do long term stochastic planning. I will first introduce the idea of the manager and the worker.

The worker has no knowledge of the main task. It is around the most basic an agent can be, with simple tool calling. It only uses a small subset of tools that the overall environment has — and this is for the purpose of efficiency. This is trivial, and I shall not spend too much time on it. 

The task has a root node, which is where the manager is given the main task. At this node, the manager should _evolve_ the state from that node forward, in two ways. The first way involves the manager keeping an internal representation of the state, and approximately evolving the state. The second way is the manager carrying out the task. Both are important. 

# Internal Representation

The agent here evolves its state much like **MuZero** would. Unlike **AlphaZero**, which is given access to a one-to-one simulation of its environment as it "thinks", **MuZero** has to update its environment based purely on what it thinks its environment will look like at the next step.

Large Language Models are fairly good at this crude approximation, especially for cases that are well represented in their training data. GPT4 class models are fairly good at emulating bash terminals, for example. 

Starting at the base node, we get a weaker model to generate and update itself. At each step, we generate actions that are dissimilar in action space, and then enlist a rating model to prune down these actions based on their chance of success. This generates a tree of actions as a plan. Note that this plan doesn't have to reach the end of the task, and instead just has to get to a point between the start and end of the task. 


