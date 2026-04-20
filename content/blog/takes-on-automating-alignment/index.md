+++
title = "Takes on Automating Alignment Research"
date=2026-04-19
draft=false
+++

Recently, AI Models have become good at long horizon tasks. In addition, they seem
especially good at the types of long horizon tasks that allow for a quick and short
feedback loop. For example, on [MirrorCode](https://epoch.ai/blog/mirrorcode-preliminary-results),
models were able to generate tens of thousands of lines of code, a task that would
have taken a human several days to complete. This was possible because of
the number of tests provided to the model, such that the model was able to write
code that would pass many tests.

In no way is this discrediting the capabilities of the models, but instead showing
that they excel on tasks that allow for the models to see when they're making progress.

For more evidence, Anthropic published [Automated Weak-to-Strong Researcher](https://alignment.anthropic.com/2026/automated-w2s-researcher/?curius=2910), which had models hill-climb an alignment
task in an autoresearch loop, outperforming human researchers (though I think that,
if humans had run the same number of experiments, they could have outperformed the 
model, the model in the autoresearch loop could run more experiments).

Altogether, this presents the case that models are good at long horizon tasks that
are attached to some metric when being asked to push that metric to some extrema.

I think the right framing for automating alignment research is to find tasks that
a) are either directly alignment tasks that you'd like to improve or b) find tasks
that when improved will lead to better alignment indirectly. Anthropic did the former,
but there are likely many tasks where the latter is also possible.

You could do this quite feasibly across many fields of alignment;
controls, monitorability, weak-to-strong generalization, and so on. This
leads to forms of reward-hacking really easily, and this encourages reward hacking if 
you do not do your environment design carefully. However, you could keep your validation
set in a place the model couldn't access, add honeypots, and so on as a way to detect
or prevent reward hacking.

I think people are probably underestimating the amount of work that automated
alignment research can do because this capability is quite new, and there are 
often small changes that allow you to get useful information from hillclimbing a 
task. For example, you can optimize a data filtering experiment by using a metric 
along the lines of reduction in misalignment for compute / number of datapoints removed,
and this would yield a viable way to get useful information from hillclimbing a task.
howI write this post in the hopes that more people will consider converting 
alignment tasks into this hillclimbable form as a first attempt at doing their 
alignment research.






