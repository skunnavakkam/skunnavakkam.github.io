+++
title="i'm fairly bearish on all analog computing"
date=2024-09-10
+++

This is a backlog (blog?) for the stuff I did back in sophomore and junior years of high school, where I played a lot with all-optical computing. 

To be specific with my claim, I don't think that it's very likely that generalized, all-analog computing will be a thing  at scale. By optical, I mean any system that doesn't do computation in discrete states, and with some physical quantity representing values (power, photons, voltage, current, etc). Some things that don't fall under the things that I'm claiming are:
- Analog matmul accelerators
- Specific hardware in production for small sensing

However, I think that all-analog computing kinda fails at the very large scale, when compared to alternate technologies. The sell of analog computing is that it could be faster and cheaper and more energy efficient. I think that all of these are roughly true. However, scaling up leads to a lot of problems, that are just mitigated by using whatever technologies are being used, with some discretization.

I came into this area from the idea of all-optical computing, so I'm going to focus on this area to provide comment, but I would be surprised if these comments did not generalize.

The issue with analog computing is loss and susceptibility. In order to do computing, you need to manipulate values either up or down. If we don't add in net power, the only way to manipulate values is to reduce them. Through this, they will shrink. As a result, we need to magnify the signal to some extent, adding in some noise.

We have to ensure that the systems that we train are not susceptible, since there is noise being added in at most steps. However, this means that the amount of useful data that we have gets smaller, and instead you have to design for seperate bins corresponding to different values. As a result, this automatically has a discretization step, or the precision of your results is reduced.

Furthermore, you have to now design your systems so that they are not susceptible, meaning that changes in the input result in smaller changes in the output. This is also best achieved through having discrete states, with sharp transistions between them, so moving within a state does not change results much.

I'm not a doomer in this regard, and I do think that being able to do optical discrete computing is super useful. In addition, there are tons and tons of signal processing operations that simply do not require any complicated non-linearity, and are not sucseptible to any of the caveats - such as telescopes, microscopes, etc.

However, there is a dream amongst academics pitching non-linear optical materials, where we can run all analog neural networks. I suspect that these academics will end up converging on using binary arithmetic in the end. 

As a further appeal to authority, our brains are hardly analog at scale. On the level of a single neuron, specifically the dendrite and axon body, there is undoubtedly some impressive signal processing capability, implemented in the analog domain. This does not generalize to clusters of neurons, which pretty much are binarized through their firing. 

The only vision I think is viable for analog computing is one where these analog data are but into binary states, and the speedups of doing math in the analog domain, and further parallization, still apply. I think it's a bit cheeky to call this analog though.