+++
title="How neuromorphic **ARE** current neural networks?"
date=2024-08-10
+++

*part of this blog post was written with the help of Llama-3.1-405b*

Neural networks started off as an attempt to mimic the structure of the brain. The initial perceptron was designed to replicate one neuron in the brain. For a significant amount of time, perceptrons and neural networks were not considered to be the state of the art with regards to artificial intelligence. The current paradigm of deep learning became the paradigm due to Yan LeCun's paper on backpropogation and Hinton's work on AlexNet. 

These deep networks have scaled to be extremely large, measuring trillions of parameters, and showing "hints of AGI". How close are our current architectures to mapping to the brain?

### Scale
The brain is larger than any SOTA models. The brain is estimated to have around $1 \times 10^{11}$ neurons, with no good bound on the number of synapses. For sake of argument, let's say the brain has about $10^{11} \cdot 10^{4} = 10^{15}$ synapses. This is likely slightly too high, with most estimates ranging between $100$ trillion and $700$ trillion synapses. If each synapse in the brain were treated as a single parameter, this puts the brain at the scale of the largest current model, which was the BaGuaLu model, at ~170 trillion parameters.  However, neurons in the brain are significantly more complex than ANN neurons. 

A recent paper claimed that it took between 5 - 8 layers and 1000 DNN neurons in a DNN to approximate a neuron. I'm slightly doubtful that this claim holds - much of this complexity could be overhead, and unnecessary. For example, it may take multiple ReLU units to approximate one GeLU unit, but we would not consider a network using GeLU to have multiple times the number of parameters as an equivalently sized ReLU network. However, I don't think that the main message, that neurons in a neural network are more complex than ANN neurons, is wrong. 

Firstly, my ReLU-GeLU example was a strawman. When removing NMDA channels from the "base model of reality" in the paper, the complexity in the neuron decreased sharply, and only one layer was needed to model the neuron. Secondly, neurons do not act like sole activation functions, and instead have significant signal processing ability. Neurons function differently given different time-domain signals, and have the ability to do XOR operations on these signals, which is not possible given a single ReLU unit. Lastly, and very importantly, neurons are stateful. Different neurons serve distinct purposes. As an example, different neurons use different neurotransmitters. Thus, synapses are a bad analogy to parameters when considering model complexity. 

I don't have a strong prior for the complexity of the brain, but I would estimate that it would be equivalent to a model with around $10^{16}$ or $10^{17}$ neurons. 

### Control of Cognition
Control of cognition is not something unknown to transformers. Mixture of Experts, Mixture of Depths, etc does just this. However, the extent to which the 

