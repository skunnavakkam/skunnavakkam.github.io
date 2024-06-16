+++

title="On LLM Evals"

+++

What information should we want from a LLM evaluation? In almost every use case, we want to understand the peak performance of these models. In all ranges of LLM applications, the provider will modify the LLM environment to elicit the best possible performance out of the LLM. This is the final goal, so we should measure to it.

We have set a goal to **understand the peak performance of each LLM in a set of LLMs**. How do we go about measuring this performance?

This is a really hard task. Here are some examples to illustrate why this task is hard. For these examples, I will simplify things. We assume a universal G-score for model intelligence, which generalizes perfectly. The only thing that affects the LLMs performance on any given task is the wording of the task itself. 

## Example 1:

<u>Hypothetical Eval Proposer Alice</u>: Let's pick a prompt that works really well on GPT-4o. We can then use this same prompt to benchmark other LLMs

<u>Annoying Eval Downer Bob</u>: We know that different teams use different fine-tuning techniques to give their models different personalities. Thus, it is basically guaranteed that fitting on GPT-4o will not be optimal for Claude, for example. 

*Editorial: Why are standardized tests fair then? Aren't there going to be differences in how students react to prompts? The differentiator between standardized tests for students and these evals for models is that the students are able to train to the prompting format of standardized tests, whereas models should not train on their testing set*

## Example 2:

<u>Hypothetical Eval Proposer Alice</u>: We pick a random, "good enough" prompt for evaluations. This does not overfit for any models. Although the absolute score of the model on this evaluation is not reflective of the score that the model would accomplish if we fully optimized the prompt, we can assume that the relative differences in scores would be maintained with elicitation on each model, giving us a good idea of what the "best model" might be.

<u>Annoying Eval Downer Bob</u>: The assumption that models will scale performance similarly after elicitation is doing a lot of work to support this. However, we do not have evidence showing that this is true, and we have some evidence to show that this is not the case, by `gpt-4o` being either significantly better or somewhat worse than other models depending on the level of elicitation. This evidence against the theory is not strong enough to rule out this evaluation, but it does not instill confidence













## Addendum: Judging a Fish By How It Climbs a Tree

Einstein once said a quote like this. Can't remember what it was exactly, but the message still applies. There are metrics on which LLMs are already superhuman by some measures of intelligence. Claude-3 Opus scored 101 on an IQ test. GPT-4o is a hell of a lot better than me at writing Haskell (I can't write Haskell). 

We should be open to the possibility that we do not need A<u>**G**</u>I for truly helpful or dangerous AI models. Given the size of the training corpus of AI models, there is no need for the model to generalize to the experiences that it had experienced post-training, when it has experienced all there is to be experienced in the pre-training phase.

I fear that benchmarks such as the ARC benchmark (confusingly named, and not to be confused with the Alignment Research Center) might be missing the forests for the trees. 