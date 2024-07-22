+++
title="reval"
date=2024-07-21
+++

Reval is a single-file evaluation framework for evaluating large language models on your own data.

# motivation

Most benchmarks don't translate well into real world performance, on your tasks. There are multiple benchmarks where claude-3.5-sonnet scores higher than gpt-4o, and vice versa. How should you know which one of the two to use for your business?

Right now, you don't, and Reval solves that. 

# usage

The most simple use of Reval is

```bash
python reval.py --task="path/to/data.csv" --models=["model_name"]
```

You may have to set your `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `TOGETHER_API_KEY` env variables.

By default, Reval supports all OpenAI, Anthropic, and together.ai models. It also support common disambiguations (eg. `claude-3.5-sonnet` calls sonnet, instead of needing to use the internal name)

Reval can be called in a few simple modes: Single and Arena. Single mode evaluates a single model against your data, while Arena mode evaluates 2 or more models on your data. Reval defaults to Single mode, and Arena mode can be enabled with the `--mode="arena"` flag. In this case, `--models` should be a list >2 models.

### data schema:

Your `data.csv` can take on a few of the following forms (please note that column names must be exact). However, column orders may be arbitrary. Columns that do not fit in the scheme will be ignored:

#### schema 1
```
| tasks |
| ----- |
```

In this case, Reval generates failure and success criteria for each task in tasks. This is then converted to a table like schema 3, and saved in the current directory

#### schema 2

For more control over your data, you can either provide good and bad examples, or your own success and failure criteria (see schema 3)

```
| tasks | good-examples |
| ----- | ------------- |
```

```
| tasks | bad-examples |
| ----- | ------------ |
```

```
| tasks | good-examples | bad-examples |
| ----- | ------------- | ------------ |
```

are all valid schema here, and Reval will generate success and failure criteria based on it. 

#### schema 3

```
| tasks | success-criteria | failure-criteria |
| ----- | ---------------- | ---------------- |
```

If either success critieria or failure criteria don't exist, Reval will generate a column for it. This is the jumping off point from where models are evaluated. 

### output schema

Reval will save one `.csv` in the current directory of your `data.csv` with success and failure criteria included. If success and failure criteria already exist in `data.csv`, this will be a duplicate. 

In addition, a file `results.json` will be generated. The schema of this file will differ by mode. 

In Single mode:
```json
[
    {
        "model": model_name<str>, 
        "score": score<int>
    }
]
```

In Arena mode:
```json
[
    {
        "model": model_name<str>, 
        "score": score<int>, 
        "elo": elo<int>, 
        "num_matches": num_matches<int>
    }
]
```

A raw data file `raw_data.json` will also be created. Output schema for that will be included later.

### Parameters

| Parameter | Description | Type |
| --------- | ----------- | ---- |