#import "@preview/basic-resume:0.2.8": *

#let name = "Sudarsh Kunnavakkam"
#let location = "Pasadena, CA"
#let email = "kvsudarsh786@gmail.com"
#let github = "github.com/skunnavakkam"
#let phone = "+1 (949) 254-8232"
#let personal-site = "sudarsh.com"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  github: github,
  phone: phone,
  personal-site: personal-site,
  accent-color: "#26428b",
  font: "New Computer Modern",
  paper: "us-letter",
  author-position: left,
  personal-info-position: left,
)

== Work Experience
#work(
  company: "Model Evaluation and Threat Research (METR)",
  location: "Berkeley, CA",
  title: "Research Assistant (Contract)",
  dates: dates-helper(start-date: "Sep 2023", end-date: "Present")
)
- Designed and assisted evaluations for estimating agentic time-horizons of language models
- Co-lead engineer of a state of the art evaluation for Chain-of-Thought Faithfulness of Large Langauge Models
- Worked with contractors to red-team LLMs and curate datasets such as #link("metr-evals/daft-math")[DAFT Math] of difficult, free-response questions 


#work(
  company: "ShapiroLab at Caltech",
  location: "Pasadena, CA",
  title: "Undergraduate Research Intern",
  dates: dates-helper(start-date: "Nov 2024", end-date: "Present")
)
- Developed ultrasound reporter cells for biochemical signal sensing
- Wrote high throughput computer vision screens for optical and ultrasound imaging to scale to 1000s of cells / day
- Designed custom Protein-Protein linkers with ESM3 and Alphafold
- Imaged cells using xAM mode ultrasound
- *Skills*: CAD, Signal Processing, Wet Lab

#work(
  company: "Supervised Program for Alignment Research",
  location: "Remote",
  title: "Research Fellow",
  dates: dates-helper(start-date: "Feb 2025", end-date: "May 2025")
)
-  Conducted research on the safety of multi-agent systems, focusing on LLM-based agents' cooperation and collusion and developed a benchmarking environment to analyze agents' actions during negotiation. 
- Implemented a complex, _continuous double auction_ agent arena as a model environment for LLM collusion

 
#work(
  company: "Lee Nano-Optics Lab at UC Irvine",
  location: "Irvine, CA",
  title: "High School Research Intern",
  dates: dates-helper(start-date: "Dec 2022", end-date: "Jun 2024")
)
- Scaled 2D ITO fabrication from mm² to multi-cm² sizes
- Developed new refractive index characterization method replacing repeated ellipsometry
- Created transfer-matrix reverse solver to enhance ellipsometric data interpretation

== Education

#edu(
  institution: "California Institute of Technology",
  location: "Pasadena, CA",
  dates: "In progress",
  degree: "B.S. in Physics & Computer Science"
)

#edu(
  institution: "University High School",
  location: "Irvine, CA",
  dates: dates-helper(start-date: "Sep 2020", end-date: "Jun 2024"),
  degree: "High School Diploma"
)



== Publications

+ A. Deng\*, S. Von Arx\*, B. Snodin, #underline[S. Kunnavakkam], T. Lanham, "CoT May Be Highly Informative Despite "Unfaithfulness"" by _METR_

+ K. Agarwal, V. Teo, J. Vaquez, #underline[S. Kunnavakkam], V. Srikanth, A. Liu, "Evaluating LLM Agent Collusion in Double Auctions" at _ICML 2025 Workshop on Multi-Agent Systems in the Era of Foundation Models _, Vancouver, Canada, July 2025.


+ D. Dang, Q. Dang, A. Anopchenko, C. M. Gonzalez, S. Love, C. Effarah, #underline[S. Kunnavakkam], W. Wang, J. Calixto, and H. W. Lee, ``Epsilon-Near-Zero Photonics in Planar and Optical Fiber Platforms,'' presented at the _53rd Winter Colloquium on the Physics of Quantum Electronics (PQE 2024)_, Snowbird, Utah, USA, Jan 2024

+ C. J. Effarah\*, T. Chen\*, #underline[S. Kunnavakkam]\*, C. M. Gonzalez, H. W. Lee, "Liquid Metal Printed 2D ITO for Nanophotonic Applications," in _California-US Government Workshop on 2D Materials_, Irvine, California, USA, Sep 2023

+ A. Anopchenko, C. M. Gonzalez, D. Dang, Q. Dang, S. Love, L. Zhang, S. Gurung, K. Nguyen, T. Chen, J. Calixto, #underline[S. Kunnavakkam], A. Palmer, and H. W. Lee, "Epsilon-Near-Zero Optics in Planar and Optical Fiber platforms," in _SPIE Optics + Photonic Conference 2023_, San Diego, California, USA, Aug 2023.



== Projects

#link("https://github.com/METR/CoT-faithfulness-and-monitorability")[
  #project(
    name: "METR: Faithfulness and Monitorability Eval",
    dates: 2025
  )
]
- Co-authored METR research report on chain-of-thought (CoT) faithfulness (Aug 2025), extending Anthropic’s seminal evaluation to three frontier models and publishing findings for the wider safety community
- One of two lead engineers on the project, responsible for building out the evaluation framework
- Ran 100+ hours of red-team prompting with Gray Swan, uncovering worst-case CoT obfuscation tactics and hardening monitoring methods.
- Coordinated building “DAFT Math” free-response dataset to replace MCQs, removing answer-guessing and tightening evaluation rigor.



#link("https://github.com/andyjliu/llm-agent-collusion")[
  #project(
    name: "LLM Agent Collusion Arena",
    dates: 2025
  )
]
- Implemented a continuous double auction system for agents
- Implemented oversight, monitors, and other experimental conditions to test influence on collusion
- Added logging and metrics with WandB
- Accepted to ICML 2025 Workshop on Multi-agent Systemsa

#link("https://sudarsh.com/blog/em-sim")[
  #project(
    name: "EM Simulator",
    dates: 2025,
  )
]
- Reverse mode differentiable FDFD simulators in Jax for inverse design
- Forward and backward diffusion models trained with DDPM and Physics-inspired reward functions \
  to approximate steady state solutions
- Implemented fast FDTD for transient events + implemented Fourier Neural Operators for speedup

#link("https://sudarsh.com/blog/backpropogate-circuits/")[
#project(
  name: "Circuit Simulator",
  dates: 2025,
)]
- Reverse-mode autodiff for RLC network optimization
- Gradient-based optimization for component selection
- Works in time domain, as well as just to do component selection
- Implemented custom `spsolver` that is differentiable in JaX

#link("https://sudarsh.com/blog/soft-token-adversarial-attack/")[
#project(
  name: "Adversarial Attack Using Soft Tokens",
  dates: 2024,
)]
- Soft-token embedding technique for adversarial text generation
- Orthogonal Procrustes Alignment for token mapping
- Demonstrated attack generalization across models (PyTorch)

#project(
  name: "Scanning Tunneling Microscope",
  dates: 2024,
)
- Built working STM for \$1,000 using open-source design
- Achieved atomic-resolution imaging capabilities (Circuit Design, Signal Processing, Mechanical Engineering)

== Awards

#project(
  name: "ARENA 6.0 Attendee",
  dates: 2025,
)

#project(
  name: "Non-trivial Fellow",
  dates: 2024,
)

#project(
  name: "Physics Brawl, top 10 US High School Teams",
  dates: "2024, 2023"
)

#project(
    name: "USACO Silver",
    dates: 2023
)

#project(
    name: "AIME Qualifier", 
    dates: 2023
)

