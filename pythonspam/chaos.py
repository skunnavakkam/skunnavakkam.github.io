import numpy as np
import matplotlib.pyplot as plt
from math import sin, cos

SIZE = 5
RESOLUTION = 101
friction = 0.008
dt = 0.001
beta = 1
alpha = 1
n_timesteps = 10_000

# we do some basic setup here
pendulum_x = np.linspace(-SIZE // 2 + 1, SIZE // 2, RESOLUTION)
pendulum_y = np.linspace(-SIZE // 2 + 1, SIZE // 2, RESOLUTION)
pendulum_x, pendulum_y = np.meshgrid(pendulum_x, pendulum_y)

pendulum_x_dot = np.zeros_like(pendulum_x)
pendulum_y_dot = np.zeros_like(pendulum_y)

final_colors = np.zeros_like(pendulum_x)

attractor_x = []

for _ in range(n_timesteps):

    F_x = -1 * beta * pendulum_x + 

    pass

plt.imshow(final_colors, cmap="gray")
plt.show()
