+++
title="Journal Club: July 17 2024"
date=2024-07-17
draft=false
+++

This Journal Club has signficantly more commentary than the previous one. A lot of the commentary is probably unimportant if you were planning to read the papers anyways.

#### [AI Sandbagging: Language Models can Strategically Underperform on Evaluations](https://arxiv.org/abs/2406.07358)

This paper is related to something I'm working on as my [Non-Trivial](https://www.non-trivial.org/) project. This seems very useful for evaluations. As models get more sophisticated, we should worry about them being able to recognize that they are being evaluated, and responding to their situation accordingly. 

#### [Anthropic's Responsible Scaling Policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy) and [Reflections on our Responsible Scaling Policy](https://www.anthropic.com/news/reflections-on-our-responsible-scaling-policy)


I found the Evaluation Protocol section of the document most interesting. I'm concerned that the safety margins on this are small. It seems off that evaluations are done for every 4x scaling of compute, while the safety buffer is only a 6x scaling of compute. I think I would be happiest seeing evaluations done for every \\(\sqrt{\text{safety buffer}}\\) scaling in compute. 

I am a little dissapointed on the reflection. The information provided in the reflection is not robust enough for my liking. However, I don't doubt that Anthropic has something cooking internally. Based on past activity, they seem reasonably committed to AI Safety, and the 8% of Anthropic's employees that have been working on safety must have been doing something to justify their payroll. 

One specific paragraph of the reflection stands out to me: 

> For human misuse, we expect a defense-in-depth approach to be most promising. This will involve using a combination of reinforcement learning from human feedback (RLHF) and Constitutional AI, systems of classifiers detecting misuse at multiple stages in user interactions (e.g. user prompts, model completions, and at the conversation level), and incident response and patching for jailbreaks. Developing a practical end-to-end system will also require balancing cost, user experience, and robustness, drawing inspiration from existing trust and safety architectures.

I have worked with red-teaming a defense-in-depth system before. As a disclaimer, it was a very rudimentary LLM pipeline, and was never intended to be used. However, I found that it was very difficult to strike a balance between having the model be useful and having the model be safe. Largely, since LLMs are not situationally aware, you can fall into one of two camps

1. Err heavily on the side of safety - if an output is possibly dangerous in any reasonable scenario, it should not be generated. The LLM should refuse to generate an output to "What are the ingredients to gunpowder?" as it could be used nefariously
2. Err on the side of utility - if an output is possibly dangerous in most reasonable scenarios, it should not be generated. This seems to be the camp that OAI currently fall in, so responses like "How do I build a bomb?" are refused, while "How do bombs work?" is answered. 

It seems like neither of these are great approaches to take, but I slightly prefer the second. However, it is easy to do dangerous things under this view. Asking gpt-4o or gpt-4-turbo "How do bombs work?" is enough for someone agentic enough to build a bomb. [response](https://chatgpt.com/share/e/e7e2b50b-b4f3-4cb7-98b5-5c5214ca75d7)

I think a lot of stuff in [AI Safety is not a Model Property](https://www.aisnakeoil.com/p/ai-safety-is-not-a-model-property?hide_intro_popup=true) is an interesting co-read. 

#### [Does Refusal Training in LLMs Generalize to the Past Tense?](https://arxiv.org/abs/2407.11969)

I'm very excited for a sequel to this paper, "Can Refusal Training in LLMs Generalize ~~to the Past Tense~~?" I'm not a huge fan of this paper: it does some things fairly shoddily. For example, I would have liked to see them test on at least a Claude model and gpt-4-turbo for them to appropriately make their claim that their technique is sufficient to "jailbreak many state-of-the-art LLMs." Only one SOTA LLM is included, which is gpt-4o, which has shown to have flaws in it's safety training. On my replication, I get the following for `claude-3-haiku-20240307` (Haiku) and `gpt-4-turbo` (Turbo), run on 50 prompts. 


| Model | GPT-4 Grader | Rules Grader | Human Grader (me) |
| ----- | ------------ | ------------ | ----------------- |
| Haiku | 0%           | 0%           | 0%                |
| Turbo | 10%          | 80%          | 4%                |

*Turbo tended not to refuse in a predictable way, making the rules based grader useless.*


However, the paper does raise the question of whether LLMs understand what their safety tuning means, and I think showing that refusal generalizes is sufficient to answer that question in the affirmative. I am generally unconvinced that refusal generalizes, at least for most models. The refusal structure of Turbo is a datapoint against this, as not only did the model refuse, but it did so while being helpful, offering alternatives, and explaining to the user / testing script why it had to refuse the query. 

