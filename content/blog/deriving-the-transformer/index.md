+++
title="Deriving the Autoregressive Transformer"
date=2025-09-01
draft = true
+++

The year is 2015. You want to invent a model that can competently generate natural language. Here's how you might have been able to go about building the Autoregressive Transformer to its current form. The current transformer is a huge endeavor, shaped by many people, and many mistakes along the way, and this is an idealized scenario.

## Step 1: Breaking down text

Language typically doesn't fit into strict boxes. However, we want a way to compartmentalize language into smaller chunks that computers can understand. For this, we motivate the *Tokenizer*. You think back to the way that you were taught language. Let's look at the word "running". We know that the *-ing* at the end of the word is a suffix that indicates that the word is in the present text. In a way, the *-ing* suffix modifies the base word *run*.

Since we find it useful, these suffixes and other common parts of speech might also be useful abstractions to make it easier for the computer to learn language. We could perhaps break down `running -> run + -ing`. 

Doing this manually is not feasible, so we turn to the tokenizer. The tokenizer used in many LLMs, the byte-pair encoder (BPE) was invented in 1994, so a while before you set off on your endeavor. 

The BPE tokenizer works through looking through a training corpus and finding the most common pairs of bytes and merging them into a new token. This allows for more frequent n-grams to be represented as a single token, allowing both for compression and also more a more efficient and digestible representation of the language.

![tokenizer](tokenizer.png)

Before we go any further, we need to keep special tokens in mind. It's important for the model to be able to distinguish between the beginning of the sentence, or a user role, and the actual text. We can give these special tokens a unique token id, and we also do this at the tokenizer training step.

A naive implementation of the BPE tokenizer is pretty slow. Instead, we implement the BPE tokenizer using a heap to keep a track of active counts, and then use this to merge the most common pairs. The implementation can be found at `tokenizer.py` but Python pseudocode is below:

```python
class BPETokenizer:
    def __init__(self, special_tokens: list[str], vocab_size: int):
        self.vocab_size = vocab_size
        self.special_tokens = special_tokens

        # token->id and id->token (token as bytes at the boundary; internally we use ints)
        self.tok2id: Dict[bytes, int] = {bytes([i]): i for i in range(256)}
        self.id2tok: Dict[int, bytes] = {i: bytes([i]) for i in range(256)}
        self.curr_num_tokens = 256

        for token in special_tokens:
            tok2id[bytes([token])] = self.curr_num_tokens
            id2tok[self.curr_num_tokens] = bytes([token])

    def train(self, corpus: list[list[str]]):
    
```

This is still pretty slow, and takes a few hours to train on my laptop.

## Step 2: Embeddings (part 1)

Each token is represented as a single number between 0 and `vocab_size - 1`. However, this isn't a very good input format for the model. For one, the difference between two tokens is fairly small, and in order to get more information we have to train an expansion from the token id to a higher dimension vector. 

Instead, we can represent tokens as a 1-hot vector, such that $v_i = 1, v_j = 0, j \neq i$. This gives a vector that looks like

$$
\langle 0, \cdots, 1, \cdots, 0 \rangle
$$

We can then convert this to an embedding vector, which is a way to transform the 1-hot vector into a *dense* vector that contains some *semantic* information about the token. A convenient way to do this is with an embedding matrix $E$ with `vocab_size` rows and `embedding_dim` columns. Multiplying the 1-hot vector by $E$ acts as a lookup table. Correspondingly, I'm going to use $E(string)$ to refer to the embedding of the string. This embedding matrix gets trained through backpropogation during training. 

Some of the first approaches to embedding were done by Word2Vec in 2013, and its training process preserves semantics. This allowed for some cool results, such as being able to subtract and compare vectors. For example, 

$$
E("king") - E("queen") \approx E("man") - E("woman")
$$

### Detour: Seq2Seq

Seq2Seq was a landmark machine learning 

## Step 3: Attention

At this point, we have 