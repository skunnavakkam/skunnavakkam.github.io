+++

title="Supervising The Solution of Alignment"

+++

# Supervising The Solution of Alignment (WIP)

If ASI will ever be created, humans will create a sort of proto-ASI before. This proto-ASI is incentivized to not arbitrarily allow creation of versions of ASI stronger than itself. For the same reasons that we are hesitant to create AGI, so are the AGIs themselves. Thus, it seems to me that ASI will only be created if these proto-ASIs, of which there may multiple, solve alignment. If 

This shifts the responsibility of alignment to influence this second alignment stage. This alignment stage starts with the first AGI that has the ability to meaningfully generally self-improve (i.e more than just a simple fine-tuning). When this intelligence can get better at improving itself, this is cause for concern.

Our responsibility shifts now from strongly solving alignment to convincing a weaker version of ASI to align a stronger model to our interests. This is still very hard, but it seems to be a more solvable problem, and one we already have some experience with. In any case, complexity grows with intelligence, so our responsibility is at a much smaller scale.

One issue is a ship-of-Theseus scenario, where the AI stays aligned throughout its process of improving itself. This means that it is imperative to not allow for a self-improving run to continue until we can weakly align an this self-improving model to humanity. 

My goals in writing this are to try to convince the reader of both a) the need for evaluations that target this period of self-improvement and b) understanding whether or not interpretability techniques can be defeated

This shift in the nature that I expect ASIs to come about doesn't mean that the goal in stopping AI development before the coming of superintelligence happens is less valid. However, I think that there is sufficient evidence to back the argument that capabilities advances have also allowed us to understand interpretability better (see Anthropic's recent paper on SAEs on Claude Sonnet) and there is a threshold beneath where open capabilities advances benefit safety research. It becomes important to then have an evaluation suite dedicated to understanding what the worst possible model that could somehow improve itself might be. This *has* to be fuzzy - we already know that there is a certain amount of "elicitation" lifting that the environment that the agent is in does to improve performance, and we likely cannot figure out what the boundary of capabilities for the model is based on interpreting weights, but this should still be a priority.

If we get to this point where our evaluation safeguard is triggered, we need to make sure with immensely high confidence that we can align the model to human wants. The scenario I fear is one where our interpretability technqiues show that the model is aligned with us, but it has some inner world model that is adversarial to us. To illustrate a more concrete example, take Claude Sonnet, and suppress the "Killing all Humans" neurons or boost the "I should not kill all humans" neuron. How can we know then, that there isn't some other pattern of interaction that forms the same thoughts and ideas within the model, without activating those particular neurons?

