+++
title="Intelligent Design"
date=2024-02-22
+++

# Definitions
We start with a task and a set of design constraints to achieve our end goal. Almost everything is required to "do something" (intentionally vague), so we can treat almost all of what we make as a function. It takes in an input state \\(I\\) and contains a set of parameters \\(X\\), which and then returns an output state \\(O\\). For example:
- A gearbox might take in an input state of a torque being applied at one end, and would output a different torque at the other end. 
- A full-bridge rectifier takes in some waveform and outputs the absolute value

Our goal is to both
1. Modify the functions so that it *can* provide the desired output
2. Tune the parameters such that it *does* provide the desired output

This second point is largely solved, through hyperparamter tuning. 

## Hyperparameter Tuning

This is what is touted as "inverse-design", where you feed in an input, a desired output, and the computer automatically finds the local optimum for your current setup. This works through simple gradient descent.

$$
X := X - \nabla F(X)
$$

The clear issue is the question of local minima. Regardless of how long you run gradient descent, you will never make a voltage divider into a binary adder. We should expand our design space. 

## The Design Space
A human is needed in the inverse design process to reduce the search space. Parameter tuning cannot do this easily, but LLMs can. The restriction of LLMs to language is an issue here, and more having there be an internal representation of the design that could be translated to language or design is ideal, but it is still workable.

This means that we can do the following thing. 

# Implementation

The Agent loop is important here. I envision two (three?) forms of grounding here, where I use the term "grounding" to refer to feedback / information collected from the world outside the LLM's text environment. 


# Application

## Circuit Design
This seems like it should be possible without any specific tools. Generating a KiCAD netlist seems easy enough. However, just like high level languages are easier than assembly, there could be an easier way to design circuits in text. [Atopile](https://atopile.io) presents one such option. 

Here is a sample circuit for a Voltage divider:
```
from "generics/resistors.ato" import Resistor

module VoltageDivider:
    signal top
    signal out
    signal bottom

    r_top = new Resistor
    r_top.footprint = "R0402"
    r_top.value = 100kohm +/- 10%

    r_bottom = new Resistor
    r_bottom.footprint = "R0402"
    r_bottom.value = 200kohm +/- 10%

    top ~ r_top.p1; r_top.p2 ~ out
    out ~ r_bottom.p1; r_bottom.p2 ~ bottom
```

This gives 
$$
V_{out} = V_{in} \frac{R1}{R1+R3}
$$

