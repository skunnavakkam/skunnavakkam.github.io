+++
title="Speculative Decoding for GRPO"
date=2025-08-08
draft=true
description="Using speculative decoding to try speeding up GRPO"
+++

Recently, long-form reasoning traces accompany many of our frontier language models trained with group relative policy optimization (GRPO). Like with PPO and other transformer reinforcement learning methods, training is often bottlenecked on inference performance. However, unlike other transformer RL methods, GRPO tends to produce much longer reasoning traces.

In language model inference, you have two key phases: *prefill* and *decode*. The prefill phase fills in the context window into the KV cache etc, and the decode phase is responsible for generating new tokens. Since the prefill phase is paralleized over all tokens in the context window, it is generally far more compute bottlenecked. However, the decode phase is sequential, so it's generally bound by memory bandwidth.

In speculative decoding, a smaller draft model (somethings just an adapter on the last layer of the model) is used to generate some $n$ tokens in a sequence, after which the full model is used to check the validity of the draft model's output. Since the full model checks $n > 1$ tokens, we can hope that this allows for memory to be a lesser bottleneck when compared to compute, since the same set of weights are able to be used for $n$ tokens instead of $1$. 

Since reasoning traces are often long, on the order of $10,000$ tokens for frontier models like DeepSeek-R1, reasoning models are likely to be more decode, and thus memory, bottlenecked than other RL models. This justifies exploring using speculative decoding in order to speed up inference for training. 

To ensure that the draft model is able to generate tokens close enough to the base model, we continuously update the draft model's weights to match the base model's generations. This is done by using a subset of the base model's generations during GRPO and updating the draft model's policy.

## Implementation

We load Qwen3-4B into SGLang with an EAGLE3 draft model. The EAGLE draft model is a 1-layer adapter on the last layer of the base model to allow for multi-token generations. 

At each step, we generate $n$ rollouts from the base model. We then calculate advantages 

```python
advantage = (rewards - r_mean) / (r_std + 1e-8)
```

After tokenizing, we create our loss ratio `ratio = torch.exp(new_logprobs - old_logprobs)` and clip loss like in the GRPO paper 

```python
pg_loss = -torch.min(
    ratio * advantage, torch.clamp(ratio, 1 - eps, 1 + eps) * advantage
).mean()
```

We then minimize the loss through AdamW.

Then, once every `train_draft_model` steps, we update the draft model's weights to ensure that it suffices as a draft model. SGLang's Specforge takes care of a lot of this, and this step essentially looks like `scripts/train_eagle3_online.py` in the Specforge repo.

Then, we save both sets of weights to disk, and synchronize the weights to the SGLang server. We sync base model weights every step, and draft model weights every `train_draft_model` steps.

## Results

Due to CUDA versioning errors, and specifically the `undefined symbol: _ZN3c104cuda9SetDeviceEab` error I've been perpetually running into, I've been unable to run the full training loop. I'm going to weight for a patch on the SGLang / vLLM side before running the script. However, it should work great. 

