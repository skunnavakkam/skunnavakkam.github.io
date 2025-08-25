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
- Lead engineer for internal project to estimate the agentic time horizon of LLMs at much lower cost
- Co-lead engineer of a state of the art evaluation for Chain-of-Thought Faithfulness of Large Langauge Models
- Helped lead teams of contractors red-team LLMs and curate datasets such as #link("metr-evals/daft-math")[DAFT Math] of difficult, free-response questions 


#work(
  company: "ShapiroLab at Caltech",
  location: "Pasadena, CA",
  title: "Undergraduate Research Intern",
  dates: dates-helper(start-date: "Nov 2024", end-date: "Present")
)
- Building better BCIs by engineering towards 10ms response time ultrasound reporters
- Built a high throughput ultrasound screening platform to scale to 1000s of variants per day
- Designed custom proteins with RFDiffusion, Alphafold, and ESM3 for 10x faster kinetics

#work(
  company: "Supervised Program for Alignment Research",
  location: "Remote",
  title: "Research Fellow",
  dates: dates-helper(start-date: "Feb 2025", end-date: "May 2025")
)
- Implemented a complex, _continuous double auction_ agent arena as a model environment for LLM collusion
- Benchmarked emergent collusion between LLMs under various pressures
- Work accepted to ICML 2025

 
#work(
  company: "Lee Nano-Optics Lab at UC Irvine",
  location: "Irvine, CA",
  title: "High School Research Intern",
  dates: dates-helper(start-date: "Dec 2022", end-date: "Jun 2024")
)
- Scaled 2D ITO fabrication from mm² to multi-cm² sizes
- Developed new transmission matrix method replacing repeated ellipsometry
- Created transfer-matrix reverse solver to easily get refractive index information under nonlinear conditions

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



== Selected Publications

+ A. Deng\*, S. Von Arx\*, B. Snodin, #underline[S. Kunnavakkam], T. Lanham, "CoT May Be Highly Informative Despite "Unfaithfulness"" by _METR_

+ K. Agarwal, V. Teo, J. Vaquez, #underline[S. Kunnavakkam], V. Srikanth, A. Liu, "Evaluating LLM Agent Collusion in Double Auctions" at _ICML 2025 Workshop on Multi-Agent Systems in the Era of Foundation Models _, Vancouver, Canada, July 2025.

+ C. J. Effarah\*, T. Chen\*, #underline[S. Kunnavakkam]\*, C. M. Gonzalez, H. W. Lee, "Liquid Metal Printed 2D ITO for Nanophotonic Applications," in _California-US Government Workshop on 2D Materials_, Irvine, California, USA, Sep 2023




== Projects

#link("https://github.com/METR/CoT-faithfulness-and-monitorability")[
  #project(
    name: "METR: Faithfulness and Monitorability Eval",
    dates: 2025
  )
]
- Co-lead engineer on METR research report on chain-of-thought (CoT) faithfulness (Aug 2025), extending Anthropic’s seminal evaluation to three frontier models and publishing findings for the wider safety community



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

