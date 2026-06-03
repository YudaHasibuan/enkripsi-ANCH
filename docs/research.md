# Academic Research & Chaos Theory

The ANCH Framework sits at the intersection of dynamical systems, non-linear chaos mappings, and neural parameters.

---

## 1. Chaos Theory in Cryptography

Chaotic maps are highly valued in cryptography due to several mathematical properties:

*   **Extreme Sensitivity to Initial Conditions**: Often called the "Butterfly Effect", even a tiny variation in the starting value $x_0$ (such as $10^{-15}$) generates entirely different orbits.
*   **Ergodicity**: The system traverses all states in its phase space over time, ensuring values are evenly spread.
*   **Pseudo-randomness**: Although deterministic, chaotic orbits pass standard statistical suites for randomness (like NIST).

---

## 2. Logistic Map Attractor

The primary chaotic source in ANCH is the **Logistic Map**:

$$x_{n+1} = r \cdot x_n \cdot (1 - x_n)$$

For the system to exhibit chaotic behavior, the parameter $r$ must reside in the range $[3.57, 4.0]$. If $r < 3.57$, the orbits settle into stable periodic points or bifurcations. For $r > 4.0$, the orbits rapidly diverge outside the interval $(0, 1)$.

---

## 3. Tent Map Attractor

The **Tent Map** is a piecewise linear map that exhibits full chaotic dynamics when $\mu \approx 2.0$:

$$x_{n+1} = \mu \cdot \min(x_n, 1 - x_n)$$

It offers flat probability density, which helps smooth out potential statistical biases found in the logistic map.

---

## 4. Hénon Map Attractor

The **Hénon Map** is a discrete-time two-dimensional dynamical system:

$$x_{n+1} = 1 - a \cdot x_n^2 + y_n$$
$$y_{n+1} = b \cdot x_n$$

It is one of the most famous chaotic attractors, producing fractal structures in two-dimensional space. ANCH uses periodic boundary wrapping to prevent divergence and maps the state variables into the hash schedule.

---

## 5. Neural Parameterization

In traditional chaos-based hashing, the initial parameters ($x_0$, $r$) are kept static. This makes the hash vulnerable to algebraic reconstruction attacks where an attacker solves the equations.

ANCH mitigates this by passing the input data through a **linear projection layers**. The input features (like length, entropy, and bigram weights) determine the parameters. Therefore, **every distinct input runs a completely different chaotic map setup**, creating a moving target for cryptanalysis.
