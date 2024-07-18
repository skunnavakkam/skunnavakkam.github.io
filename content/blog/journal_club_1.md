+++
title="Journal Club: July 10 2024"
date=2024-07-10
draft=false
+++

This is a collection of writing that I have enjoyed this week. All the headings are clickable links to the writing. 

#### [Approaching Human Level Forecasting with LLMs](https://arxiv.org/pdf/2402.18563)

Me and a few others at non-trivial referenced this paper for the Metaculus forecasting contest. Really fun to implement, easy one day build, and with Claude + prompting, the fine-tuning aspect is mostly unecessary. I don't have a brier score for our model yet.

#### [Refusal in LLMs is mediated by a single direction](https://www.lesswrong.com/posts/jGuXSZgv6qfdhMCuJ/refusal-in-llms-is-mediated-by-a-single-direction)

Just how weak are LLM protections? We knew they could be tuned out for a while, but their refusal to obey harmful instructions is a single, easily interpretable direction in activation space. I know that this shows that our current safety techniques are weak, but I'm not sure how it reflects on the nature of LLMs learning when to refuse directions.

#### [Extrinsic Hallucinations in LLMs](https://lilianweng.github.io/posts/2024-07-07-hallucination/)

It's a Lilian Weng article! Do I need to say more? Great read, but rather long.

#### [Differentiable Sparse Solvers](https://dansblog.netlify.app/posts/2022-05-20-to-catch-a-derivative-first-youve-got-to-think-like-a-derivative/to-catch-a-derivative-first-youve-got-to-think-like-a-derivative) 
Cool read for a scientific computing project I'm working on. Fun blog in general. 

#### [ReFT: Representation Finetuning for Language Models](https://arxiv.org/abs/2404.03592)

A more extreme version of PeFT, where the number of learned parameters can be reduced significantly.

#### [JAX FDM: A differentiable solver for inverse form-finding](https://arxiv.org/pdf/2307.12407)

Same scientific computing project, but this is pre-implemented. Very cool results using the solver!

#### [200 Concrete Open Problems in Mech Interp](https://www.alignmentforum.org/posts/LbrPTJ4fmABEdEnLf/200-concrete-open-problems-in-mechanistic-interpretability)
Nanda's great introductory blog. I come back to this really often, so much low hanging fruit here.

#### [Fine-tuning is not sufficient for capability elicitation](https://www.alignmentforum.org/posts/4KLHJY9sPE7q8HK8N/fine-tuning-is-not-sufficient-for-capability-elicitation)

Large language models cannot convert between two complex representations of data. However, I have seen papers that they do transform small chunks of data to more favorable representations. This seems like a good topic to investigate, namely is there a set of features and neurons that lead to these features transforming, and can you merge in more of these features to have more representation transformation?

#### [Understanding Addition in Transformers](https://arxiv.org/html/2310.13121v5)

One of the problems from the aforementioned Nanda blog, where they explore phase changes in addition in transformers. Cool read, though I think that there is still more here to be milked.

#### [Interpreting and Steering Features in Images](https://www.featurelab.xyz/)

SAEs on images! There is a gorilla feature here, so you can make images more or less gorilla-y

#### [Contra: Bottleneck T5 Text Autoencoder.ipynb](https://colab.research.google.com/drive/1CF5Lr1bxoAFC_IPX5I0azu4X8UDz_zp-?usp=sharing)

My first introduction to autoencoders months ago, and I still use it to experiment. 



